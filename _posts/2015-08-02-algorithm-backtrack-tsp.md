---
layout: post
title: 『原创』算法#9 回溯法求解TSP
tags: 原创 Algorithm TSP
category: 算法
date: 2015-08-02 21:22:26
---

**问题描述：经典TSP问题。**

旅行商问题，即TSP问题（Travelling Salesman Problem）又译为旅行推销员问题、货郎担问题，是数学领域中著名问题之一。假设有一个旅行商人要拜访n个城市，他必须选择所要走的路径，路径的限制是每个城市只能拜访一次，而且最后要回到原来出发的城市。路径的选择目标是要求得的路径路程为所有路径之中的最小值。

**回溯法解决方案：**

```java
/*
 * @file						TSP.cpp
 * @brief						with Backtrack's way
 * @author/Univ.				taoxiaoxiao
 * @date						12-2-2013
*/
//回溯法求解TSP
#include <iostream>
#include <fstream>
using namespace std;
#define MAXN 10
#define INF 0x3f3f3f3f

int x[MAXN + 1], bestx[MAXN + 1];
int graph[MAXN+1][MAXN+1];
int cw=0, bestw=INF;
int n;

void output()
{
	cout << bestw << endl;
	for (int i = 1; i <= n; ++i)
		cout << bestx[i] << " ";
	cout << x[1] << endl;
	cout << "********************" << endl;
}

void swap(int &a, int &b)
{
	int temp = a;
	a = b;
	b = temp;
}

void BacktrackTSP(int t)
{
	if (t == n)
	{
		if (graph[x[n - 1]][x[n]] != INF && graph[x[n]][1] != INF)
		{
			if (cw + graph[x[n - 1]][x[n]] + graph[x[n]][1] < bestw)
			{
				bestw = cw + graph[x[n - 1]][x[n]] + graph[x[n]][1];
				for (int i = 1; i <= n; ++i)
					bestx[i] = x[i];
			}
		}
	}
	else
	{
		for (int i= t; i <= n; ++i)
		{
			if (graph[x[t - 1]][x[i]] != INF && cw + graph[x[t - 1]][x[i]] < bestw)
			{
				swap(x[t], x[i]);
				cw += graph[x[t - 1]][x[t]];
				BacktrackTSP(t + 1);
				cw -= graph[x[t - 1]][x[t]];
				swap(x[t], x[i]);
			}
		}
	}
}

int main()
{
	system("title 回溯法解TSP");
	system("color 02");

	ifstream infile("data.txt");
	if (infile.is_open())
		cout << "open successful." << endl;
	else
	{
		cout << "open file error." << endl;
		return 0;
	}
	cout << "********************" << endl;
	while (!infile.eof())
	{
		int i, j;
		infile >> n;
		for (i = 1; i <= n; ++i)
		{
			for (j = 1; j <= n; ++j)
				infile >> graph[i][j];
		}
		for (i = 1; i <= n; ++i)
			x[i] = i;
		BacktrackTSP(2);
		output();
		cw = 0, bestw = INF;
	}
	infile.close();
	system("pause");

	return 0;
}
```

data.txt

```sh
4
0 30 6 4
30 0 5 10
6 5 0 20
4 10 20 0
4
0 30 6 100
30 0 5 10
6 5 0 20
100 10 20 0
4
0 30 600 100
30 0 5 10
600 5 0 20
100 10 20 0
```

<div align="center">
<img src="http://7xlkoc.com1.z0.glb.clouddn.com/tracebackres.png" />
</div>

<div align="center">
<img src="http://rann.cc/assets/img/qrcode-logo.png" width="340" height="400" />
</div>

> 本文系本人个人公众号「梦回少年」原创发布，扫一扫加关注。