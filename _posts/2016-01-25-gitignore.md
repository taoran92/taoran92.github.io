---
layout: post
title: 『原创』Git忽略规则及.gitignore规则不生效的解决办法
tags: Git
category: 技术
date: 2016-01-25 15:48:09
---

<center><span style="color: red;">本文转载于梧桐树下http://www.pfeng.org/archives/840，站长已测试该解决办法。</span></center>

![github1](http://7xlkoc.com1.z0.glb.clouddn.com/wp-content/uploads/2016/01/2016022914353610.png)

在git中如果想忽略掉某个文件，不让这个文件提交到版本库中，可以使用修改根目录中 .gitignore 文件的方法（如无，则需自己手工建立此文件）。这个文件每一行保存了一个匹配的规则例如：

```java
# 此为注释 – 将被 Git 忽略
*.a       # 忽略所有 .a 结尾的文件
!lib.a    # 但 lib.a 除外
/TODO     # 仅仅忽略项目根目录下的 TODO 文件，不包括 subdir/TODO
build/    # 忽略 build/ 目录下的所有文件
doc/*.txt # 会忽略 doc/notes.txt 但不包括 doc/server/arch.txt
# 此为注释 – 将被 Git 忽略
```

规则很简单，不做过多解释，但是有时候在项目开发过程中，突然心血来潮想把某些目录或文件加入忽略规则，按照上述方法定义后发现并未生效，原因是.gitignore只能忽略那些原来没有被track的文件，如果某些文件已经被纳入了版本管理中，则修改.gitignore是无效的。那么解决方法就是先把本地缓存删除（改变成未track状态），然后再提交：

```java
git rm -r --cached .
git add .
git commit -m 'update .gitignore'
```

<div align="center">
<img src="http://rann.cc/assets/img/qrcode-logo.png" width="340" height="400" />
</div>

> 本文系本人个人公众号「梦回少年」原创发布，扫一扫加关注。