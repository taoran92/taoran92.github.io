---
layout: post
title: 『原创』算法#7 矩阵连乘（递归法）
tags: 原创 Algorithm 递归
category: 算法
date: 2015-08-12 21:08:27
---

### 矩阵连乘（递归法）

```java
/*
 * @file					RecursiveMatrixChain.cpp
 * @brief					 Martrix Chain
 * @author/Univ.			taoran
 * @version					v1.0
 * @date					11-3-2013
*/
//实例 A1-A6：30X35 35X15 15X5 5X10 10X20 20X25
#include<iostream>
#include <vector>
using namespace std;

#define INF 0x3f3f3f3f
#define N 6

int m[N + 1][N + 1];

int RecursiveMatrixChain(vector<int>p, int i, int j)
{
	if (i == j)
		return 0;
	m[i][j] = INF;
	for (int k = i; k <= j - 1; ++k)
	{
		int q = RecursiveMatrixChain(p, i, k) + RecursiveMatrixChain(p, k + 1, j)
			+ p[i - 1] * p[k] * p[j];
		if (q < m[i][j])
			m[i][j] = q;
	}
	return m[i][j];
}

int main()
{
	vector<int> p{ 30, 35, 15, 5, 10, 20, 25 };

	cout << "矩阵维度为: ";
	for (auto i = p.begin(); i < p.end(); ++i)
		cout << *i << " ";
	cout << endl;

	RecursiveMatrixChain(p, 1, 6);
	cout << "最小乘法次数: " << m[1][6] << endl;

	return 0;
}
```
可参考本站矩阵连乘（动态规划法）和矩阵连乘（备忘录法）

<div align="center">
<img src="http://rann.cc/assets/img/qrcode-logo.png" width="340" height="400" />
</div>

> 本文系本人个人公众号「梦回少年」原创发布，扫一扫加关注。