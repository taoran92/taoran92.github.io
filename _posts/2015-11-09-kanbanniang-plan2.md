---
layout: post
title: 浮动小人改造计划2:接入一言api
tags: 浮动小人
category: 技术
date: 2015-11-09 15:12:49
---

**转载自萝莉社www.myhloli.com**

![](http://7xlkoc.com1.z0.glb.clouddn.com/hitokoto.jpg)

浮动小人这个小挂件，可以说叫博客宠物，时间久了，就越来越喜欢，每次吐槽都是同一句话，即使再喜欢，也终究会腻的。
从lwl的博客看到一款有趣的api-一言api，感觉很有意思，于是想着怎么把一言的api加到小人无聊的吐槽中去。<span style="color: #3366ff;">效果见本站浮动小人，可以播报天气哦~</span>

**[一言api介绍](http://hitokoto.us/api.html)**

## 第一次尝试

博主对代码真的不太懂，找了蛋炒饭前辈帮忙搞代码。蛋炒饭前辈的方案是再footer.php中加入代码，从api中获取一句话保存在div中。
然后再在浮动小人的js中将这个div调取并输出。
实现代码如下

```java
<script src="http://api.lwl12.com/hitokoto/?encode=js&amp;charset=utf-8" type="text/javascript"></script>
```

上面的代码放在footer.php中，
在浮动小人说话的地方加入

```java
msgs = [$("#lwlhitokoto").text().replace("lwlhitokoto()","")];
```

即可输出一句话。
（api使用了lwl修改的纯净版一言）
这个方向总的来说是正确的，不过因为div中只能保存一句话，小人不断的吐槽，就会变成不停重复一句话的复读机。
这显然是我不愿妥协的，美丽的句子那么多，为何只能说一句。

## 第二次尝试

因为不满足，才会有进步。

为了实现小人能够自动一言，我想到了使用iframe框架。在小人的msgs中加入一个iframe框架，使每次输出时，实时获取一句话并输出。这个方法从原理来说是可以做到自动刷新一言并输出的。不过也有一些缺点，irame框架不方便对获取到的文字进行处理，而从一言api直接获取的一句话会有很多其他的参数，所以这次尝试也用了lwl的纯净版一言。

这次虽然说找到一些方向，但是还是以失败告终了

至于为什么失败，看下面两张图大家应该就懂了

![110915_0710_2a2.png](http://7xlkoc.com1.z0.glb.clouddn.com/wp-content/uploads/2015/11/110915_0710_2a2.png)

因为iframe框架的宽高提前设定好了，如果字少的话没什么，字如果多了的话会超出框架 囧

有人会说，又不是不能用。可惜我虽然不是处女座，但是有颗处女座的心。这样怎么可以用(╯°Д°)╯ ┻━┻

## 第三次尝试

试图使用iframe的自适应高度功能，但是因为实在是看不懂代码，也不会改，做不出来拿得出手的效果，就此作罢。

## 第四次尝试

依然是iframe方式实现，想到之前因为框小显示不全所有的字，于是想着是不是把字调小点就可以了。

这次我自己在sae上搭了个伪api，能够输出小字号的灰黑色文字。

测试地址见 http://api.myhloli.com/hitokoto/

输出只要将之前的msgs[]更改为

```java
msgs = ["<iframe id="\" src="\" width="5" height="5" frameborder="\" scrolling="\"></iframe>"];
```

即可

因为字号调小了，所以在浮动小人上看起来效果还过得去，这一版也是我感到比较满意的一个版本。

![110915_0710_2a3.png](http://7xlkoc.com1.z0.glb.clouddn.com/wp-content/uploads/2015/11/110915_0710_2a3.png)

从上图看的话，字超过两行的情况还是比较美观的，字数在一行左右会比较尴尬，留白太多。于是便有了第五次尝试

## 第五次尝试

考虑了整整一天，我甚至在想到底要不要舍弃掉iframe框架，转用文字输出。

这个时候我又想到了lwl的纯净版api，也就是蛋炒饭也给我那个解决方案，因为只能保存一句话而被我打入冷宫。

<del>15号晚上的时候找lwl要源码准备修改一下，看看能不能实现多条语句保存或者更改字号之类的功能，可是悲剧的被拒绝了TAT</del>

LWL迷途知返，将代码开源了，可喜可贺 ：）

http://blog.lwl12.com/read/hitokoto-api.html

我感觉我就是个悲剧，明明就不会写代码，还想做功能，简直就是痴人说梦。

好在皇天不负有心人，晚上闲逛一言官方api站的时候，在[引用排行榜](http://hitokoto.us/apiref.html)中发现了 哞菇牛 的番萌 http://fmoe.cn/

查看源代码发现了他的一言获取和输出函数，我泪流满面。

其实我当时把排行榜前面两页的网站源码都看了个遍，可用性高的代码还真没找到，能看到fmoe也是缘分未尽。

我把获取一言和输出一言的代码贴一下：

```java
<script>// <![CDATA[
            //初始化一言
            setTimeout("getkoto()",1000);
            //加载一言
            var t;
            function getkoto(){
                var hjs = document.createElement('script');
                hjs.setAttribute('id', 'hjs');
                hjs.setAttribute('src', 'http://api.hitokoto.us/rand?uid=3221&encode=jsc&fun=echokoto');
                document.getElementById("hjsbox").appendChild(hjs);
                t=setTimeout("getkoto()",2000);
            }
            //输出一言
            function echokoto(result){
                var hc = eval(result);
                //$("#hitokoto").fadeTo(300,0);
                document.getElementById("hitokoto").innerHTML = hc.hitokoto;
                //$("#hitokoto").fadeTo(300,0.75);
            }

// ]]></script>
```

测试地址:http://api.myhloli.com/hitokoto/test.html
这段代码可以获取一言转换成纯净文字版并输出，而且可以自定义刷新间隔实现自动刷新输出。
看到这段代码，我灵机一动，可以结合之前的方法将这段新代码放在footer.php中，并设置隐藏属性，只把获取到的一言储存在span里，
然后再在小人的js文件中加入输出语句，以实现小人自动刷新输出的一言。

js中输出语句

```java    
msgs = [$("#hitokoto").text()];
```

想到这里我心中暗喜。于是马上去做了，做完以后感觉效果出乎意料的好，能够达到我最初的要求了。

![110915_0710_2a6.png](http://7xlkoc.com1.z0.glb.clouddn.com/wp-content/uploads/2015/11/110915_0710_2a6.png)

从上面图里可以看出，当字数较少，适中与过多时都可以正确显示，且气泡大小可以适配文本长度。
从原理上来看，要想实现每次小人输出新的一言时文本不同，只需在上述函数中将获取的间隔改到比小人刷新输出的间隔更短即可。
虽然可能会有多余的请求，不过在通常意义上来说效果能达到就好。优化效率是以后再做的事情。

## 其他的修改

实现小人自动刷新一言之后，我对小人的js文件做了些修改，之前的无聊动动被我注释掉了，因为乱动的话有点影响阅读体验，

点击小人会满屏幕乱飞的也被我修改了下，现在点击小人只变成一个触发条件了。结合之前的天气api，被我制作成点击小人时，

随机刷新当前日期与今天，明天，后台的天气以及温度。当不点击小人时，每15秒刷新一局一言，修改之前的无聊说点什么间隔为35秒。

最终修改效果见本博客。并提供修改过的js下载，包含天气api与一言api和移动，点击，刷新间隔的修改，原代码几乎没有删除，只是注释

掉了，如果有不喜欢我修改的效果的，可以自行恢复。

[spig.js下载](http://cdn.myhloli.com/wp-content/uploads/2015/02/spig.js)

(单击直接打开的话可以右键另存为 :redface: )

## 最后的最后

本文真实的讲述了一个代码能力几乎为0的小白努力实现两个功能的案例，在功能的实现过程中，感谢将一言api这么优秀的项目介绍给我的lwl同学，感谢在实现方法和代码编写上帮助我的凉拌炒蛋炒饭同学，感谢一言api的提供者 [http://hitokoto.us/](http://hitokoto.us/)，感谢让我找到关键输出函数的番萌[http://fmoe.cn/](http://fmoe.cn/)，还有，感谢万能的度娘。

暂时这个项目做到这里告一段落了，也已经连续通宵几个晚上了。以后不排除增加新的功能，也不保证会增加新的功能，欢迎各位和我一样初入此路的萌新和久经沙场的前辈能一起交流。

<div align="center">
<img src="http://rann.cc/assets/img/qrcode-logo.png" width="340" height="400" />
</div>

> 本文系本人个人公众号「梦回少年」原创发布，扫一扫加关注。