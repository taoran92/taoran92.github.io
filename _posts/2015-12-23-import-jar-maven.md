---
layout: post
title: 『原创』maven基础-怎么导入官方没有的jar
tags: 原创 Maven
category: 技术
date: 2015-12-23 15:22:05
---

### Maven基础[1]

全文托管于GitHub，[全文阅读](https://github.com/ferrari014/TinyMood/blob/master/技术文章/Maven基础.md)

**1.什么是maven?**

Maven:基于项目对象模型pom的项目管理工具

**2.常用命令**

mvn compile 编译 
mvn test 测试 
mvn package 打包 
mvn clean 删除target目录 
mvn install 安装Jar包到本地仓库 
mvn archetype:generate 自动建立项目骨架

**3.目录结构**

src-main-java
src-test-java
src-resource
target
pom.xml

**4.仓库**

本地仓库（用户的本地仓库）
中央仓库（Maven的中央仓库）
镜像仓库（Mirrors镜像仓库，在settings.xml中配置）

**5.怎么向本地仓库导入官方仓库没有的Jar包**

[v_error]注:简单复制是不可行的。 [/v_error]
正确方法是执行cmd命令：

```java
mvn install:install file
-DgroupId=包名
-DartifactId=项目名
-Dversion=版本号
-Dpackage=Jar
-Dfile=文件路径
```

一个简单的例子 
e.g.
```java
mvn install:install file
-DgroupId=com.tinymood
-DartifactId=tinymood-core
-Dversion=1.0.0
-Dpackage=Jar
-Dfile=D:\lib\tinymood-core-1.0.0.jar
```

pom.xml中引用

```java
<dependency>
    <groupId>com.tinymood</groupId>
    <artifactId>tinymood-core</artifactId>
    <version>1.0.0</version>
</dependency>
```

<div align="center">
<img src="http://rann.cc/assets/img/qrcode-logo.png" width="340" height="400" />
</div>

> 本文系本人个人公众号「梦回少年」原创发布，扫一扫加关注。