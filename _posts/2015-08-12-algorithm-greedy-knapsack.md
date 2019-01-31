---
layout: post
title: 『原创』算法#8 贪心法求解背包问题（2种策略）
tags: 原创 Algorithm 背包
category: 算法
date: 2015-08-12 21:14:42
---

**求解：(部分背包 物品可分)**

**策略1：** 每次取最大价值的

```java
/**
* @file				Greedy1Knapsack.cpp
* @brief			     select max value
* @author			taoxiaoxiao
* @date				11-3-2013
*/
//输入实例 W=50 v=[60,150,150] w=[10,20,50]
//该算法求解部分背包(物品可分)
//该算法每次选择最大价值（不是最优解）
#include <iostream>
#include <algorithm>
#define N 3
using namespace std;

int v[N], w[N];
double  x[N];
int W = 50;

void sort(int v[], int w[])
{
	int tmp1, tmp2;
	int i, j;

	for (i = 0; i < N - 1; ++i)
	{
		int k = i;
		for (j = i + 1; j < N; ++j)
		{
			if (v[j] > v[k])
				k = j;
		}
		if (k != i)
		{
			tmp1 = v[i], tmp2 = w[i];
			v[i] = v[k], w[i] = w[k];
			v[k] = tmp1, w[k] = tmp2;
		}
	}
}

void Greedy1Knapsack()
{
	int i;

	for (i = 0; i < N; ++i)
	{
		if (w[i]>W)
			break;
		x[i] = 1;
		W -= w[i];
	}
	if (i <= N)
		x[i] = double(W) / w[i];
}

int main()
{
	int i;
	double max_value = 0.0;

	for (i = 0; i < N; ++i)
		cin >> v[i];
	for (i = 0; i < N; ++i)
		cin >> w[i];
	sort(v,w);
	Greedy1Knapsack();
	for (i = 0; i < N; ++i)
	{
		if (x[i] > 0)
		{
			cout << "[" << v[i] << "," << w[i] << "]"
				<< "放入" << x[i] << "件" << "\n";
			max_value += x[i] * v[i];
		}
	}
	cout << "最大价值为:" << max_value << endl;

	return 0;
}
```

**策略2：** 每次取单位重量价值最大的

```java
/**
* @file				Greedy2Knapsack.cpp
* @brief		           per pound value
* @author			taoxiaoxiao
* @date				11-3-2014
*/
//输入实例 W=50 v=[60,150,150] w=[10,20,50]  
//该算法求解部分背包(物品可分)  
//该算法每次选择单位重量价值最大的物品（最优解） 

#include <iostream>
#include <algorithm>
#define N 3
using namespace std;

int v[N], w[N];
double pvalue[N], x[N];
int W = 50;

void sort(int v[], int w[])
{
	int tmp1, tmp2;
	int i, j;

	for (i = 0; i < N; ++i)
		pvalue[i] = double(v[i] / w[i]);
	for (i = 0; i < N - 1; ++i)
	{
		int k = i;
		for (j = i + 1; j < N; ++j)
		{
			if (pvalue[j] > pvalue[k])
				k = j;
		}
		if (k != i)
		{
			tmp1 = v[i], tmp2 = w[i];
			v[i] = v[k], w[i] = w[k];
			v[k] = tmp1, w[k] = tmp2;
		}
	}
}
void Greedy2Knapsack()
{
	int i;
	for (i = 0; i < N; ++i)
	{
		if (w[i]>W)
			break;
		x[i] = 1;
		W -= w[i];
	}
	if (i <= N)
		x[i] =double (W) / w[i];
}
int main()
{
	int i;
	double max_value=0.0;

	for (i = 0; i < N; ++i)
		cin >> v[i];
	for (i = 0; i < N; ++i)
		cin >> w[i];
	sort(v, w);
	Greedy2Knapsack();
	for (i = 0; i < N; ++i)
	{
		if (x[i] > 0)
			cout << "[" << v[i] << "," << w[i] << "]"
					<< "放入" << x[i] << "件" << endl;
		max_value += x[i] * v[i];
	}
	cout << "最大价值为:" << max_value << endl;

	return 0;
}
```

<div align="center">
<img src="http://rann.cc/assets/img/qrcode-logo.png" width="340" height="400" />
</div>

> 本文系本人个人公众号「梦回少年」原创发布，扫一扫加关注。