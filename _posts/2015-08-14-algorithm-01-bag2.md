---
layout: post
title: 『原创』算法#13 回溯法实现0-1背包
tags: 原创 Algorithm 背包
category: 算法
date: 2015-08-14 21:37:38
---

**问题描述：0-1背包问题**

```java
/*
 * @file			main.cpp
 * @brief			Backtrack's way
 * @author/Univ.		taoxiaoran
 * @date			11-17-2013
*/
//装载实例
//n = 4，W = 7，v = [9，10，7，4], w = [3，5，2，1]
//单位价值降序排序后装载实例
//n = 4，W = 7，v = [4，7，9，10], w = [1，2，3，5]﻿﻿，v / w = [4，3.5，3，2]

#include <iostream>
#include <algorithm>
using namespace std;
#define MAXN 10

double v[MAXN + 1], w[MAXN + 1], pvalue[MAXN];
int n, W;
double cw, cv, bestv;
int x[MAXN], bestx[MAXN];
///////////////////////////////////////
//本段程序为随机快排
inline void swap(int &a, int &b)
{
	int tmp=a;
	a = b;
	b = tmp;
}

int partition(int p, int q)
{
	int r = rand() % (q - p + 1) + p;
	swap(pvalue[p], pvalue[r]);
	swap(v[p], v[r]);
	swap(w[p], w[r]);
	int i = p;
	int j = q + 1;
	while (1)
	{
		while (pvalue[++i] > pvalue[p]);
		while (pvalue[--j] < pvalue[p]);
		if (i >= j)
			break;
		swap(pvalue[i], pvalue[j]);
		swap(v[i], v[j]);
		swap(w[i], w[j]);
	}
	swap(pvalue[p], pvalue[j]);
	swap(v[p], v[j]);
	swap(w[p], w[j]);

	return j;
}

void random_qsort(int p, int q)
{
	if (p < q)
	{
		int r = partition(p, q);
		random_qsort(p, r - 1);
		random_qsort(r + 1, q);
	}
}
//////////////////////////////////
/*限界函数*/
double bound(int i)
{
	double rw = W - cw;
	double b = cv;

	while (i + 1 <= n && w[i + 1] <= rw)
	{
		rw -= w[i + 1];
		b += v[i + 1];
		++i;
	}
	if (i + 1 <= n)
	{
		b = b + w[i + 1] / w[i + 1] * rw;
	}

	return b;
}
/*背包回溯*/
void BacktrackKnap(int t)
{
	if (t > n)
	{
		if (cv > bestv)
		{
			bestv = cv;
			for (int i = 1; i <= n; ++i)
				bestx[i] = x[i];
		}
	}
	else
	{
		if (cw + w[t] <= W)
		{
			x[t] = 1;
			cw += w[t];
			cv += v[t];
			BacktrackKnap(t + 1);
			cw -= w[t];
			cv -= v[t];
		}
		if (bound(t) > bestv)
		{
			x[t] = 0;
			BacktrackKnap(t + 1);
		}
	}
}

int main()
{
	system("title 回溯法解决0-1背包");
	system("color 02");

	int i;
	cin >> n >> W;
	for (i = 1; i <= n; ++i)
	{
		cin >> v[i] >> w[i];
		pvalue[i] = v[i] / w[i];
	}
	random_qsort(1, n);
	BacktrackKnap(1);
	cout << bestv << endl;
	for (i = 1; i <= n; ++i)
		cout << bestx[i] << " ";
	cout << endl;

	return 0;
}		
```

<div align="center">
<img src="http://rann.cc/assets/img/qrcode-logo.png" width="340" height="400" />
</div>

> 本文系本人个人公众号「梦回少年」原创发布，扫一扫加关注。