---
layout: post
title: 阿里云服务器MySQL频繁挂掉解决办法
tags: 阿里云 MySQL
category: 技术
date: 2015-09-09 21:06:21
---

<font color="red"><center>本文部分内容转载于网络，站长已阅读并测试，保证其正确性。Update:2015-9-14</center></font>

### 解决方法

**1、降低数据库 InnoDB 引擎的缓冲区大小**

在 /etc/my.cnf 的 mysqld 下添加下面一句：
**innodb_buffer_pool_size = 64M**
说明：WordPress 默认使用 InnoDB 数据库引擎；innodb_buffer_pool_size 设置的是缓冲区的大小，默认值为 128M，鉴于个人博客访问量不会太大，因此适当降低缓冲区的大小以减轻内存压力。

**2、添加 swap 分区。**

a. 在 Shell 中逐条执行下列语句：
**dd if=/dev/zero of=/swapfile bs=1M count=1024
mkswap /swapfile
swapon /swapfile**

说明：创建一个有 1024 个块的区，每块 1M，总的来说就是创建一个 1024M 的区；接下来将该区设为 swap 分区；再接着启用 swap 分区。

 b. 将下面一行添加到 /etc/fstab ：
**/swapfile swap swap defaults 0 0**
说明：服务器启动时自动挂载刚刚创建的 swap 分区。

**3、最后重启 MySQL 使操作生效。**

结语：以上解决方法来自 http://hongjiang.info/aliyun-vps-mysql-aborting/，相关说明则是个人理解，不代表完全正确，欢迎交流！ 

<div align="center">
<img src="http://rann.cc/assets/img/qrcode-logo.png" width="340" height="400" />
</div>

> 本文系本人个人公众号「梦回少年」原创发布，扫一扫加关注。