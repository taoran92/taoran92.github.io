---
layout: post
title: 『原创』算法#11 迭代回溯法求解N皇后
tags: 原创 Algorithm 回溯法
category: 算法
date: 2015-09-17 21:30:11
---

**问题描述：经典N皇后问题**

```java
/*
* @file				IterativeBacktrackNqueens.cpp
* @brief			IteratorBacktrack's way
* @author			taoxiaoxiao
* @date				12-1-2014
*/
//迭代回溯法求解N皇后
//输出解决方案数和行列标（只打印第一个解决方案）
#include <iostream>
#include <cmath>
using namespace std;

#define MAXN 13

int x[MAXN+1], y[MAXN+1], n, sum;
bool isGo = false;

bool place(int k)
{
	for (int j = 1; j < k; ++j)
	{
		if (x[k] == x[j] || abs(x[k] - x[j]) == abs(k - j))
			return false;
	}
	return true;
}

void IteratorBacktrackNqueens()
{
	int k = 1;

	while (k > 0)
	{
		while (x[k] < n)
		{
			x[k] += 1;
			if (place(k))
			{
				if (k == n)
				{
					++sum;
					if (isGo == false)                                  //保存第一组数据
					{
						for (int i = 1; i <= n; ++i)
							y[i] = x[i];
						isGo = true;
					}	
				}
				else
				{
					k++;
					x[k] = 0;
				}
			}
		}
		--k;
	}
}

int main()
{
	system("title 迭代回溯法---Nqueens");
	system("color 0a");

	cin >> n;
	IteratorBacktrackNqueens();
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