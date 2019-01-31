---
layout: post
title: 『原创』sublime text3 安装与配置java环境
tags: 原创 IDE
category: 技术
date: 2015-09-16 16:21:35
---

Sublime Text3 是一款非常优秀的跨平台编辑器，在此简单记录下我的Sublime Text3的配置。

**安装**

首先打开SublimeText官网！http://www.sublimetext.com 
安装方法非常傻瓜式，下载下来双击就行了。

**开始使用**

工欲善其事必先利其器,sublime text拥有很多酷炫的插件。下面介绍一下我安装的几个插件

安装packagecontrol
ctrl+~（Esc下面那个键）同时按住，弹出一个输入框，粘贴下面代码，回车。我使用的版本是sublime text3.

```java
import urllib.request,os; pf = 'Package Control.sublime-package'; ipp =sublime.installed_packages_path(); urllib.request.install_opener(urllib.request.build_opener( urllib.request.ProxyHandler()) ); open(os.path.join(ipp,pf), 'wb').write(urllib.request.urlopen( 'http://sublime.wbond.net/' + pf.replace(' ','%20')).read())
```

再贴一个sublime text2的备忘：

```java
import urllib2,os; pf='Package Control.sublime-package'; ipp =sublime.installed_packages_path(); os.makedirs( ipp ) if notos.path.exists(ipp) else None; urllib2.install_opener(urllib2.build_opener( urllib2.ProxyHandler( ))); open( os.path.join(ipp, pf), 'wb' ).write( urllib2.urlopen( 'http://sublime.wbond.net/' +pf.replace( ' ','%20' )).read());print( 'Please restartSublime Text to finish installation')
```

安装好之后，Preferences菜单下看到Package Settings和Package Control两个菜单了，点击Package Control，install package ，输入相应关键字，就能开始安装插件了。

Emmet

撸HTML、CSS必备的

Color Highlighter&&Color Picker

这两个插件需要同时安装，然后就能显示十六进制的颜色的。但颜色这块没有webstorm的赞。

Prettify

这也是好东西，HTML、CSS、JS、JSON.....Ctrl+Shift+H一键就能格式化了

ConvertToUTF8

sublime Text不支持中文显示的，不知道这算不算一种歧视

以上这几个是我认为必备的插件，其他的各位根据自己需要自行搜索并安装吧。
插件不需要安装太多，太多了可能会出现快捷键冲突的问题。

配置简单的IDE

Java

新建一个runJava.bat,放在JAVA_HOME的bin内 内容如下：

```bash
@ECHO OFF 

cd %~dp1 

ECHO Compiling %~nx1……

IF EXIST %~n1.class ( 

DEL %~n1.class 

) 

javac %~nx1 

IF EXIST %~n1.class ( 

ECHO ———OUTPUT———

java %~n1 

)
```

用winrar打开sublime text的安装目录下的Java.sublime-package定位到JavaC.sublime-build修改内容为(修改方法：新建一个文件输入以下内容并保存为JavaC.sublime-build覆盖掉压缩包即可)

```bash
{

 "shell_cmd": "runJava.bat \"$file\"",

 "file_regex": "^(...*?):([0-9]*):?([0-9]*)",

 "selector": "source.java",

}
```

可以用来学习java基础语法。要做工程的话还是用eclipse。

<div align="center">
<img src="http://rann.cc/assets/img/qrcode-logo.png" width="340" height="400" />
</div>

> 本文系本人个人公众号「梦回少年」原创发布，扫一扫加关注。