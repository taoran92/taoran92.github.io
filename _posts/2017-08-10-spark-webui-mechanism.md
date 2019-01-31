---
layout: post
title: 【Spark】Spark WebUI 原理和工作方式
tags: 原创 Spark
category: 大数据
---

Spark应用运行时的详细进度信息，性能指标等数据和信息对于我们分析Spark应用是十分重要的。而Spark的WebUI便是观测应用、作业运行情况的一个很重要的窗口。本文主要从源码层面分析下Spark WebUI原理和工作方式。并从Job信息的一个切面阐述WebUI数据获取和更新的过程。

目录：

* [Spark WebUI页面](#页面)
* [Spark WebUI流程图](#流程图)
* [Spark WebUI流程源码级细述](#源码分析)
* [Spark WebUI数据获取和更新原理](#数据获取和更新原理)

## 页面

![](http://rann.cc/assets/img/tech/sparkui.png)

## 流程图

![](http://rann.cc/assets/img/tech/procedure.png)

## 源码分析

Step1、SparkContext初始化时构建SparkUI

```java
_ui =
  if (conf.getBoolean("spark.ui.enabled", true)) {
    Some(SparkUI.createLiveUI(this, _conf, listenerBus, _jobProgressListener,
    _env.securityManager, appName, startTime = startTime))
  } else {
    // For tests, do not enable the UI
   None
}
```


Step2、执行SparkUI的create方法，实例化各个监听器

在创建SparkUI的过程中，会实例化几个重要的listener并添加到ListenerBus中，这是一种观察者模式。在数据获取和更新中会详细介绍监听器数据产生和更新的原理。

```java
val _jobProgressListener: JobProgressListener = jobProgressListener.getOrElse {
val listener = new JobProgressListener(conf)
  listenerBus.addListener(listener)
  listener
}
 
val environmentListener = new EnvironmentListener
val storageStatusListener = new StorageStatusListener(conf)
val executorsListener = new ExecutorsListener(storageStatusListener, conf)
val storageListener = new StorageListener(storageStatusListener)
val operationGraphListener = new RDDOperationGraphListener(conf)
 
listenerBus.addListener(environmentListener)
listenerBus.addListener(storageStatusListener)
listenerBus.addListener(executorsListener)
listenerBus.addListener(storageListener)
listenerBus.addListener(operationGraphListener)
 
new SparkUI(sc, conf, securityManager, environmentListener, storageStatusListener,
executorsListener, _jobProgressListener, storageListener, operationGraphListener,
appName, basePath, startTime)
```

上述的几个监听对象分别与UI上的

![](http://rann.cc/assets/img/tech/sparkbanner.png)

这几个Tab项的是对应的，具体是：

**JobProgressListener -> Jobs和Stages**，即Spark应用运行过程中的Job和Stage信息和数据。
**EnvironmentListener -> Environment**，即Spark应用的作业配置和Spark参数等环境变量和配置信息。
**StorageListener -> Storage**， RDD的存储状态等信息。
**ExecutorListener ->Executors**，即Spark应用运行时的所有Executor的数据。
而**operationGraphListener -> Jobs, Stages**主要是作业的DAG图数据。
也就是说，Spark WebUI中的所有数据正是来源于这些监听器对象。

Step3、执行SparkUI的initialize初始化方法

当实例化SparkUI的过程中会执行初始化方法，绑定如下的tab项对应的对象数据以及注册页面处理句柄

![](http://rann.cc/assets/img/tech/sparkbanner.png)

即

```java
def initialize() {
  val jobsTab = new JobsTab(this)
  attachTab(jobsTab)
  val stagesTab = new StagesTab(this)
  attachTab(stagesTab)
  attachTab(new StorageTab(this))
  attachTab(new EnvironmentTab(this))
  attachTab(new ExecutorsTab(this))
  attachHandler(createStaticHandler(SparkUI.STATIC_RESOURCE_DIR, "/static"))
  attachHandler(createRedirectHandler("/", "/jobs/", basePath = basePath))
  attachHandler(ApiRootResource.getServletHandler(this))
  // These should be POST only, but, the YARN AM proxy won't proxy POSTs
attachHandler(createRedirectHandler(
    "/jobs/job/kill", "/jobs/", jobsTab.handleKillRequest, httpMethods = Set("GET", "POST")))
  attachHandler(createRedirectHandler(
    "/stages/stage/kill", "/stages/", stagesTab.handleKillRequest,
httpMethods = Set("GET", "POST")))
}
```

SparkUI初始化过程全部结束。Spark WebUI的Tab项对应了相应的SparkUI的Tab类，Tab类中封装了页面数据。

Step4、调用SparkUI的bind方法启动JettyServer

```java
_ui.foreach(_.bind())
```

bind方法会启动spark内嵌的jetty。Jetty采用java编写,是非常轻巧的servlet engine和http server，Spark使用内嵌的Jetty响应web请求。

```java
serverInfo = Some(startJettyServer(host, port, sslOptions, handlers, conf, name)) 
```

Step5、接收UI请求，数据呈现
当发起Spark WebUI的数据请求时，Spark引擎会进行Tab和Page数据的渲染然后返回给用户。

## 数据获取和更新原理

因为Spark WebUI上的不同Tab项的数据实际上来源于不同的监听器对象，所以这边抛砖引玉，以JobProgressListener来说明。JobProgressListener中封装了Job和Stage运行状况以及运行进度等全部作业信息。
 
1 JobProgressListener生成

根据前文所述，SparkUI对象构建过程中会实例化JobProgressListener然后把它add到ListenerBus中。
 
2 JobProgressListener接收事件

2.1 事件到达ListenerBus

根据前文所述JobProgressListener与ListenerBus是一种观察者模式，为什么这么说呢，这是因为ListenerBus中同时维护了listener的一个set集合和eventQueue。eventQueue即一个事件的队列。

```java
private[spark] val listeners = new CopyOnWriteArrayList[L]
private lazy val eventQueue = new LinkedBlockingQueue[SparkListenerEvent](EVENT_QUEUE_CAPACITY)
```

Spark作业在运行的时候，事件发生后（即某些方法的具体调用，如Job提交、Job结束等事件）会通过ListenerBus的post方法传入eventQueue。比如说当Job提交事件发生时，DAGScheduler调用handleJobSubmitted方法执行然后将Job开始事件通过post方法加入eventQueue中。

```java
listenerBus.post(
  SparkListenerJobStart(job.jobId, jobSubmissionTime, stageInfos, properties))
val eventAdded = eventQueue.offer(event)
```

事件的种类是很多的，以DAGScheduler类为例，会有如下的事件。

| 对应的DAGScheduler方法 | SparkListenerEvent事件 | 描述 |
| ------------------------- | ----------------- | ------ |
| executorHeartbeatReceived | SparkListenerExecutorMetricsUpdate | executor向master发送心跳表示BlockManager仍然存活 |
| handleBeginEvent | SparkListenerTaskStart| task开始执行事件 |
| cleanUpAfterSchedulerStop | SparkListenerJobEnd | Job结束事件 |
| handleGetTaskResult | SparkListenerTaskGettingResult | task获取结果事件 |
| handleJobSubmitted | SparkListenerJobStart | Job开始事件 |
| handleMapStageSubmitted| SparkListenerJobStart | Job开始事件 |
| submitMissingTasks | SparkListenerStageSubmitted | Stage提交事件 |
| handleTaskCompletion | SparkListenerTaskEnd | Task结束事件 |
| handleTaskCompletion | SparkListenerJobEnd | Job结束事件 |
| markStageAsFinished | SparkListenerStageCompleted | Stage结束事件 |
| failJobAndIndependentStages | SparkListenerJobEnd | Job结束事件 |
| markMapStageJobAsFinished | SparkListenerJobEnd | Job结束事件 |

2.2 事件到达JobProgressListener

ListenerBus的run方法会持续运转，

```java
try {
  val event = eventQueue.poll
  if (event == null) {
    // Get out of the while loop and shutdown the daemon thread
if (!stopped.get) {
      throw new IllegalStateException("Polling `null` from eventQueue means" +
        " the listener bus has been stopped. So `stopped` must be true")
    }
    return
}
  postToAll(event)
}
```
 
从eventQueue取出事件后，调用ListenerBus的postToAll方法，将事件分发到各Listener中。具体的ListenerBus实现类封装了相应的事件。

```java
event match {
case jobStart: SparkListenerJobStart =>
  listener.onJobStart(jobStart)
case jobEnd: SparkListenerJobEnd =>
  listener.onJobEnd(jobEnd)
...
}
```

3 JobProgressListener对事件进行响应

以JobStart事件为例，相应的listener具体实现——JobProgressListener便接收JobStart的事件，并触发自己的onJobStart方法开始产生和更新数据啦。
 
```java
override def onJobStart(jobStart: SparkListenerJobStart): Unit = synchronized {
  ...省略
  jobIdToData(jobStart.jobId) = jobData
  activeJobs(jobStart.jobId) = jobData
  for (stageId <- jobStart.stageIds) {
    stageIdToActiveJobIds.getOrElseUpdate(stageId, new HashSet[StageId]).add(jobStart.jobId)
  }
  for (stageInfo <- jobStart.stageInfos) {
    stageIdToInfo.getOrElseUpdate(stageInfo.stageId, stageInfo)
    stageIdToData.getOrElseUpdate((stageInfo.stageId, stageInfo.attemptId), new StageUIData)
  }
...省略
}
```

jobIdToData、activeJobs等对象和集合就是JobProgressListener中封装的数据啦。
 
JobProgressListener封装的其他数据还有：

Job的，completedJobs，activeJobs，failedJobs，jobIdToData

Stage的，pendingStages，activeStages，completedStages，failedStages等。

至此JobProgressListener的各项数据就产生了，其他事件触发的时候，或下次同样事件到达的时候，JobProgressListener依然会进行同样的逻辑，然后对数据进行更新。对于Spark WebUI来说，便可以从JobProgressListener中取得数据进行页面呈现了。对于其他的listener，如EnvironmentListener，StorageListener，ExecutorListener等等，数据产生和更新的原理是一致的。

敲重点：明白了listener的数据产生和更新原理以后对于Spark应用的其他开发是很有意义的，比方说你想设计一个自定义metrics，设计metrics子系统，设计开发spark作业分析诊断系统等等，就可以从spark的各个后台listener中去获取数据啦。

ps：公众号已正式接入图灵机器人，快去和我聊聊吧。

<center>-END-</center>

<div align="center">
<img src="http://rann.cc/assets/img/qrcode-logo.png" width="340" height="400" />
</div>

> 本文系本人个人公众号「梦回少年」原创发布，扫一扫加关注。
