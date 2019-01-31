---
layout: post
title: 计算nextDay的实现
tags: Algorithm
category: 算法
description: 实现nextDay算法
---

>实现nextDay算法

## 1.题目要求

用户从键盘输入"2014/11/11",然后输出该输入的下一天日期是多少.
要求很简单,看上去也不是很复杂,但是要考虑到闰年,月份进位等等问题.

## 2.思路分析

- 用户输入合法性问题
- nextDay的推算算法

我们先看第一个问题:
这个比较简单,我们可以使用正则表达式来匹配用户的输入,当然了,只是正则表达式可能还无法完全约束合法,我们可以继续针对个别的在正确的校验.

```
//使用分隔符'/'分割年月日
//年份可以使用09或者2009这样的形式 月份使用1或者01 日使用01或者1
//至少有一位 至多有两位
//则可以得到下面的匹配规则
String pattern = "^(([0-9][0-9])|([1-2][0,9][0-9][0-9]))\\/(([1-9])|(0[1-9])|(1[0-2]))\\/(([0-9])|([0-2][0-9])|(3[0-1]))$";
```

这样,就可以得到一个合法的类似于"2013/14/22"这样的字符串,但是我们发现,14月仍然是不合法的,仍需我们再次校验合法性.于是,可以封装三个函数:

```
public static boolean isLegalYear(int year) {
	return year >= 1900 && year < 3000;
}

public static boolean isLegalMonth(int month) {
	return month <= 12 && month > 0;
}

public static boolean isLegalDay(int month, int day) {
	return mapDay.get(month).intValue() >= day;
}
```

这样,我们就可以得到一个正确合法的输入日期,然后就可以依照算法,计算下一天.

再看第二个问题:
算法说起来也比较简单,类似于一个加法器,只是各个位置上的进位法则不一样而已.

- 将day自加1
    - 若day合法,返回该data
    - 若day不合法,day赋值为1,month自加1
        - 若month合法,返回该data
        - 若month不合法,month赋值为1,year自加,返回data

经过上述算法计算,即可得到正确的日期了.

## 3.具体实现

首先封装一个data数据类:

```
class MyData {
	public MyData(int year, int month, int day) {
		this.day = day;
		this.month = month;
		this.year = year;
	}
	public int year;
	public int month;
	public int day;
}
```

```
import java.util.*;
import java.util.regex.*;

public class NextDay{

	public static Map<Integer, Integer> mapDay = new HashMap<Integer, Integer>(){
		{
			put(1, 31); put(2, 28); put(3, 31); put(4, 30);
			put(5, 31); put(6, 30); put(7, 31); put(8, 31);
			put(9, 30); put(10, 31); put(11, 30); put(12, 31);
		}
	};

	public static void main(String[] args) {
		MyData d = getNextData(getData());
		System.out.println(d.year+"-"+d.month+"-"+d.day);
	}

	public static MyData getNextData(MyData data) {
		data.day++;
		if (isLegalDay(data.month, data.day)) {
			return data;	
		} else {
			data.day = 1;
			data.month++;
			if (isLegalMonth(data.month)) {
				return data;
			} else {
				data.month = 1;
				data.year++;
				return data;
			}
		}
	}

	public static MyData getData() {
		// get input from keyboard
		Scanner s = new Scanner(System.in);
		// month/day/year
		String input = s.next();
		// using Regular Expression to verify input
		String pattern = "^(([0-9][0-9])|([1-2][0,9][0-9][0-9]))\\/(([1-9])|(0[1-9])|(1[0-2]))\\/(([0-9])|([0-2][0-9])|(3[0-1]))$";
		Matcher m = Pattern.compile(pattern).matcher(input);
		if (m.matches()) {
			String[] data = input.split("/");
			int year = Integer.parseInt(data[0]);
			int month = Integer.parseInt(data[1]);
			int day = Integer.parseInt(data[2]);
			if (isLeapYear(year)) {
				mapDay.put(2, 29);
			}
			if (isLegalYear(year) && isLegalMonth(month) && isLegalDay(month, day)) {
				MyData d = new MyData(year, month, day);
				return d;
			} else {
				System.out.println("your input is illegal!");
				System.exit(-1);
				return null;
			}
		} else {
			System.out.println("your input format is worry!");
			System.exit(-1);
			return null;
		}
	} 

	public static boolean isLegalYear(int year) {
		return year >= 1900 && year < 3000;
	}

	public static boolean isLegalMonth(int month) {
		return month <= 12 && month > 0;
	}

	public static boolean isLegalDay(int month, int day) {
		return mapDay.get(month).intValue() >= day;
	}

	public static boolean isLeapYear(int year) {
		return (year % 400 == 0) || (year % 4 == 0 && year % 100 != 0);
	}
}
```

<div align="center">
<img src="http://rann.cc/assets/img/qrcode-logo.png" width="340" height="400" />
</div>

> 本文系本人个人公众号「梦回少年」原创发布，扫一扫加关注。