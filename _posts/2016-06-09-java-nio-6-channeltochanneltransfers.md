---
layout: post
title: 6.Java NIO Channel to Channel Transfers
tags: NIO
category: Java
---

In Java NIO you can transfer data directly from one channel to another, if one of the channels is a FileChannel. The FileChannel class has a transferTo() and a transferFrom() method which does this for you.

在Java NIO中，如果两个通道中有一个是FileChannel，那你可以直接将数据从一个channel（译者注：channel中文常译作通道）传输到另外一个channel。

### transferFrom()

The `FileChannel.transferFrom()` method transfers data from a source channel into the `FileChannel`. Here is a simple example:

FileChannel的transferFrom()方法可以将数据从源通道传输到FileChannel中（译者注：这个方法在JDK文档中的解释为将字节从给定的可读取字节通道传输到此通道的文件中）。下面是一个简单的例子：

```java
RandomAccessFile fromFile = new RandomAccessFile("fromFile.txt", "rw");
FileChannel      fromChannel = fromFile.getChannel();

RandomAccessFile toFile = new RandomAccessFile("toFile.txt", "rw");
FileChannel      toChannel = toFile.getChannel();

long position = 0;
long count    = fromChannel.size();

toChannel.transferFrom(fromChannel, position, count);
```

The parameters position and count, tell where in the destination file to start writing (`position`), and how many bytes to transfer maximally (`count`). If the source channel has fewer than count bytes, less is transfered.

Additionally, some `SocketChannel` implementations may transfer only the data the `SocketChannel` has ready in its internal buffer here and now - even if the `SocketChannel` may later have more data available. Thus, it may not transfer the entire data requested (`count`) from the `SocketChannel` into `FileChannel`.

方法的输入参数position表示从position处开始向目标文件写入数据，count表示最多传输的字节数。如果源通道的剩余空间小于 count 个字节，则所传输的字节数要小于请求的字节数。

此外要注意，在SoketChannel的实现中，SocketChannel只会传输此刻准备好的数据（可能不足count字节）。因此，SocketChannel可能不会将请求的所有数据(count个字节)全部传输到FileChannel中。

### transferTo()

The transferTo() method transfer from a FileChannel into some other channel. Here is a simple example:

transferTo()方法将数据从FileChannel传输到其他的channel中。下面是一个简单的例子：

```java
RandomAccessFile fromFile = new RandomAccessFile("fromFile.txt", "rw");
FileChannel      fromChannel = fromFile.getChannel();

RandomAccessFile toFile = new RandomAccessFile("toFile.txt", "rw");
FileChannel      toChannel = toFile.getChannel();

long position = 0;
long count    = fromChannel.size();

fromChannel.transferTo(position, count, toChannel);
```

Notice how similar the example is to the previous. The only real difference is the which `FileChannel` object the method is called on. The rest is the same.

The issue with SocketChannel is also present with the `transferTo()` method. The `SocketChannel` implementation may only transfer bytes from the `FileChannel` until the send buffer is full, and then stop.

是不是发现这个例子和前面那个例子特别相似？除了调用方法的FileChannel对象不一样外，其他的都一样。
上面所说的关于SocketChannel的问题在transferTo()方法中同样存在。SocketChannel会一直传输数据直到目标buffer被填满。

Next: [Java-NIO-7-Selector](http://rann.cc/2016/06/09/java-nio-7-selector.html)

<div align="center">
<img src="http://rann.cc/assets/img/qrcode-logo.png" width="340" height="400" />
</div>

> 本文系本人个人公众号「梦回少年」原创发布，扫一扫加关注。