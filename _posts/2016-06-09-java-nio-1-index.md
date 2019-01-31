---
layout: post
title: 1.Java NIO Tutorial
tags: NIO
category: Java
---

---

Java NIO系列教程，原作者：Jakob Jenkov，中文翻译部分转载于并发编程网http://ifeve.com/

---

Java NIO (New IO) is an alternative IO API for Java (from Java 1.4), meaning alternative to the standard Java IO and Java Networking API's. Java NIO offers a different way of working with IO than the standard IO API's.

### Java NIO: Channels and Buffers

In the standard IO API you work with byte streams and character streams. In NIO you work with channels and buffers. Data is always read from a channel into a buffer, or written from a buffer to a channel.

### Java NIO: Non-blocking IO

Java NIO enables you to do non-blocking IO. For instance, a thread can ask a channel to read data into a buffer. While the channel reads data into the buffer, the thread can do something else. Once data is read into the buffer, the thread can then continue processing it. The same is true for writing data to channels.

### Java NIO: Selectors

Java NIO contains the concept of "selectors". A selector is an object that can monitor multiple channels for events (like: connection opened, data arrived etc.). Thus, a single thread can monitor multiple channels for data.

How all this works is explained in more detail in the next text in this series - the Java NIO overview.

Next: [Java-NIO-2-概述](http://rann.cc/2016/06/09/java-nio-2-overview.html)

<div align="center">
<img src="http://rann.cc/assets/img/qrcode-logo.png" width="340" height="400" />
</div>

> 本文系本人个人公众号「梦回少年」原创发布，扫一扫加关注。