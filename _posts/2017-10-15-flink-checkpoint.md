---
layout: post
title: 【Flink】Flink容错之Checkpoint机制源码分析
tags: 原创 Flink
category: 大数据
---

目录：

* [Flink Checkpoint简介](#简介)
* [Flink Checkpoint几个基本问题](#几个基本问题)
	* [哪些对象需要容错](#哪些对象需要容错)
	* [State是什么](#State是什么)
	* [Barrier是什么](#Barrier是什么)
* [Flink Checkpoint过程](#FlinkCheckpoint过程)
	* [第一阶段](#第一阶段)
	* [第二阶段](#第二阶段)
	* [第三阶段](#第三阶段)
	* [第四阶段](#第四阶段)
* [运行时Checkpoint触发](#运行时Checkpoint触发)

## 简介

Apache Flink 提供了Flink应用exactly-once保证的容错机制。Flink的容错机制是基于异步的分布式快照来实现的，参见论文[Lightweight Asynchronous Snapshots for Distributed Dataflows](https://arxiv.org/abs/1506.08603)。这些分布式快照可存储在JobManager或HDFS等可配置的存储后端。在遇到程序错误（或其他硬件错误）时，Flink停止分布式数据流，重置到最近成功的checkpoint，重放输入流和各算子的状态。保证被重启的并行数据流中处理的任何一个记录都不是checkpoint 状态之前的一部分，实现正好一次的容错机制。

Flink基于分布式快照的Checkpoint容错机制是Flink最大的亮点之一。（其他还有Flink的Window机制，乱序记录的处理等等）。接下来，本文从源码层面分析整个Flink Checkpoint的过程。

## 几个基本问题

在Checkpoint源码分析前首先介绍和Checkpoint相关的几个基本问题。

### 哪些对象需要容错

在Flink中，需要具备容错能力的有这样两类对象：function 和 operator。其中function通过实现Checkpointed接口（新版本改由CheckpointedFunction）来进行snapShot，operator通过实现StreamOperator接口来进行snapShot。这两个接口都包含了与快照有关的方法，如 snapshotState等。

### State是什么

state一般指一个具体的task/operator的状态。而checkpoint则表示了一个Flink Job在某一时刻的一份全局状态快照，包含了所有task/operator的状态。Flink中包含两种基础的状态：Keyed State和Operator State。

**Keyed State**

顾名思义，就是基于KeyedStream上的状态。这个状态是跟特定的key绑定的，对KeyedStream流上的每一个key，可能都对应一个state。

**Operator State**

与Keyed State不同，Operator State跟一个特定operator的一个并发实例绑定，整个operator只对应一个state。相比较而言，在一个operator上，可能会有很多个key，从而对应多个keyed state。

**原始状态和Flink托管状态 (Raw and Managed State)**

Keyed State和Operator State在Flink中可以以两种形式存在：原始状态和托管状态。

托管状态是由Flink框架管理的状态，如ValueState, ListState, MapState等，通过框架提供的接口，我们来更新和管理状态的值。而raw state即原始状态，由用户自行管理状态具体的数据结构，框架在做checkpoint的时候，读写状态内容使用的是字节流，对其内部数据结构一无所知（也就无法做一些优化）。通常在DataStream上的状态建议使用托管的状态，当实现一个用户自定义的operator时，会使用到原始状态。详细的State描述请参见官网文档。

## Barrier是什么

Flink 分布式快照的核心概念之一就是数据栅栏（barrier）。这些 barrier 被插入到数据流中，作为数据流的一部分和数据一起向下流动。barrier 不会干扰正常数据，数据流严格有序。一个 barrier 把数据流分割成两部分：一部分进入到当前快照，另一部分进入下一个快照。每一个 barrier 都带有快照 ID，并且 barrier 之前的数据都进入了此快照。barrier 不会干扰数据流处理，所以非常轻量。多个不同快照的多个 barrier 会在流中同时出现，即多个快照可能同时创建。

![](https://www.iteblog.com/pic/flink/flink_stream_barriers_iteblog.svg)

barrier 在数据源端插入，当快照n的 barrier 插入后，系统会记录当前快照位置值，然后 barrier 继续往下流动，当一个算子从其输入流接收到所有标识快照n 的 barrier 时，它会向其所有输出流发射一个标识快照n的barrier n。当 sink端从其输入流接收到所有 barrier n 时，它向CheckpointCoordinator 确认快照n 已完成。当所有 sink 端确认了这个快照，快照就被标识为完成。

![](https://www.iteblog.com/pic/flink/flink_stream_aligning_iteblog.svg)

注意到一点，当接收超过一个输入流的算子需要基于 barrier 对齐。就像上图所示的：

　　1、算子只要一接收到某个输入流的 barrier n，它就不能继续处理此数据流后续的数据，直到该算子接收到其余流的 barrier n。否则会将属于 snapshot n 的数据和 snapshot n+1的搞混

　　2、barrier n 所属的数据流先不处理，从这些数据流中接收到的数据被放入接收缓存

　　3、当从最后一个流中提取到 barrier n 时，该算子会发射出所有等待向后发送的数据，然后发射snapshot n对应的barrier n

　　4、经过以上步骤，算子恢复所有输入流数据的处理，优先处理输入缓存中的数据

## FlinkCheckpoint过程

先放上自己根据源码和文档画出的流程图。图中的1.1 2.2等过程与下文是一一对应的。

![](http://rann.cc/assets/img/tech/checkpoint.png)

### 第一阶段

Client端StreamGraph生成并转化为JobGraph的过程。这里不展开阐述了。注意到一点的是在JobGraph生成的时候会调用
configureCheckpointing方法，进行checkpoint配置。**该方法一个非常重要的地方是triggerVertices.add(vertex.getID())这个操作，它只会将input的JobVertex加入到触发checkpoint的triggerVertices集合。这一步决定了后续CheckpointCoordinator发起的triggerCheckpoint的一系列逻辑只针对source端，注意到这一点非常重要。**

1.1 JobGraph生成后会被提交给JobManager。

```java
private void configureCheckpointing() {
    CheckpointConfig cfg = streamGraph.getCheckpointConfig(); //取出Checkpoint的配置
    
    if (cfg.isCheckpointingEnabled()) {
        long interval = cfg.getCheckpointInterval(); //Checkpoint的时间间隔

        // collect the vertices that receive "trigger checkpoint" messages.
        // currently, these are all the sources
        List<JobVertexID> triggerVertices = new ArrayList<JobVertexID>();

        // collect the vertices that need to acknowledge the checkpoint
        // currently, these are all vertices
        List<JobVertexID> ackVertices = new ArrayList<JobVertexID>(jobVertices.size());

        // collect the vertices that receive "commit checkpoint" messages
        // currently, these are all vertices
        List<JobVertexID> commitVertices = new ArrayList<JobVertexID>();
        
        for (JobVertex vertex : jobVertices.values()) {
            if (vertex.isInputVertex()) {  //只有对source vertex，才加入triggerVertices，因为只需要在源头触发checkpoint
                triggerVertices.add(vertex.getID());
            }
            // TODO: add check whether the user function implements the checkpointing interface
            commitVertices.add(vertex.getID()); //当前所有节点都会加入commitVertices和ackVertices
            ackVertices.add(vertex.getID());
        }

        JobSnapshottingSettings settings = new JobSnapshottingSettings( //生成JobSnapshottingSettings
                triggerVertices, ackVertices, commitVertices, interval,
                cfg.getCheckpointTimeout(), cfg.getMinPauseBetweenCheckpoints(),
                cfg.getMaxConcurrentCheckpoints());
        jobGraph.setSnapshotSettings(settings); //调用setSnapshotSettings

        // if the user enabled checkpointing, the default number of exec retries is infinitive.
        int executionRetries = streamGraph.getExecutionConfig().getNumberOfExecutionRetries();
        if(executionRetries == -1) {
            streamGraph.getExecutionConfig().setNumberOfExecutionRetries(Integer.MAX_VALUE);
        }
    }
}
```

小结：第一阶段主要是client端的JobGraph的生成并拿到所有checkpoint的配置信息，然后提交任务给JobManager。

### 第二阶段

2.1 JobManager调用submitJob方法时根据JobGraph构建ExecutionGraph，并拿到所有Checkpoint的配置，包括上一步提到的触发集合triggerVertices、ACK集合ackVertices和commit集合commitVertices等。同时，ExecutionGraph会初始化checkpointCoordinator，并为checkpointCoordinator 创建一个checkpoint定时任务触发的开关CheckpointCoordinatorDeActivator。

ExecutionGraph创建CheckpointCoordinator

```java
// create the coordinator that triggers and commits checkpoints and holds the state
		checkpointCoordinator = new CheckpointCoordinator(
			jobInformation.getJobId(),
			interval,
			checkpointTimeout,
			minPauseBetweenCheckpoints,
			maxConcurrentCheckpoints,
			externalizeSettings,
			tasksToTrigger,
			tasksToWaitFor,
			tasksToCommitTo,
			checkpointIDCounter,
			checkpointStore,
			checkpointDir,
			ioExecutor,
			SharedStateRegistry.DEFAULT_FACTORY);

		// register the master hooks on the checkpoint coordinator
		for (MasterTriggerRestoreHook<?> hook : masterHooks) {
			if (!checkpointCoordinator.addMasterHook(hook)) {
				LOG.warn("Trying to register multiple checkpoint hooks with the name: {}", hook.getIdentifier());
			}
		}

		checkpointCoordinator.setCheckpointStatsTracker(checkpointStatsTracker);
		if (interval != Long.MAX_VALUE) {
			registerJobStatusListener(checkpointCoordinator.createActivatorDeactivator());
		}
```


ExecutionGraph初始化完毕后，JobManager的submit方法后续将ExecutionGraph异步提交。

```java
// execute the recovery/writing the jobGraph into the SubmittedJobGraphStore asynchronously
// because it is a blocking operation
future {
    try {
      if (isRecovery) {
        executionGraph.restoreLatestCheckpointedState() //恢复CheckpointedState
      }
      else {
        //...... 
      }
        submittedJobGraphs.putJobGraph(new SubmittedJobGraph(jobGraph, jobInfo)) //把jobGraph放到submittedJobGraphs中track
      }
    
      jobInfo.client ! decorateMessage(JobSubmitSuccess(jobGraph.getJobID)) //告诉client，job提交成功
    
      if (leaderElectionService.hasLeadership) {
        executionGraph.scheduleForExecution(scheduler) //真正的调度executionGraph
      } else {
        //......
      }
    } catch {
      //.......
    }
}(context.dispatcher)
```


2.2 提交的flink job运行起来，job状态变动后，CheckpointCoordinatorDeActivator持续监听Job的状态。当监听到Job处于RUNNING的时候，将timer定时任务启动。

```java
public class CheckpointCoordinatorDeActivator implements JobStatusListener {

	private final CheckpointCoordinator coordinator;

	public CheckpointCoordinatorDeActivator(CheckpointCoordinator coordinator) {
		this.coordinator = checkNotNull(coordinator);
	}

	@Override
	public void jobStatusChanges(JobID jobId, JobStatus newJobStatus, long timestamp, Throwable error) {
		if (newJobStatus == JobStatus.RUNNING) {
			// start the checkpoint scheduler
			coordinator.startCheckpointScheduler();
		} else {
			// anything else should stop the trigger for now
			coordinator.stopCheckpointScheduler();
		}
	}
}
```

startCheckpointScheduler启动时做一些前置检查

```java
public void startCheckpointScheduler() {
		synchronized (lock) {
			if (shutdown) {
				throw new IllegalArgumentException("Checkpoint coordinator is shut down");
			}

			// make sure all prior timers are cancelled
			stopCheckpointScheduler();

			periodicScheduling = true;
			currentPeriodicTrigger = timer.scheduleAtFixedRate(
					new ScheduledTrigger(), 
					baseInterval, baseInterval, TimeUnit.MILLISECONDS);
		}
	}
```

timer运行注册的任务，该任务是一个ScheduledTrigger

```java
private final class ScheduledTrigger implements Runnable {

		@Override
		public void run() {
			try {
				triggerCheckpoint(System.currentTimeMillis(), true);
			}
			catch (Exception e) {
				LOG.error("Exception while triggering checkpoint.", e);
			}
		}
	}
```


2.3 **并走到triggerCheckpoint这一核心方法，触发一次checkpoint（注意这里针对source）**

triggerCheckpoint方法会进行多次检查，其中对checkpoint检查的几个条件包括当前正在处理的并发检查点数目是否超过阈值，两次checkpoint的间隔时间是否过小等。如果这些条件不满足，则将当前检查点的触发请求不会执行。

```java
CheckpointTriggerResult triggerCheckpoint(
			long timestamp,
			CheckpointProperties props,
			String targetDirectory,
			boolean isPeriodic) {

		// Sanity check
		if (props.externalizeCheckpoint() && targetDirectory == null) {
			throw new IllegalStateException("No target directory specified to persist checkpoint to.");
		}

		// make some eager pre-checks
		synchronized (lock) {
			// abort if the coordinator has been shutdown in the meantime
			if (shutdown) {
				return new CheckpointTriggerResult(CheckpointDeclineReason.COORDINATOR_SHUTDOWN);
			}

			// Don't allow periodic checkpoint if scheduling has been disabled
			if (isPeriodic && !periodicScheduling) {
				return new CheckpointTriggerResult(CheckpointDeclineReason.PERIODIC_SCHEDULER_SHUTDOWN);
			}

			// validate whether the checkpoint can be triggered, with respect to the limit of
			// concurrent checkpoints, and the minimum time between checkpoints.
			// these checks are not relevant for savepoints
			if (!props.forceCheckpoint()) {
				// sanity check: there should never be more than one trigger request queued
				if (triggerRequestQueued) {
					LOG.warn("Trying to trigger another checkpoint while one was queued already");
					return new CheckpointTriggerResult(CheckpointDeclineReason.ALREADY_QUEUED);
				}

				// if too many checkpoints are currently in progress, we need to mark that a request is queued
				if (pendingCheckpoints.size() >= maxConcurrentCheckpointAttempts) {
					triggerRequestQueued = true;
					if (currentPeriodicTrigger != null) {
						currentPeriodicTrigger.cancel(false);
						currentPeriodicTrigger = null;
					}
					return new CheckpointTriggerResult(CheckpointDeclineReason.TOO_MANY_CONCURRENT_CHECKPOINTS);
				}

				// make sure the minimum interval between checkpoints has passed
				final long earliestNext = lastCheckpointCompletionNanos + minPauseBetweenCheckpointsNanos;
				final long durationTillNextMillis = (earliestNext - System.nanoTime()) / 1_000_000;

				if (durationTillNextMillis > 0) {
					if (currentPeriodicTrigger != null) {
						currentPeriodicTrigger.cancel(false);
						currentPeriodicTrigger = null;
					}
					// Reassign the new trigger to the currentPeriodicTrigger
					currentPeriodicTrigger = timer.scheduleAtFixedRate(
							new ScheduledTrigger(),
							durationTillNextMillis, baseInterval, TimeUnit.MILLISECONDS);

					return new CheckpointTriggerResult(CheckpointDeclineReason.MINIMUM_TIME_BETWEEN_CHECKPOINTS);
				}
			}
		}
```

以上这些检查处于基于锁机制实现的同步代码块中。

接着检查需要被触发检查点的task是否都处于运行状态：

```java
// check if all tasks that we need to trigger are running.
		// if not, abort the checkpoint
		Execution[] executions = new Execution[tasksToTrigger.length];
		for (int i = 0; i < tasksToTrigger.length; i++) {
			Execution ee = tasksToTrigger[i].getCurrentExecutionAttempt();
			if (ee != null && ee.getState() == ExecutionState.RUNNING) {
				executions[i] = ee;
			} else {
				LOG.info("Checkpoint triggering task {} is not being executed at the moment. Aborting checkpoint.",
						tasksToTrigger[i].getTaskNameWithSubtaskIndex());
				return new CheckpointTriggerResult(CheckpointDeclineReason.NOT_ALL_REQUIRED_TASKS_RUNNING);
			}
		}
```

只要有一个task不满足条件，则不会触发检查点，并立即返回。

然后检查是否所有需要ack检查点的task都处于运行状态：

```java
// next, check if all tasks that need to acknowledge the checkpoint are running.
		// if not, abort the checkpoint
		Map<ExecutionAttemptID, ExecutionVertex> ackTasks = new HashMap<>(tasksToWaitFor.length);

		for (ExecutionVertex ev : tasksToWaitFor) {
			Execution ee = ev.getCurrentExecutionAttempt();
			if (ee != null) {
				ackTasks.put(ee.getAttemptId(), ev);
			} else {
				LOG.info("Checkpoint acknowledging task {} is not being executed at the moment. Aborting checkpoint.",
						ev.getTaskNameWithSubtaskIndex());
				return new CheckpointTriggerResult(CheckpointDeclineReason.NOT_ALL_REQUIRED_TASKS_RUNNING);
			}
		}
```

如果有一个task不满足条件，则不会触发检查点，并立即返回。当以上条件都满足后就具备了具备触发一个检查点的基本条件。然后进入下一步，生成checkpointId：

```java
final long checkpointID;
			try {
				// this must happen outside the coordinator-wide lock, because it communicates
				// with external services (in HA mode) and may block for a while.
				checkpointID = checkpointIdCounter.getAndIncrement();
			}
			catch (Throwable t) {
				int numUnsuccessful = numUnsuccessfulCheckpointsTriggers.incrementAndGet();
				LOG.warn("Failed to trigger checkpoint (" + numUnsuccessful + " consecutive failed attempts so far)", t);
				return new CheckpointTriggerResult(CheckpointDeclineReason.EXCEPTION);
			}
```

接着创建一个PendingCheckpoint对象：

```java
final PendingCheckpoint checkpoint = new PendingCheckpoint(
				job,
				checkpointID,
				timestamp,
				ackTasks,
				props,
				targetDirectory,
				executor);
```

该类表示一个待处理的检查点。

与此同时，会定义一个针对当前检查点超时进行资源清理的取消器canceller。该取消器主要是针对检查点没有释放资源的情况进行资源释放操作，同时还会调用triggerQueuedRequests方法启动一个触发检查点的定时任务，如果有的话（取决于triggerRequestQueued是否为true）。

然后会再次进入同步代码段，对上面的是否新建检查点的判断条件做二次检查，防止产生竞态条件。这里做二次检查的原因是，中间有一段关于获得checkpointId的代码，不在同步块中。

检查后，如果触发检查点的条件仍然是满足的，那么将上面创建的PendingCheckpoint对象加入集合中，同时会启动针对当前检查点的超时取消器：

```java
pendingCheckpoints.put(checkpointID, checkpoint);

ScheduledFuture<?> cancellerHandle = timer.schedule(
	canceller,
	checkpointTimeout, TimeUnit.MILLISECONDS);
```


2.4 接下来会发送消息给task以真正触发检查点（基于Akka机制）：

```java
// send the messages to the tasks that trigger their checkpoint
	for (Execution execution: executions) {
	execution.triggerCheckpoint(checkpointID, timestamp, checkpointOptions);
}
```

小结：第二阶段主要发生在CheckpointCoordinator，并最终将触发checkpoint的消息发送至TaskManager。

### 第三阶段

3.1 TaskManager收到上一阶段的triggerCheckpoint消息后，进行处理。主要是触发检查点屏障Barrier。

```java
private def handleCheckpointingMessage(actorMessage: AbstractCheckpointMessage): Unit = {

    actorMessage match {
      case message: TriggerCheckpoint =>
        val taskExecutionId = message.getTaskExecutionId
        val checkpointId = message.getCheckpointId
        val timestamp = message.getTimestamp
        val checkpointOptions = message.getCheckpointOptions

        log.debug(s"Receiver TriggerCheckpoint $checkpointId@$timestamp for $taskExecutionId.")

        val task = runningTasks.get(taskExecutionId)
        if (task != null) {
          task.triggerCheckpointBarrier(checkpointId, timestamp, checkpointOptions)
        } else {
          log.debug(s"TaskManager received a checkpoint request for unknown task $taskExecutionId.")
        }

      case message: NotifyCheckpointComplete =>
        val taskExecutionId = message.getTaskExecutionId
        val checkpointId = message.getCheckpointId
        val timestamp = message.getTimestamp

        log.debug(s"Receiver ConfirmCheckpoint $checkpointId@$timestamp for $taskExecutionId.")

        val task = runningTasks.get(taskExecutionId)
        if (task != null) {
          task.notifyCheckpointComplete(checkpointId)
        } else {
          log.debug(
            s"TaskManager received a checkpoint confirmation for unknown task $taskExecutionId.")
        }

      // unknown checkpoint message
      case _ => unhandled(actorMessage)
    }
  }
```

task的triggerCheckpointBarrier也是一个核心方法，该方法在这一步骤主要是为source端打状态并发射初始barrier到下游。

```java
public void triggerCheckpointBarrier(
			final long checkpointID,
			long checkpointTimestamp,
			final CheckpointOptions checkpointOptions) {

		final AbstractInvokable invokable = this.invokable;
		final CheckpointMetaData checkpointMetaData = new CheckpointMetaData(checkpointID, checkpointTimestamp);

		if (executionState == ExecutionState.RUNNING && invokable != null) {
			if (invokable instanceof StatefulTask) {
				// build a local closure
				final StatefulTask statefulTask = (StatefulTask) invokable;
				final String taskName = taskNameWithSubtask;
				final SafetyNetCloseableRegistry safetyNetCloseableRegistry =
					FileSystemSafetyNet.getSafetyNetCloseableRegistryForThread();
				Runnable runnable = new Runnable() {
					@Override
					public void run() {
						// set safety net from the task's context for checkpointing thread
						LOG.debug("Creating FileSystem stream leak safety net for {}", Thread.currentThread().getName());
						FileSystemSafetyNet.setSafetyNetCloseableRegistryForThread(safetyNetCloseableRegistry);

						try {
							boolean success = statefulTask.triggerCheckpoint(checkpointMetaData, checkpointOptions);
							if (!success) {
								checkpointResponder.declineCheckpoint(
										getJobID(), getExecutionId(), checkpointID,
										new CheckpointDeclineTaskNotReadyException(taskName));
							}
						}
						catch (Throwable t) {
							if (getExecutionState() == ExecutionState.RUNNING) {
								failExternally(new Exception(
									"Error while triggering checkpoint " + checkpointID + " for " +
										taskNameWithSubtask, t));
							} else {
								LOG.debug("Encountered error while triggering checkpoint {} for " +
									"{} ({}) while being not in state running.", checkpointID,
									taskNameWithSubtask, executionId, t);
							}
						} finally {
							FileSystemSafetyNet.setSafetyNetCloseableRegistryForThread(null);
						}
					}
				};
				executeAsyncCallRunnable(runnable, String.format("Checkpoint Trigger for %s (%s).", taskNameWithSubtask, executionId));
			}
			else {
				checkpointResponder.declineCheckpoint(jobId, executionId, checkpointID,
						new CheckpointDeclineTaskNotCheckpointingException(taskNameWithSubtask));
				
				LOG.error("Task received a checkpoint request, but is not a checkpointing task - {} ({}).",
						taskNameWithSubtask, executionId);

			}
		}
		else {
			LOG.debug("Declining checkpoint request for non-running task {} ({}).", taskNameWithSubtask, executionId);

			// send back a message that we did not do the checkpoint
			checkpointResponder.declineCheckpoint(jobId, executionId, checkpointID,
					new CheckpointDeclineTaskNotReadyException(taskNameWithSubtask));
		}
	}
```

该方法内部的调用栈如下：

```
org.apache.flink.streaming.api.operators.AbstractStreamOperator.snapshotState(AbstractStreamOperator.java:407)
org.apache.flink.streaming.runtime.tasks.StreamTask$CheckpointingOperation.checkpointStreamOperator(
StreamTask.java:1162)
org.apache.flink.streaming.runtime.tasks.StreamTask$CheckpointingOperation.executeCheckpointing(StreamTask.java:1094)
org.apache.flink.streaming.runtime.tasks.StreamTask.checkpointState(StreamTask.java:654)
org.apache.flink.streaming.runtime.tasks.StreamTask.performCheckpoint(StreamTask.java:590)
org.apache.flink.streaming.runtime.tasks.StreamTask.triggerCheckpoint(StreamTask.java:543)
```

即Task的triggerCheckpointBarrier会调用StreamTask.triggerCheckpoint方法，该方法只会在source端的trigger请求中被触发到，它会设置barrier对齐的一些参数并调用performCheckpoint去实际做checkpoint工作。performCheckpoint最终会调用算子的snapshotState方法，也就是最开始提到的state状态需要实现的抽象方法。该方法进行最终的打snapShot的过程，并存储到状态后端。

```java
@Override
	public final OperatorSnapshotResult snapshotState(long checkpointId, long timestamp, CheckpointOptions checkpointOptions) throws Exception {

		KeyGroupRange keyGroupRange = null != keyedStateBackend ?
				keyedStateBackend.getKeyGroupRange() : KeyGroupRange.EMPTY_KEY_GROUP_RANGE;

		OperatorSnapshotResult snapshotInProgress = new OperatorSnapshotResult();

		CheckpointStreamFactory factory = getCheckpointStreamFactory(checkpointOptions);

		try (StateSnapshotContextSynchronousImpl snapshotContext = new StateSnapshotContextSynchronousImpl(
				checkpointId,
				timestamp,
				factory,
				keyGroupRange,
				getContainingTask().getCancelables())) {

			snapshotState(snapshotContext);

			snapshotInProgress.setKeyedStateRawFuture(snapshotContext.getKeyedStateStreamFuture());
			snapshotInProgress.setOperatorStateRawFuture(snapshotContext.getOperatorStateStreamFuture());

			if (null != operatorStateBackend) {
				snapshotInProgress.setOperatorStateManagedFuture(
					operatorStateBackend.snapshot(checkpointId, timestamp, factory, checkpointOptions));
			}

			if (null != keyedStateBackend) {
				snapshotInProgress.setKeyedStateManagedFuture(
					keyedStateBackend.snapshot(checkpointId, timestamp, factory, checkpointOptions));
			}
		} catch (Exception snapshotException) {
			try {
				snapshotInProgress.cancel();
			} catch (Exception e) {
				snapshotException.addSuppressed(e);
			}

			throw new Exception("Could not complete snapshot " + checkpointId + " for operator " +
				getOperatorName() + '.', snapshotException);
		}

		return snapshotInProgress;
	}
```

3.2 如果这几个步骤正确执行，最终同步或异步的调用

```getEnvironment().acknowledgeCheckpoint(checkpointId, allStates);``` 

把state snapshot发送到JobManager去，消息是AcknowledgeCheckpoint。

如果在调用

```boolean success = statefulTask.triggerCheckpoint(checkpointMetaData, checkpointOptions);```

出现错误，将发送消息DeclineCheckpoint到JobManager。

### 第四阶段

4.1 第四阶段发生在JobManager收到Task的checkpoint消息后的处理。

```java
private def handleCheckpointMessage(actorMessage: AbstractCheckpointMessage): Unit = {
    actorMessage match {
      case ackMessage: AcknowledgeCheckpoint =>
        val jid = ackMessage.getJob()
        currentJobs.get(jid) match {
          case Some((graph, _)) =>
            val checkpointCoordinator = graph.getCheckpointCoordinator()

            if (checkpointCoordinator != null) {
              future {
                try {
                  if (!checkpointCoordinator.receiveAcknowledgeMessage(ackMessage)) {
                    log.info("Received message for non-existing checkpoint " +
                      ackMessage.getCheckpointId)
                  }
                }
                catch {
                  case t: Throwable =>
                    log.error(s"Error in CheckpointCoordinator while processing $ackMessage", t)
                }
              }(context.dispatcher)
            }
            else {
              log.error(
                s"Received AcknowledgeCheckpoint message for job $jid with no " +
                  s"CheckpointCoordinator")
            }

          case None => log.error(s"Received AcknowledgeCheckpoint for unavailable job $jid")
        }

      case declineMessage: DeclineCheckpoint =>
        val jid = declineMessage.getJob()
        currentJobs.get(jid) match {
          case Some((graph, _)) =>
            val checkpointCoordinator = graph.getCheckpointCoordinator()

            if (checkpointCoordinator != null) {
              future {
                try {
                 checkpointCoordinator.receiveDeclineMessage(declineMessage)
                }
                catch {
                  case t: Throwable =>
                    log.error(s"Error in CheckpointCoordinator while processing $declineMessage", t)
                }
              }(context.dispatcher)
            }
            else {
              log.error(
                s"Received DeclineCheckpoint message for job $jid with no CheckpointCoordinator")
            }

          case None => log.error(s"Received DeclineCheckpoint for unavailable job $jid")
        }


      // unknown checkpoint message
      case _ => unhandled(actorMessage)
    }
  }
```

如果收到是task端确认的AcknowledgeCheckpoint消息，将会调用CheckpointCoordinator的receiveAcknowledgeMessage方法并在方法中等待所有task的ack消息的确认.

```
if (checkpoint.isFullyAcknowledged()) {
	completePendingCheckpoint(checkpoint);
}
```

如果全部task的ack消息得到确认后，将把pendingCheckpoint转为completedCheckpoint。

4.2 如果正确转化为completedCheckpoint则再次向task发送notifyCheckpointComplete消息告诉task该checkpoint已完成并被JobManager记录。

```
for (ExecutionVertex ev : tasksToCommitTo) {
			Execution ee = ev.getCurrentExecutionAttempt();
			if (ee != null) {
				ee.notifyCheckpointComplete(checkpointId, timestamp);
			}
}
```

4.3 Taskmanager收到notifyCheckpointComplete消息后触发task的notifyCheckpointComplete方法并最终调用到task上的所有operator的notifyCheckpointComplete。这样一次完整的Checkpoint过程就结束了。

```java
case message: NotifyCheckpointComplete =>
        val taskExecutionId = message.getTaskExecutionId
        val checkpointId = message.getCheckpointId
        val timestamp = message.getTimestamp

        log.debug(s"Receiver ConfirmCheckpoint $checkpointId@$timestamp for $taskExecutionId.")

        val task = runningTasks.get(taskExecutionId)
        if (task != null) {
          task.notifyCheckpointComplete(checkpointId)
        } else {
          log.debug(
            s"TaskManager received a checkpoint confirmation for unknown task $taskExecutionId.")
        }
```

### 运行时Checkpoint触发

注意到在4.1步JobManager收到Task的checkpoint消息后的处理，如果当前的消息是ACK的消息，JobManager必须等待所有task的ACK到达才会做PendingCheckpoint到CompletedCheckpoint的过程。而3.1步说明的是Source处Task触发Checkpoint过程，列出的调用栈同样是基于Source的。那么Source的下游的Task是如何触发Checkpoint的呢？

注意到前文我们叙述到Source端触发Checkpoint后会创建初始barrier并发射出去。而这个就是下游Task触发Checkpoint的关键。与Source端是由CheckpointCoordinator的timer定时器主动触发不同，下游的算子是在运行时触发的。当下游的算子收到上游的barrier后，它将会意识到当前正处于前一个检查点和后一个检查点之间。会进行基本问题3中说明的barrier对齐（exactly-once需要）。Flink中提供了CheckpointBarrierHandler类进行barrier事件的处理。在Exactly-Once要求的应用中，会使用CheckpointBarrierHandler的实现类BarrierBuffer进行barrier对齐和barrier事件的处理。

BarrierBuffer的核心方法是重写的getNextNonBlocked方法。

```java
public BufferOrEvent getNextNonBlocked() throws IOException, InterruptedException {
        while (true) {
            // process buffered BufferOrEvents before grabbing new ones
            //获得下一个待缓存的buffer或者barrier事件
            BufferOrEvent next;
            //如果当前的缓冲区为null，则从输入端获得
            if (currentBuffered == null) {
                next = inputGate.getNextBufferOrEvent();
            }
            //如果缓冲区不为空，则从缓冲区中获得数据
            else {
                next = currentBuffered.getNext();
                //如果获得的数据为null，则表示缓冲区中已经没有更多地数据了
                if (next == null) {
                    //清空当前缓冲区，获取已经新的缓冲区并打开它
                    completeBufferedSequence();
                    //递归调用，处理下一条数据
                    return getNextNonBlocked();
                }
            }

            //获取到一条记录，不为null
            if (next != null) {
                //如果获取到得记录所在的channel已经处于阻塞状态，则该记录会被加入缓冲区
                if (isBlocked(next.getChannelIndex())) {
                    // if the channel is blocked we, we just store the BufferOrEvent
                    bufferSpiller.add(next);
                }
                //如果该记录是一个正常的记录，而不是一个barrier(事件)，则直接返回
                else if (next.isBuffer()) {
                    return next;
                }
                //如果是一个barrier
                else if (next.getEvent().getClass() == CheckpointBarrier.class) {
                    //并且当前流还未处于结束状态，则处理该barrier
                    if (!endOfStream) {
                        // process barriers only if there is a chance of the checkpoint completing
                        processBarrier((CheckpointBarrier) next.getEvent(), next.getChannelIndex());
                    }
                }
                else {
                    //如果它是一个事件，表示当前已到达分区末尾
                    if (next.getEvent().getClass() == EndOfPartitionEvent.class) {
                        //以关闭的channel计数器加一
                        numClosedChannels++;
                        // no chance to complete this checkpoint
                        //此时已经没有机会完成该检查点，则解除阻塞
                        releaseBlocks();
                    }
                    //返回该事件
                    return next;
                }
            }
            //next 为null 同时流结束标识为false
            else if (!endOfStream) {
                // end of stream. we feed the data that is still buffered
                //置流结束标识为true
                endOfStream = true;
                //解除阻塞，这种情况下我们会看到，缓冲区的数据会被加入队列，并等待处理
                releaseBlocks();
                //继续获取下一个待处理的记录
                return getNextNonBlocked();
            }
            else {
                return null;
            }
        }
    }
```

方法调用processBarrier进行barrier的处理。

```java
private void processBarrier(CheckpointBarrier receivedBarrier, int channelIndex) throws Exception {
		final long barrierId = receivedBarrier.getId();

		// fast path for single channel cases
		if (totalNumberOfInputChannels == 1) {
			if (barrierId > currentCheckpointId) {
				// new checkpoint
				currentCheckpointId = barrierId;
				notifyCheckpoint(receivedBarrier);
			}
			return;
		}

		// -- general code path for multiple input channels --

		if (numBarriersReceived > 0) {
			// this is only true if some alignment is already progress and was not canceled

			if (barrierId == currentCheckpointId) {
				// regular case
				onBarrier(channelIndex);
			}
			else if (barrierId > currentCheckpointId) {
				// we did not complete the current checkpoint, another started before
				LOG.warn("Received checkpoint barrier for checkpoint {} before completing current checkpoint {}. " +
						"Skipping current checkpoint.", barrierId, currentCheckpointId);

				// let the task know we are not completing this
				notifyAbort(currentCheckpointId, new CheckpointDeclineSubsumedException(barrierId));

				// abort the current checkpoint
				releaseBlocksAndResetBarriers();

				// begin a the new checkpoint
				beginNewAlignment(barrierId, channelIndex);
			}
			else {
				// ignore trailing barrier from an earlier checkpoint (obsolete now)
				return;
			}
		}
		else if (barrierId > currentCheckpointId) {
			// first barrier of a new checkpoint
			beginNewAlignment(barrierId, channelIndex);
		}
		else {
			// either the current checkpoint was canceled (numBarriers == 0) or
			// this barrier is from an old subsumed checkpoint
			return;
		}

		// check if we have all barriers - since canceled checkpoints always have zero barriers
		// this can only happen on a non canceled checkpoint
		if (numBarriersReceived + numClosedChannels == totalNumberOfInputChannels) {
			// actually trigger checkpoint
			if (LOG.isDebugEnabled()) {
				LOG.debug("Received all barriers, triggering checkpoint {} at {}",
						receivedBarrier.getId(), receivedBarrier.getTimestamp());
			}

			releaseBlocksAndResetBarriers();
			notifyCheckpoint(receivedBarrier);
		}
	}
```

processBarrier中会区分单一的input channel和多input channel的情况，最终如果满足条件会触发notifyCheckpoint方法，该方法会调用到StreamTask的triggerCheckpointOnBarrier方法，注意与3.1步骤的triggerCheckpointBarrier方法不要混淆。

下游算子Checkpoint的方法调用栈如下：

```
at org.apache.flink.streaming.api.operators.AbstractStreamOperator.snapshotState(AbstractStreamOperator.java:407)
at org.apache.flink.streaming.runtime.tasks.StreamTask$CheckpointingOperation.checkpointStreamOperator(StreamTask.java:1162)
at org.apache.flink.streaming.runtime.tasks.StreamTask$CheckpointingOperation.executeCheckpointing(StreamTask.java:1094)
at org.apache.flink.streaming.runtime.tasks.StreamTask.checkpointState(StreamTask.java:654)
at org.apache.flink.streaming.runtime.tasks.StreamTask.performCheckpoint(StreamTask.java:590)
at org.apache.flink.streaming.runtime.tasks.StreamTask.triggerCheckpointOnBarrier(StreamTask.java:543)
```

可以看到与3.1步骤的区别在于触发的方法是triggerCheckpointOnBarrier，后续的步骤是一致的。一旦barrier对齐处理完毕，打完算子状态，该Task也会向JobManager发送ACK消息。当barrier发射到sink端，sink端处理完，所有sink端的算子状态的ACK消息也被确认才会调用4.1步骤对PendingCheckpoint的最终转化，并真正完成一次Checkpoint的过程。

本人系作者原创，欢迎Spark、Flink等大数据技术方面的探讨。

ps：公众号已正式接入图灵机器人，快去和我聊聊吧。

<center>-END-</center>

<div align="center">
<img src="http://rann.cc/assets/img/qrcode-logo.png" width="340" height="400" />
</div>

> 本文系本人个人公众号「梦回少年」原创发布，扫一扫加关注。