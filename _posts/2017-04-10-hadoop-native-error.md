---
layout: post
title: 【Hadoop】Hadoop2.6的Snappy、OpenSSL等本地库错误
tags: 原创 Hadoop
category: 大数据
---

```
环境
Java 1.8
Hadoop 2.6.5
Ubuntu 14.04 x64
```

使用 hadoop checknative发现

```
Native library checking:
hadoop: true /usr/local/hadoop-2.4.0/lib/native/libhadoop.so.1.0.0
zlib:   false
snappy: false
lz4:    true revision:99
bzip2:  false
openssl: false
```

我在执行IDEA远程调试时也报了这个错误，为此谷歌了多方，解决了该问题。

### 1.snappy

snappy的本地库编译安装可参考[http://www.cnblogs.com/shitouer/archive/2013/01/14/2859475.html](http://www.cnblogs.com/shitouer/archive/2013/01/14/2859475.html)，写的非常详细，其中错误2和3我也遇到了。编译前请执行

```
apt-get install autoconf automake libtool
```

并安装maven3。我在执行make时还遇到错误，包括make、g++未安装，安装即可。

其中的snappy和hadoop-snappy源码链接也失效，这里我补上。

点击下面链接下载。

[snappy](https://github.com/ferrari014/dev-repo/blob/master/hadoop/snappy-1.1.1.tar.gz) 

[hadoop-snappy.tar.gz](https://github.com/ferrari014/dev-repo/blob/master/hadoop/hadoop-snappy.tar.gz)

### 2.openssl

```
apt-get install libssl-dev
```

### 3.bzip2

请参考这篇文章[http://www.ithao123.cn/content-28743.html](http://www.ithao123.cn/content-28743.html)，大致意思是安装bzip2-devel库重新编译hadoop，因为我这边提示warn，就没有解决这个了。

最终如下：

<div align="center">
<img src="/assets/img/tech/hadoopnative.png"/>
</div>

ps：公众号已正式接入图灵机器人，快去和我聊聊吧。

<center>-END-</center>

<div align="center">
<img src="http://rann.cc/assets/img/qrcode-logo.png" width="340" height="400" />
</div>

> 本文系本人个人公众号「梦回少年」原创发布，扫一扫加关注。