---
layout: post
title: 3.Java NIO Channel
tags: NIO
category: Java
---

Java NIO的通道类似流，但又有些不同：

- 既可以从通道中读取数据，又可以写数据到通道。但流的读写通常是单向的。
- 通道可以异步地读写。
- 通道中的数据总是要先读到一个Buffer，或者总是要从一个Buffer中写入。

正如上面所说，从通道读取数据到缓冲区，从缓冲区写入数据到通道。如下图所示：

[](http://ifeve.com/wp-content/uploads/2013/06/overview-channels-buffers.png)

### Channel的实现

这些是Java NIO中最重要的通道的实现：

```
FileChannel
DatagramChannel
SocketChannel
ServerSocketChannel
FileChannel 从文件中读写数据。
```

DatagramChannel 能通过UDP读写网络中的数据。

SocketChannel 能通过TCP读写网络中的数据。

ServerSocketChannel可以监听新进来的TCP连接，像Web服务器那样。对每一个新进来的连接都会创建一个SocketChannel。

### 基本的 Channel 示例

下面是一个使用FileChannel读取数据到Buffer中的示例：

```java
RandomAccessFile aFile = new RandomAccessFile("data/nio-data.txt", "rw");
FileChannel inChannel = aFile.getChannel();

ByteBuffer buf = ByteBuffer.allocate(48);

int bytesRead = inChannel.read(buf);
while (bytesRead != -1) {

System.out.println("Read " + bytesRead);
buf.flip();

while(buf.hasRemaining()){
System.out.print((char) buf.get());
}

buf.clear();
bytesRead = inChannel.read(buf);
}
aFile.close();
```

注意 buf.flip() 的调用，首先读取数据到Buffer，然后反转Buffer,接着再从Buffer中读取数据。下一节会深入讲解Buffer的更多细节。

Next: [Java-NIO-4-Buffer](http://rann.cc/2016/06/09/java-nio-4-buffer.html)

<div align="center">
<img src="http://rann.cc/assets/img/qrcode-logo.png" width="340" height="400" />
</div>

> 本文系本人个人公众号「梦回少年」原创发布，扫一扫加关注。