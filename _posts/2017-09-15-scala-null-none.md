---
layout: post
title: 【Scala】None,Nothing,Null,Nil的区别
tags: Spark Scala
category: 大数据
---

在scala中这四个类型名称很类似，作用确实完全不同的。 

## None

None是一个object，是Option的子类型，定义如下

```
case object None extends Option[Nothing] {
   def isEmpty = true
   def get = throw new NoSuchElementException("None.get")
}
``` 

scala推荐在可能返回空的方法使用Option[X]作为返回类型。如果有值就返回Some\[x\](Some也是Option的子类)，否则返回None，例如 

```
def get(key: A): Option[B] = {
    if (contains(key))
        Some(getValue(key))
    else
        None
}
```

获得Option后，可以使用get获得包含的值，或者使用getOrElse获得默认值如果isEmpty为true。 

## Null

Null是所有AnyRef的子类，在scala的类型系统中，AnyRef是Any的子类，同时Any子类的还有AnyVal。对应java值类型的所有类型都是AnyVal的子类。所以Null可以赋值给所有的引用类型(AnyRef)，不能赋值给值类型，这个java的语义是相同的。 null是Null的唯一对象。 

## Nothing

Nothing是所有类型的子类，也是Null的子类。Nothing没有对象，但是可以用来定义类型。例如，如果一个方法抛出异常，则异常的返回值类型就是Nothing(虽然不会返回)

```
def get(index:Int):Int = {
    if(x < 0) throw new Exception(...)
    else ....
}
```

if语句是表达式，有返回值，必然有返回值类型，如果x < 0，抛出异常，返回值的类型为Nothing，Nothing也是Int的子类，所以，if表达式的返回类型为Int，get方法的返回值类型也为Int。 

## Nil

Nil是一个空的List，定义为List[Nothing]，根据List的定义List[+A]，所有Nil是所有List[T]的子类。

ps：公众号已正式接入图灵机器人，快去和我聊聊吧。

<center>-END-</center>

<div align="center">
<img src="http://rann.cc/assets/img/qrcode-logo.png" width="340" height="400" />
</div>

> 本文系本人个人公众号「梦回少年」原创发布，扫一扫加关注。