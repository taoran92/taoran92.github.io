---
layout: post
title: SpringMVC利用Column 注解约束double类型的精度
tags: Spring
category: Java
date: 2016-01-23 19:39:08
---

最近做了一个小系统，主要是和.net开发的客户端交互一些数据，采用springmvc框架做的，数据库采用的是mysql，另外为了方面使用了注解方式，省掉了许多配置文件。数据库持久化采用的是hibernate，也采用了注解，相比以往要的xml文件进行映射，注解方便了不少，但是也遇到一些问题。比如pojo中有的字段类是业务需要，不需要映射到数据库，即使没有加上@Column注解，默认也会在数据库增加一个和java类中field同名的列，如果不想在数据库增加，需要加上@Transient的注解。这个还比较容易在网上查到。另外一个问题花了一点时间，问题是这样的，POJO中有个字段，是double类型，想限制一下小数点长度，开始使用的如下格式，

```java
@Column(name = "grade", precision = 5, scale = 2)
private double grade;
```

不过查看数据库表的创建语句，发现映射到mysql数据库的时候无效，还有说人说要把注解加到字段的get方法上，试了一下，还是不行，最后还是在stackoverflow找到类似的问题，找到了答案。

![](http://www.tcxurun.cn/wp-content/uploads/2013/08/1-300x143.jpg)

 想给double类型加上限制，应该采用如下写法：

```java
@Column(name = "grade", columnDefinition="double(10,2) default '0.00'"
private double grade;
```

![](http://www.tcxurun.cn/wp-content/uploads/2013/08/2-300x161.jpg)

**参考资料：**

http://stackoverflow.com/questions/4078559/how-to-specify-doubles-precision-on-hibernate

http://stackoverflow.com/questions/197045/setting-default-values-for-columns-in-jpa

<div align="center">
<img src="http://rann.cc/assets/img/qrcode-logo.png" width="340" height="400" />
</div>

> 本文系本人个人公众号「梦回少年」原创发布，扫一扫加关注。