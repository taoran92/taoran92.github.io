---
layout: post
title: JAVA进阶--ThreadPoolExecutor机制
tags: JavaSE
category: Java
---

### 一、概述 

1、ThreadPoolExecutor作为java.util.concurrent包对外提供基础实现，以内部线程池的形式对外提供管理任务执行，线程调度，线程池管理等等服务； 

2、Executors方法提供的线程服务，都是通过参数设置来实现不同的线程池机制。 

3、先来了解其线程池管理的机制，有助于正确使用，避免错误使用导致严重故障。同时可以根据自己的需求实现自己的线程池 

### 二、核心构造方法讲解

下面是ThreadPoolExecutor最核心的构造方法

```java
public ThreadPoolExecutor(int corePoolSize,
                              int maximumPoolSize,
                              long keepAliveTime,
                              TimeUnit unit,
                              BlockingQueue<Runnable> workQueue,
                              ThreadFactory threadFactory,
                              RejectedExecutionHandler handler) {
        if (corePoolSize < 0 ||
            maximumPoolSize <= 0 ||
            maximumPoolSize < corePoolSize ||
            keepAliveTime < 0)
            throw new IllegalArgumentException();
        if (workQueue == null || threadFactory == null || handler == null)
            throw new NullPointerException();
        this.corePoolSize = corePoolSize;
        this.maximumPoolSize = maximumPoolSize;
        this.workQueue = workQueue;
        this.keepAliveTime = unit.toNanos(keepAliveTime);
        this.threadFactory = threadFactory;
        this.handler = handler;
    }
```

**构造方法参数讲解** 

```
参数名	作用
corePoolSize	核心线程池大小
maximumPoolSize	最大线程池大小
keepAliveTime	线程池中超过corePoolSize数目的空闲线程最大存活时间；可以allowCoreThreadTimeOut(true)使得核心线程有效时间
TimeUnit	keepAliveTime时间单位
workQueue	阻塞任务队列
threadFactory	新建线程工厂
RejectedExecutionHandler	当提交任务数超过maxmumPoolSize+workQueue之和时，任务会交给RejectedExecutionHandler来处理
```

**重点讲解：**

其中比较容易让人误解的是：corePoolSize，maximumPoolSize，workQueue之间关系。 

1.当线程池小于corePoolSize时，新提交任务将创建一个新线程执行任务，即使此时线程池中存在空闲线程。 
2.当线程池达到corePoolSize时，新提交任务将被放入workQueue中，等待线程池中任务调度执行 
3.当workQueue已满，且maximumPoolSize>corePoolSize时，新提交任务会创建新线程执行任务 
4.当提交任务数超过maximumPoolSize时，新提交任务由RejectedExecutionHandler处理 
5.当线程池中超过corePoolSize线程，空闲时间达到keepAliveTime时，关闭空闲线程 
6.当设置allowCoreThreadTimeOut(true)时，线程池中corePoolSize线程空闲时间达到keepAliveTime也将关闭 

**线程管理机制图示：**

![](http://dl2.iteye.com/upload/attachment/0105/9641/92ad4409-2ab4-388b-9fb1-9fc4e0d832cd.jpg)

### 三、Executors提供的线程池配置方案 

1、构造一个固定线程数目的线程池，配置的corePoolSize与maximumPoolSize大小相同，同时使用了一个无界LinkedBlockingQueue存放阻塞任务，因此多余的任务将存在再阻塞队列，不会由RejectedExecutionHandler处理 

```java
public static ExecutorService newFixedThreadPool(int nThreads) {
        return new ThreadPoolExecutor(nThreads, nThreads,
                                      0L, TimeUnit.MILLISECONDS,
                                      new LinkedBlockingQueue<Runnable>());
    }
```

2、构造一个缓冲功能的线程池，配置corePoolSize=0，maximumPoolSize=Integer.MAX_VALUE，keepAliveTime=60s,以及一个无容量的阻塞队列 SynchronousQueue，因此任务提交之后，将会创建新的线程执行；线程空闲超过60s将会销毁 

```java
public static ExecutorService newCachedThreadPool() {
        return new ThreadPoolExecutor(0, Integer.MAX_VALUE,
                                      60L, TimeUnit.SECONDS,
                                      new SynchronousQueue<Runnable>());
    }
```

3、构造一个只支持一个线程的线程池，配置corePoolSize=maximumPoolSize=1，无界阻塞队列LinkedBlockingQueue；保证任务由一个线程串行执行 

```java
public static ExecutorService newSingleThreadExecutor() {
        return new FinalizableDelegatedExecutorService
            (new ThreadPoolExecutor(1, 1,
                                    0L, TimeUnit.MILLISECONDS,
                                    new LinkedBlockingQueue<Runnable>()));
    }
```

4、构造有定时功能的线程池，配置corePoolSize，无界延迟阻塞队列DelayedWorkQueue；有意思的是：maximumPoolSize=Integer.MAX_VALUE，由于DelayedWorkQueue是无界队列，所以这个值是没有意义的 

```java
public static ScheduledExecutorService newScheduledThreadPool(int corePoolSize) {
        return new ScheduledThreadPoolExecutor(corePoolSize);
    }

public static ScheduledExecutorService newScheduledThreadPool(
            int corePoolSize, ThreadFactory threadFactory) {
        return new ScheduledThreadPoolExecutor(corePoolSize, threadFactory);
    }

public ScheduledThreadPoolExecutor(int corePoolSize,
                             ThreadFactory threadFactory) {
        super(corePoolSize, Integer.MAX_VALUE, 0, TimeUnit.NANOSECONDS,
              new DelayedWorkQueue(), threadFactory);
    }
```

### 四、定制属于自己的非阻塞线程池 

```java
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.RejectedExecutionHandler;
import java.util.concurrent.ThreadFactory;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;


public class CustomThreadPoolExecutor {

	private ThreadPoolExecutor pool = null;
	
	/**
	 * 线程池初始化方法
	 * 
	 * corePoolSize 核心线程池大小----10
	 * maximumPoolSize 最大线程池大小----30
	 * keepAliveTime 线程池中超过corePoolSize数目的空闲线程最大存活时间----30+单位TimeUnit
	 * TimeUnit keepAliveTime时间单位----TimeUnit.MINUTES
	 * workQueue 阻塞队列----new ArrayBlockingQueue<Runnable>(10)====10容量的阻塞队列
	 * threadFactory 新建线程工厂----new CustomThreadFactory()====定制的线程工厂
	 * rejectedExecutionHandler 当提交任务数超过maxmumPoolSize+workQueue之和时,
	 * 							即当提交第41个任务时(前面线程都没有执行完,此测试方法中用sleep(100)),
	 * 						          任务会交给RejectedExecutionHandler来处理
	 */
	public void init() {
		pool = new ThreadPoolExecutor(
				10,
				30,
				30,
				TimeUnit.MINUTES,
				new ArrayBlockingQueue<Runnable>(10),
				new CustomThreadFactory(),
				new CustomRejectedExecutionHandler());
	}

	
	public void destory() {
		if(pool != null) {
			pool.shutdownNow();
		}
	}
	
	
	public ExecutorService getCustomThreadPoolExecutor() {
		return this.pool;
	}
	
	private class CustomThreadFactory implements ThreadFactory {

		private AtomicInteger count = new AtomicInteger(0);
		
		@Override
		public Thread newThread(Runnable r) {
			Thread t = new Thread(r);
			String threadName = CustomThreadPoolExecutor.class.getSimpleName() + count.addAndGet(1);
			System.out.println(threadName);
			t.setName(threadName);
			return t;
		}
	}
	
	
	private class CustomRejectedExecutionHandler implements RejectedExecutionHandler {

		@Override
		public void rejectedExecution(Runnable r, ThreadPoolExecutor executor) {
			// 记录异常
			// 报警处理等
			System.out.println("error.............");
		}
	}
	
	// 测试构造的线程池
	public static void main(String[] args) {
		CustomThreadPoolExecutor exec = new CustomThreadPoolExecutor();
		// 1.初始化
		exec.init();
		
		ExecutorService pool = exec.getCustomThreadPoolExecutor();
		for(int i=1; i<100; i++) {
			System.out.println("提交第" + i + "个任务!");
			pool.execute(new Runnable() {
				@Override
				public void run() {
					try {
						Thread.sleep(3000);
					} catch (InterruptedException e) {
						e.printStackTrace();
					}
					System.out.println("running=====");
				}
			});
		}
		
		// 2.销毁----此处不能销毁,因为任务没有提交执行完,如果销毁线程池,任务也就无法执行了
		// exec.destory();
		
		try {
			Thread.sleep(10000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}
}
```

方法中建立一个核心线程数为30个，缓冲队列有10个的线程池。每个线程任务，执行时会先睡眠3秒，保证提交10任务时，线程数目被占用完，再提交30任务时，阻塞队列被占用完，，这样提交第41个任务是，会交给CustomRejectedExecutionHandler 异常处理类来处理。 

提交任务的代码如下:

```java
public void execute(Runnable command) {
        if (command == null)
            throw new NullPointerException();
        /*
         * Proceed in 3 steps:
         *
         * 1. If fewer than corePoolSize threads are running, try to
         * start a new thread with the given command as its first
         * task.  The call to addWorker atomically checks runState and
         * workerCount, and so prevents false alarms that would add
         * threads when it shouldn't, by returning false.
         *
         * 2. If a task can be successfully queued, then we still need
         * to double-check whether we should have added a thread
         * (because existing ones died since last checking) or that
         * the pool shut down since entry into this method. So we
         * recheck state and if necessary roll back the enqueuing if
         * stopped, or start a new thread if there are none.
         *
         * 3. If we cannot queue task, then we try to add a new
         * thread.  If it fails, we know we are shut down or saturated
         * and so reject the task.
         */
        int c = ctl.get();
        if (workerCountOf(c) < corePoolSize) {
            if (addWorker(command, true))
                return;
            c = ctl.get();
        }
        if (isRunning(c) && workQueue.offer(command)) {
            int recheck = ctl.get();
            if (! isRunning(recheck) && remove(command))
                reject(command);
            else if (workerCountOf(recheck) == 0)
                addWorker(null, false);
        }
        else if (!addWorker(command, false))
            reject(command);
    }

```

注意：41以后提交的任务就不能正常处理了，因为，execute中提交到任务队列是用的offer方法，如上面代码，这个方法是非阻塞的，所以就会交给CustomRejectedExecutionHandler 来处理，所以对于大数据量的任务来说，这种线程池，如果不设置队列长度会OOM，设置队列长度，会有任务得不到处理，接下来我们构建一个阻塞的自定义线程池 

### 五、定制属于自己的阻塞线程池

```java
package com.tongbanjie.trade.test.commons;

import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.RejectedExecutionHandler;
import java.util.concurrent.ThreadFactory;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

public class CustomThreadPoolExecutor {  
	  
    private ThreadPoolExecutor pool = null;  
      
    /** 
     * 线程池初始化方法 
     *  
     * corePoolSize 核心线程池大小----1 
     * maximumPoolSize 最大线程池大小----3 
     * keepAliveTime 线程池中超过corePoolSize数目的空闲线程最大存活时间----30+单位TimeUnit 
     * TimeUnit keepAliveTime时间单位----TimeUnit.MINUTES 
     * workQueue 阻塞队列----new ArrayBlockingQueue<Runnable>(5)====5容量的阻塞队列 
     * threadFactory 新建线程工厂----new CustomThreadFactory()====定制的线程工厂 
     * rejectedExecutionHandler 当提交任务数超过maxmumPoolSize+workQueue之和时, 
     *                          即当提交第41个任务时(前面线程都没有执行完,此测试方法中用sleep(100)), 
     *                                任务会交给RejectedExecutionHandler来处理 
     */  
    public void init() {  
        pool = new ThreadPoolExecutor(  
                1,  
                3,  
                30,  
                TimeUnit.MINUTES,  
                new ArrayBlockingQueue<Runnable>(5),  
                new CustomThreadFactory(),  
                new CustomRejectedExecutionHandler());  
    }  
  
      
    public void destory() {  
        if(pool != null) {  
            pool.shutdownNow();  
        }  
    }  
      
      
    public ExecutorService getCustomThreadPoolExecutor() {  
        return this.pool;  
    }  
      
    private class CustomThreadFactory implements ThreadFactory {  
  
        private AtomicInteger count = new AtomicInteger(0);  
          
        @Override  
        public Thread newThread(Runnable r) {  
            Thread t = new Thread(r);  
            String threadName = CustomThreadPoolExecutor.class.getSimpleName() + count.addAndGet(1);  
            System.out.println(threadName);  
            t.setName(threadName);  
            return t;  
        }  
    }  
      
      
    private class CustomRejectedExecutionHandler implements RejectedExecutionHandler {  
  
        @Override  
        public void rejectedExecution(Runnable r, ThreadPoolExecutor executor) {  
        	try {
                                // 核心改造点，由blockingqueue的offer改成put阻塞方法
				executor.getQueue().put(r);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
        }  
    }  
      
    // 测试构造的线程池  
    public static void main(String[] args) {  
    	
        CustomThreadPoolExecutor exec = new CustomThreadPoolExecutor();  
        // 1.初始化  
        exec.init();  
          
        ExecutorService pool = exec.getCustomThreadPoolExecutor();  
        for(int i=1; i<100; i++) {  
            System.out.println("提交第" + i + "个任务!");  
            pool.execute(new Runnable() {  
                @Override  
                public void run() {  
                    try {  
                    	System.out.println(">>>task is running====="); 
                        TimeUnit.SECONDS.sleep(10);
                    } catch (InterruptedException e) {  
                        e.printStackTrace();  
                    }  
                }  
            });  
        }  
              
        // 2.销毁----此处不能销毁,因为任务没有提交执行完,如果销毁线程池,任务也就无法执行了  
        // exec.destory();  
          
        try {  
            Thread.sleep(10000);  
        } catch (InterruptedException e) {  
            e.printStackTrace();  
        }  
    }  
}  
```

解释：当提交任务被拒绝时，进入拒绝机制，我们实现拒绝方法，把任务重新用阻塞提交方法put提交，实现阻塞提交任务功能，防止队列过大，OOM，提交被拒绝方法在下面

```java
public void execute(Runnable command) {
        if (command == null)
            throw new NullPointerException();

        int c = ctl.get();
        if (workerCountOf(c) < corePoolSize) {
            if (addWorker(command, true))
                return;
            c = ctl.get();
        }
        if (isRunning(c) && workQueue.offer(command)) {
            int recheck = ctl.get();
            if (! isRunning(recheck) && remove(command))
                reject(command);
            else if (workerCountOf(recheck) == 0)
                addWorker(null, false);
        }
        else if (!addWorker(command, false))
            // 进入拒绝机制， 我们把runnable任务拿出来，重新用阻塞操作put，来实现提交阻塞功能
            reject(command);
    }
```

### 总结： 

1、用ThreadPoolExecutor自定义线程池，看线程是的用途，如果任务量不大，可以用无界队列，如果任务量非常大，要用有界队列，防止OOM。

2、如果任务量很大，还要求每个任务都处理成功，要对提交的任务进行阻塞提交，重写拒绝机制，改为阻塞提交。保证不抛弃一个任务。

3、最大线程数一般设为2N+1最好，N是CPU核数。

4、核心线程数，看应用，如果是任务，一天跑一次，设置为0，合适，因为跑完就停掉了，如果是常用线程池，看任务量，是保留一个核心还是几个核心线程数。
 
5、如果要获取任务执行结果，用CompletionService，但是注意，获取任务的结果的要重新开一个线程获取，如果在主线程获取，就要等任务都提交后才获取，就会阻塞大量任务结果，队列过大OOM，所以最好异步开个线程获取结果。

<div align="center">
<img src="http://rann.cc/assets/img/qrcode-logo.png" width="340" height="400" />
</div>

> 本文系本人个人公众号「梦回少年」原创发布，扫一扫加关注。