---
layout: post
title: 【Spark】Spark本地调试时ExceptionInInitializerError错误解决方法
tags: 原创 Spark
category: 大数据
---

Spark引擎修改时，我们经常需要进行测试套件。在测试套件运行过程中会通过SparkBuildInfo读取（下面报错日志NPE位置）
spark-version-info.properties文件。

```
val resourceStream = Thread.currentThread().getContextClassLoader.
        getResourceAsStream("spark-version-info.properties")
```

该文件的位置在core模块编译后的target目录中，如果你执行了mvn clean或者删除了target目录，下次IDE中本地调试时可能会报下述错误。

```
java.lang.ExceptionInInitializerError
	at org.apache.spark.package$.<init>(package.scala:91)
	at org.apache.spark.package$.<clinit>(package.scala)
	at org.apache.spark.SparkContext$$anonfun$3.apply(SparkContext.scala:185)
	at org.apache.spark.SparkContext$$anonfun$3.apply(SparkContext.scala:185)
	at org.apache.spark.internal.Logging$class.logInfo(Logging.scala:54)
	at org.apache.spark.SparkContext.logInfo(SparkContext.scala:74)
	at org.apache.spark.SparkContext.<init>(SparkContext.scala:185)
	at org.apache.spark.streaming.StreamingContext$.createNewSparkContext(StreamingContext.scala:841)
	at org.apache.spark.streaming.StreamingContext.<init>(StreamingContext.scala:85)
	at org.apache.spark.streaming.kafka010.DirectKafkaStreamSuite$$anonfun$1.apply$mcV$sp(DirectKafkaStreamSuite.scala:100)
	at org.apache.spark.streaming.kafka010.DirectKafkaStreamSuite$$anonfun$1.apply(DirectKafkaStreamSuite.scala:93)
	at org.apache.spark.streaming.kafka010.DirectKafkaStreamSuite$$anonfun$1.apply(DirectKafkaStreamSuite.scala:93)
	at org.scalatest.Transformer$$anonfun$apply$1.apply$mcV$sp(Transformer.scala:22)
	at org.scalatest.OutcomeOf$class.outcomeOf(OutcomeOf.scala:85)
	at org.scalatest.OutcomeOf$.outcomeOf(OutcomeOf.scala:104)
	at org.scalatest.Transformer.apply(Transformer.scala:22)
	at org.scalatest.Transformer.apply(Transformer.scala:20)
	at org.scalatest.FunSuiteLike$$anon$1.apply(FunSuiteLike.scala:166)
	at org.apache.spark.SparkFunSuite.withFixture(SparkFunSuite.scala:68)
	at org.scalatest.FunSuiteLike$class.invokeWithFixture$1(FunSuiteLike.scala:163)
	at org.scalatest.FunSuiteLike$$anonfun$runTest$1.apply(FunSuiteLike.scala:175)
	at org.scalatest.FunSuiteLike$$anonfun$runTest$1.apply(FunSuiteLike.scala:175)
	at org.scalatest.SuperEngine.runTestImpl(Engine.scala:306)
	at org.scalatest.FunSuiteLike$class.runTest(FunSuiteLike.scala:175)
	at org.apache.spark.streaming.kafka010.DirectKafkaStreamSuite.org$scalatest$BeforeAndAfter$$super$runTest(DirectKafkaStreamSuite.scala:45)
	at org.scalatest.BeforeAndAfter$class.runTest(BeforeAndAfter.scala:200)
	at org.apache.spark.streaming.kafka010.DirectKafkaStreamSuite.runTest(DirectKafkaStreamSuite.scala:45)
	at org.scalatest.FunSuiteLike$$anonfun$runTests$1.apply(FunSuiteLike.scala:208)
	at org.scalatest.FunSuiteLike$$anonfun$runTests$1.apply(FunSuiteLike.scala:208)
	at org.scalatest.SuperEngine$$anonfun$traverseSubNodes$1$1.apply(Engine.scala:413)
	at org.scalatest.SuperEngine$$anonfun$traverseSubNodes$1$1.apply(Engine.scala:401)
	at scala.collection.immutable.List.foreach(List.scala:381)
	at org.scalatest.SuperEngine.traverseSubNodes$1(Engine.scala:401)
	at org.scalatest.SuperEngine.org$scalatest$SuperEngine$$runTestsInBranch(Engine.scala:396)
	at org.scalatest.SuperEngine.runTestsImpl(Engine.scala:483)
	at org.scalatest.FunSuiteLike$class.runTests(FunSuiteLike.scala:208)
	at org.scalatest.FunSuite.runTests(FunSuite.scala:1555)
	at org.scalatest.Suite$class.run(Suite.scala:1424)
	at org.scalatest.FunSuite.org$scalatest$FunSuiteLike$$super$run(FunSuite.scala:1555)
	at org.scalatest.FunSuiteLike$$anonfun$run$1.apply(FunSuiteLike.scala:212)
	at org.scalatest.FunSuiteLike$$anonfun$run$1.apply(FunSuiteLike.scala:212)
	at org.scalatest.SuperEngine.runImpl(Engine.scala:545)
	at org.scalatest.FunSuiteLike$class.run(FunSuiteLike.scala:212)
	at org.apache.spark.SparkFunSuite.org$scalatest$BeforeAndAfterAll$$super$run(SparkFunSuite.scala:31)
	at org.scalatest.BeforeAndAfterAll$class.liftedTree1$1(BeforeAndAfterAll.scala:257)
	at org.scalatest.BeforeAndAfterAll$class.run(BeforeAndAfterAll.scala:256)
	at org.apache.spark.streaming.kafka010.DirectKafkaStreamSuite.org$scalatest$BeforeAndAfter$$super$run(DirectKafkaStreamSuite.scala:45)
	at org.scalatest.BeforeAndAfter$class.run(BeforeAndAfter.scala:241)
	at org.apache.spark.streaming.kafka010.DirectKafkaStreamSuite.run(DirectKafkaStreamSuite.scala:45)
	at org.scalatest.tools.SuiteRunner.run(SuiteRunner.scala:55)
	at org.scalatest.tools.Runner$$anonfun$doRunRunRunDaDoRunRun$3.apply(Runner.scala:2563)
	at org.scalatest.tools.Runner$$anonfun$doRunRunRunDaDoRunRun$3.apply(Runner.scala:2557)
	at scala.collection.immutable.List.foreach(List.scala:381)
	at org.scalatest.tools.Runner$.doRunRunRunDaDoRunRun(Runner.scala:2557)
	at org.scalatest.tools.Runner$$anonfun$runOptionallyWithPassFailReporter$2.apply(Runner.scala:1044)
	at org.scalatest.tools.Runner$$anonfun$runOptionallyWithPassFailReporter$2.apply(Runner.scala:1043)
	at org.scalatest.tools.Runner$.withClassLoaderAndDispatchReporter(Runner.scala:2722)
	at org.scalatest.tools.Runner$.runOptionallyWithPassFailReporter(Runner.scala:1043)
	at org.scalatest.tools.Runner$.run(Runner.scala:883)
	at org.scalatest.tools.Runner.run(Runner.scala)
	at org.jetbrains.plugins.scala.testingSupport.scalaTest.ScalaTestRunner.runScalaTest2(ScalaTestRunner.java:138)
	at org.jetbrains.plugins.scala.testingSupport.scalaTest.ScalaTestRunner.main(ScalaTestRunner.java:28)
Caused by: org.apache.spark.SparkException: Error while locating file spark-version-info.properties
	at org.apache.spark.package$SparkBuildInfo$.liftedTree1$1(package.scala:75)
	at org.apache.spark.package$SparkBuildInfo$.<init>(package.scala:61)
	at org.apache.spark.package$SparkBuildInfo$.<clinit>(package.scala)
	... 62 more
Caused by: java.lang.NullPointerException
	at java.util.Properties$LineReader.readLine(Properties.java:434)
	at java.util.Properties.load0(Properties.java:353)
	at java.util.Properties.load(Properties.java:341)
	at org.apache.spark.package$SparkBuildInfo$.liftedTree1$1(package.scala:64)
	... 64 more
```

解决方法：如果文件被删除，重新编译一次，生成该文件即可。

本人系作者原创，欢迎Spark、Flink等大数据技术方面的探讨。

ps：公众号已正式接入图灵机器人，快去和我聊聊吧。

<center>-END-</center>

<div align="center">
<img src="http://rann.cc/assets/img/qrcode-logo.png" width="340" height="400" />
</div>

> 本文系本人个人公众号「梦回少年」原创发布，扫一扫加关注。