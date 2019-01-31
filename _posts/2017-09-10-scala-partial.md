---
layout: post
title: 【Scala】偏函数和偏应用函数
tags: Spark
category: 大数据
---

## 偏函数

偏函数(Partial Function)，是一个数学概念它不是"函数"的一种, 它跟函数是平行的概念。Scala中的Partia Function是一个Trait，其的类型为PartialFunction[A,B]，其中接收一个类型为A的参数，返回一个类型为B的结果。

举个例子

```java
scala> val pf:PartialFunction[Int,String] = {
       case 1=>"One"
       case 2=>"Two"
       case 3=>"Three"
       case _=>"Other"
}
pf: PartialFunction[Int,String] = <function1>

scala> pf(1)
res0: String = One

scala> pf(2)
res1: String = Two

scala> pf(3)
res2: String = Three

scala> pf(4)
res3: String = Other
```

偏函数内部有一些方法，比如isDefinedAt、OrElse、 andThen、applyOrElse等等。

1.1 isDefinedAt

isDefinedAt : 这个函数的作用是判断传入来的参数是否在这个偏函数所处理的范围内。刚才定义的pf来尝试使用isDefinedAt()，只要是数字都是正确的。如果换成其他类型就会报错。

```java
scala> pf.isDefinedAt(1)
res4: Boolean = true

scala> pf.isDefinedAt(2)
res5: Boolean = true

scala> pf.isDefinedAt("1")
<console>:13: error: type mismatch;
 found   : String("1")
 required: Int
       pf.isDefinedAt("1")
                      ^

scala> pf.isDefinedAt(100)
res7: Boolean = true
```

那我们再定义一个PartialFunction

```java
scala> val anotherPF:PartialFunction[Int,String] = {
        case 1=>"One"
        case 2=>"Two"
        case 3=>"Three"
}
anotherPF: PartialFunction[Int,String] = <function1>

scala> anotherPF.isDefinedAt(1)
res8: Boolean = true

scala> anotherPF.isDefinedAt(2)
res9: Boolean = true

scala> anotherPF.isDefinedAt(3)
res10: Boolean = true

scala> anotherPF.isDefinedAt(4)
res11: Boolean = false
```

去掉了原先的最后一句，再执行anotherPF.isDefinedAt(4)会返回false。

1.2 orElse

orElse : 将多个偏函数组合起来使用，效果类似case语句。

```java
scala> val onePF:PartialFunction[Int,String] = {
     |   case 1=>"One"
     | }
onePF: PartialFunction[Int,String] = <function1>

scala> val twoPF:PartialFunction[Int,String] = {
     |   case 2=>"Two"
     | }
twoPF: PartialFunction[Int,String] = <function1>

scala> val threePF:PartialFunction[Int,String] = {
     |   case 3=>"Three"
     | }
threePF: PartialFunction[Int,String] = <function1>

scala> val otherPF:PartialFunction[Int,String] = {
     |   case _=>"Other"
     | }
otherPF: PartialFunction[Int,String] = <function1>

scala> val newPF = onePF orElse twoPF orElse threePF orElse otherPF
newPF: PartialFunction[Int,String] = <function1>

scala> newPF(1)
res0: String = One

scala> newPF(2)
res1: String = Two

scala> newPF(3)
res2: String = Three

scala> newPF(4)
res3: String = Other
这样，newPF跟原先的pf效果是一样的。
```

1.3 andThen

andThen: 相当于方法的连续调用，比如g(f(x))。

```java
scala> val pf1:PartialFunction[Int,String] = {
     |   case i if i == 1 => "One"
     | }
pf1: PartialFunction[Int,String] = <function1>

scala> val pf2:PartialFunction[String,String] = {
     |   case str if str eq "One" => "The num is 1"
     | }
pf2: PartialFunction[String,String] = <function1>

scala> val num = pf1 andThen pf2
num: PartialFunction[Int,String] = <function1>

scala> num(1)
res4: String = The num is 1
```

pf1的结果返回类型必须和pf2的参数传入类型必须一致，否则会报错。

1.4 applyOrElse

applyOrElse：它接收2个参数，第一个是调用的参数，第二个是个回调函数。如果第一个调用的参数匹配，返回匹配的值，否则调用回调函数。

```java
scala> onePF.applyOrElse(1,{num:Int=>"two"})
res5: String = One

scala> onePF.applyOrElse(2,{num:Int=>"two"})
res6: String = two
```

在这个例子中，第一次onePF匹配了1成功则返回的是"One"字符串。第二次onePF匹配2失败则触发回调函数，返回的是"Two"字符串。

## 偏应用函数

偏应用函数(Partial Applied Function)也叫部分应用函数，跟偏函数(Partial Function)从英文名来看只有一字之差，但他们二者之间却有天壤之别。

部分应用函数, 是指一个函数有n个参数, 而我们为其提供少于n个参数, 那就得到了一个部分应用函数。
个人理解的偏应用函数类似于柯里化，可以参考我以前写的文章借助Java 8实现柯里化

举个例子，定义好一个函数有3个参数，再提供几个有1-2个已知参数的偏应用函数

```java
scala> def add(x:Int,y:Int,z:Int) = x+y+z
add: (x: Int, y: Int, z: Int)Int

scala> def addX = add(1,_:Int,_:Int) // x 已知
addX: (Int, Int) => Int

scala> addX(2,3)
res1: Int = 6

scala> addX(3,4)
res2: Int = 8

scala> def addXAndY = add(10,100,_:Int) // x 和 y 已知
addXAndY: Int => Int

scala> addXAndY(1)
res3: Int = 111

scala> def addZ = add(_:Int,_:Int,10) // z 已知
addZ: (Int, Int) => Int

scala> addZ(1,2)
res4: Int = 13
```

转自：https://www.jianshu.com/p/0a8a15dbb348

ps：公众号已正式接入图灵机器人，快去和我聊聊吧。

<center>-END-</center>

<div align="center">
<img src="http://rann.cc/assets/img/qrcode-logo.png" width="340" height="400" />
</div>

> 本文系本人个人公众号「梦回少年」原创发布，扫一扫加关注。