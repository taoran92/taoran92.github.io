---
layout: post
title: timestamp的两个属性CURRENT_TIMESTAMP和ON UPDATE CURRENT_TIMESTAMP 
tags: 数据库
category: 技术
---

timestamp有两个属性，分别是CURRENT_TIMESTAMP 和ON UPDATE CURRENT_TIMESTAMP两种，使用情况分别如下：

**1. CURRENT_TIMESTAMP**

当要向数据库执行insert操作时，如果有个timestamp字段属性设为CURRENT_TIMESTAMP，则无论这个字段有没有set值都插入当前系统时间 

**2. ON UPDATE CURRENT_TIMESTAMP**

当执行update操作是，并且字段有ON UPDATE CURRENT_TIMESTAMP属性。则字段无论值有没有变化，它的值也会跟着更新为当前UPDATE操作时的时间。

<div align="center">
<img src="http://rann.cc/assets/img/qrcode-logo.png" width="340" height="400" />
</div>

> 本文系本人个人公众号「梦回少年」原创发布，扫一扫加关注。