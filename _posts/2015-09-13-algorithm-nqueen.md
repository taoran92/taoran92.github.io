---
layout: post
title: 『原创』算法#10 递归回溯法求解N皇后
tags: 原创 Algorithm N皇后
category: 算法
date: 2015-09-13 21:25:40
---

**问题描述：N皇后**

```java
/*
 * @file		RecursiveBacktrackNqueens.cpp
 * @brief		to use RecursiveBacktrack's way
 * @author		taoxiaoxiao
 * @date              	12-1-2013
*/
//递归回溯法求解N皇后  
//输出解决方案数和行列标（只打印第一个解决方案） 

#include <iostream>
using namespace std;

#define MAXN 13 
int x[MAXN + 1], y[MAXN+1], n, sum;
bool isGo=false;

bool place(int k)
{
	for (int j = 1; j < k; ++j)
	{
		if (x[j] == x[k] || abs(x[j] - x[k]) == abs(j - k))
			return false;
	}
	return true;
}

void RecursiveBacktrackNqueens(int k)
{
	int i;
	if (k > n)
	{
		++sum;
		if (isGo == false)
		{
			for (i = 1; i <= n; ++i)
				y[i] = x[i];
			isGo = true;
		}
	}
	else
	{
		for (i = 1; i <= n; ++i)
		{
			x[k] = i;
			if (place(k))
				RecursiveBacktrackNqueens(k + 1);
		}
	}
}

int main()
{
	system("title 递归回溯法---Nqueens");
	system("color 0a");
	cin >> n;

	RecursiveBacktrackNqueens(1);
	cout << sum << endl;
	for (int i = 1; i <= n; ++i)
		cout << i << " " << y[i] << endl;

	return 0;
}
```

<div align="center">
<img src="http://rann.cc/assets/img/qrcode-logo.png" width="340" height="400" />
</div>

> 本文系本人个人公众号「梦回少年」原创发布，扫一扫加关注。