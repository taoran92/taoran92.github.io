---
layout: post
title: 【Scala】Scala 中下划线的用途
tags: 原创 Spark Scala
category: 大数据
---

1、存在性类型：Existential types

```
def foo(l: List[Option[_]]) = ...
```

2、高阶类型参数：Higher kinded type parameters
```
case class A[K[_],T](a: K[T])
```

3、临时变量：Ignored variables
val _ = 5

4、临时参数：Ignored parameters

```
List(1, 2, 3) foreach { _ => println("Hi") }
```

5、通配模式：Wildcard patterns

```
Some(5) match { case Some(_) => println("Yes") }
match {
     case List(1,_,_) => " a list with three element and the first element is 1"
     case List(_*)  => " a list with zero or more elements "
     case Map[_,_] => " matches a map with any key type and any value type "
     case _ =>
 }
val (a, _) = (1, 2)
for (_ <- 1 to 10)
```

6、通配导入：Wildcard imports

import java.util._

7、隐藏导入：Hiding imports

```
// Imports all the members of the object Fun but renames Foo to Bar
import com.test.Fun.{ Foo => Bar , _ }

// Imports all the members except Foo. To exclude a member rename it to _
import com.test.Fun.{ Foo => _ , _ }
```

8、连接字母和标点符号：Joining letters to punctuation

```
def bang_!(x: Int) = 5
```

9、占位符语法：Placeholder syntax

```
List(1, 2, 3) map (_ + 2)
_ + _   
( (_: Int) + (_: Int) )(2,3)

val nums = List(1,2,3,4,5,6,7,8,9,10)

nums map (_ + 2)
nums sortWith(_>_)
nums filter (_ % 2 == 0)
nums reduceLeft(_+_)
nums reduce (_ + _)
nums reduceLeft(_ max _)
nums.exists(_ > 5)
nums.takeWhile(_ < 8)
```

10、偏应用函数：Partially applied functions
```
def fun = {
    // Some code
}
val funLike = fun _

List(1, 2, 3) foreach println _

1 to 5 map (10 * _)

//List("foo", "bar", "baz").map(_.toUpperCase())
List("foo", "bar", "baz").map(n => n.toUpperCase())
```

11、初始化默认值：default value

var i: Int = _

12、作为参数名

```
//访问map
var m3 = Map((1,100), (2,200))
for(e<-m3) println(e._1 + ": " + e._2)
m3 filter (e=>e._1>1)
m3 filterKeys (_>1)
m3.map(e=>(e._1*10, e._2))
m3 map (e=>e._2)

//访问元组：tuple getters
(1,2)._2
```

13、参数序列：parameters Sequence

```
_*作为一个整体，告诉编译器你希望将某个参数当作参数序列处理。例如val s = sum(1 to 5:_*)就是将1 to 5当作参数序列处理。
//Range转换为List
List(1 to 5:_*)

//Range转换为Vector
Vector(1 to 5: _*)

//可变参数中
def capitalizeAll(args: String*) = {
  args.map { arg =>
    arg.capitalize
  }
}

val arr = Array("what's", "up", "doc?")
capitalizeAll(arr: _*)
```

这里需要注意的是，以下两种写法实现的是完全不一样的功能：

```
foo _               // Eta expansion of method into method value

foo(_)              // Partial function application
Example showing why foo(_) and foo _ are different:
trait PlaceholderExample {
  def process[A](f: A => Unit)

  val set: Set[_ => Unit]

  set.foreach(process _) // Error 
  set.foreach(process(_)) // No Error
}
```

In the first case, process \_ represents a method; Scala takes the polymorphic method and attempts to make it monomorphic by filling in the type parameter, but realizes that there is no type that can be filled in for A that will give the type (\_ => Unit) => ? (Existential \_ is not a type).
In the second case, process(\_) is a lambda; when writing a lambda with no explicit argument type, Scala infers the type from the argument that foreach expects, and \_ => Unit is a type (whereas just plain \_ isn't), so it can be substituted and inferred.
This may well be the trickiest gotcha in Scala I have ever encountered.

ps：公众号已正式接入图灵机器人，快去和我聊聊吧。

<center>-END-</center>

<div align="center">
<img src="http://rann.cc/assets/img/qrcode-logo.png" width="340" height="400" />
</div>

> 本文系本人个人公众号「梦回少年」原创发布，扫一扫加关注。