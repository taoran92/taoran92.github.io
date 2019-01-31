---
layout: post
title: 【Spark】Spark针对https和IPv6的主机名处理的两个issue分析
tags: 原创 Spark
category: 大数据
---

我们知道Java中获取主机名有getCanonicalHostName, getHostName两种，同时有getHostAddress返回IP地址。实际上，在不同的平台和网络环境下它们是有一些问题的。看看在Spark中会有哪些问题以及如何解决的。

1、Ipv6的问题

Spark在[[Spark-6440]](https://github.com/apache/spark/pull/5424)这个issue中，解决了Ipv6情况下的主机名通信的问题。问题是这样的，

```
"spark://" + localHostname + ":" + masterPort
```

spark通信会拼接hostName和端口，但是Ipv6的地址会形如fe80:0:0:0:200:f8ff:fe21:67cf，拼接后通信地址uri是spark://fe80:0:0:0:200:f8ff:fe21:67cf:42（最后42是端口），造成无法解析。因此需要对Ipv6地址做toUriString的操作，转成spark://[fe80:0:0:0:200:f8ff:fe21:67cf]:42的格式。即

```
def localHostNameForURI(): String = {
    customHostname.getOrElse(InetAddresses.toUriString(localIpAddress))
  }
```

并且该方法兼容Ipv4。另一点是将获取主机名的getHostName方法替换为getHostAddress方法。原因是 Use getHostAddress instead of getHostName ( as it was before ), because of getHostName may return additional information like 95.108.174.236-red.dhcp.yndx.net.

2、Https的问题

Spark在[[SPARK-21642]](https://github.com/apache/spark/pull/18846)这个issue中启用了driver地址getCanonicalHostName化，即全限定主机名FQDN。这是因为如果spark启用了https，当客户端访问spark web ui时，客户端将抛javax.net.ssl.SSLPeerUnverifiedException异常，因为客户端无法验证SSL证书。注：一个SSL证书所对应的域名是一个全域名FQDN。

小结：因为平台的差异性以及getHostName可能返回的附加信息，不推荐使用该方法获取主机名，而是采用getHostAddress去用address标识主机。Ipv6的环境下如果相应地址需要提供服务，Ipv6的地址需要注意"[]"括起来（即uri化）转为标准Ipv6的访问地址。另一点是在https下与driver主机的通信需要使用FQDN。

本人系作者原创，欢迎Spark、Flink等大数据技术方面的探讨。

ps：公众号已正式接入图灵机器人，快去和我聊聊吧。

<center>-END-</center>

<div align="center">
<img src="http://rann.cc/assets/img/qrcode-logo.png" width="340" height="400" />
</div>

> 本文系本人个人公众号「梦回少年」原创发布，扫一扫加关注。