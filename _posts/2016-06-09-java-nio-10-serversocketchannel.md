---
layout: post
title: 10.Java NIO ServerSocketChannel
tags: NIO
category: Java
---

Java NIO (New IO) is an alternative IO API for Java (from Java 1.4), meaning alternative to Java NIO中的 ServerSocketChannel 是一个可以监听新进来的TCP连接的通道, 就像标准IO中的ServerSocket一样。ServerSocketChannel类在 java.nio.channels包中。

这里有个例子：

```java
ServerSocketChannel serverSocketChannel = ServerSocketChannel.open();

serverSocketChannel.socket().bind(new InetSocketAddress(9999));

while(true){
    SocketChannel socketChannel =
            serverSocketChannel.accept();

    //do something with socketChannel...
}
```

**打开 ServerSocketChannel**

通过调用 ServerSocketChannel.open() 方法来打开ServerSocketChannel.如：

```sh
ServerSocketChannel serverSocketChannel = ServerSocketChannel.open();
```

**关闭 ServerSocketChannel**

通过调用ServerSocketChannel.close() 方法来关闭ServerSocketChannel. 如：

```sh
serverSocketChannel.close();
```

**监听新进来的连接**

通过 ServerSocketChannel.accept() 方法监听新进来的连接。当 accept()方法返回的时候,它返回一个包含新进来的连接的 SocketChannel。因此, accept()方法会一直阻塞到有新连接到达。

通常不会仅仅只监听一个连接,在while循环中调用 accept()方法. 如下面的例子：

```java
while(true){
    SocketChannel socketChannel =
            serverSocketChannel.accept();

    //do something with socketChannel...
}
```

当然,也可以在while循环中使用除了true以外的其它退出准则。

**非阻塞模式**

ServerSocketChannel可以设置成非阻塞模式。在非阻塞模式下，accept() 方法会立刻返回，如果还没有新进来的连接,返回的将是null。 因此，需要检查返回的SocketChannel是否是null.如：

```java
ServerSocketChannel serverSocketChannel = ServerSocketChannel.open();

serverSocketChannel.socket().bind(new InetSocketAddress(9999));
serverSocketChannel.configureBlocking(false);

while(true){
    SocketChannel socketChannel =
            serverSocketChannel.accept();

    if(socketChannel != null){
        //do something with socketChannel...
    }
}
```

Next: [Java-NIO-11-DatagramChannel](http://rann.cc/2016/06/09/java-nio-11-datagram-channel.html)

<div align="center">
<img src="http://rann.cc/assets/img/qrcode-logo.png" width="340" height="400" />
</div>

> 本文系本人个人公众号「梦回少年」原创发布，扫一扫加关注。