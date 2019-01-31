---
layout: post
title: 『原创』算法#12 动态规划求解0-1背包
tags: 原创 Algorithm 背包
category: 算法
date: 2015-08-12 21:34:56
---

**问题描述：0-1背包问题**

```java
/*
 * @file				DPKnapsack.cpp
 * @author				taoxiaoxiao
 * @date				11-2-2014
 * @version				v1.0
*/
//输入测试 2 12 1 10 3 20 2 15
#include <iostream>
#include <fstream>
using namespace std;

#define N 4
#define W 5

int w[N+1], v[N+1];
int V[N+1][W+1], b[N+1][W+1];

void DPKnapsack()
{
	int i, j;

	for (i = 1; i <= N; ++i)
	{
		for (j = 1; j <= W; ++j)
		{
			if (w[i] > j)
			{
				V[i][j] = V[i - 1][j];
				b[i][j] = 1;
			}
			else
			{
				if (V[i - 1][j] > V[i - 1][j - w[i]] + v[i])
				{
					V[i][j] = V[i - 1][j];
					b[i][j] = 1;
				}
				else
				{
					V[i][j] = V[i - 1][j - w[i]] + v[i];
					b[i][j] = 2;
				}
			}
		}
	}
}

void PrintKnapsackItem(int i, int j)
{
	if (i == 0 || j == 0)
		return;
	if (b[i][j] == 2)
	{
		PrintKnapsackItem(i - 1, j - w[i]);
		cout << i << " "; 
	}
	else
		PrintKnapsackItem(i - 1, j);
}

int main()
{
	system("title 01背包问题");
	system("color 02");

	for (int i = 1; i <= N; ++i)
	{
		cin>> w[i] >> v[i];
	}
	DPKnapsack();
	cout << "最大价值为: " << V[4][5] << endl;
	cout <<"相应的物品为: ";
	PrintKnapsackItem(4, 5);
	cout << endl;

	return 0;
}
```

<div align="center">
<img src="http://rann.cc/assets/img/qrcode-logo.png" width="340" height="400" />
</div>

> 本文系本人个人公众号「梦回少年」原创发布，扫一扫加关注。