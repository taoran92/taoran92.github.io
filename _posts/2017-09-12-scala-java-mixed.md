---
layout: post
title: 【Scala】Scala与Java混合编程最佳实践
tags: 原创 Spark Scala
category: 大数据
---

## 混合编程的最佳实践

1、打包编译 mvn clean scala:compile compile -DskipTests -Ponline 让scala优先编译

2、import scala.collection.JavaConverters._ 以使用asScala和asJava

建议使用 

```
import scala.collection.JavaConverters._ 显示转换
import scala.collection.JavaConversions._ （旧版本不推荐）
```

3、Scala Map(immutable) 与 mutable Map

immutable使用var的+=, mutable使用val的put或者+=

4、Java与Scala的同名集合框架选择问题

scala涉及到与Java库打交道时（如json转换之类的）使用Java的集合框架。局限于scala代码内部请使用scala原生集合框架

> 持续更新

ps：公众号已正式接入图灵机器人，快去和我聊聊吧。

<center>-END-</center>

<div align="center">
<img src="http://rann.cc/assets/img/qrcode-logo.png" width="340" height="400" />
</div>

> 本文系本人个人公众号「梦回少年」原创发布，扫一扫加关注。