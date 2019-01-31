---
layout: post
title: 『原创』算法#5 矩阵链乘法（备忘录法）
tags: 原创 Algorithm 备忘录法
category: 算法
date: 2015-08-25 21:01:13
---

### 矩阵连乘 备忘录法

![](http://7xlkoc.com1.z0.glb.clouddn.com/matrix.png "茶馆、岛、慵懒的猫...都是美好的时光...")

**矩阵连乘**

```java
/*
 * @file					MemoMatrixchain.cpp
 * @brief					memorized way
 * @author/Univ.			taoxiaoxiao
 * @version					v1.0
 * @date					11-3-2013
*/
//实例 A1-A6：30X35 35X15 15X5 5X10 10X20 20X25
#include <iostream>
#include <vector>
using namespace std;

#define N 6
#define INF 0x3f3f3f3f

int m[N + 1][N + 1];

int LookupChain(vector<int>p, int i, int j)
{
	if (m[i][j] < INF)
		return m[i][j];
	if (i == j)
		m[i][j] = 0;
	else
	{
		for (int k = i; k <= j - 1; ++k)
		{
			int q = LookupChain(p, i, k) + LookupChain(p, k + 1, j)
				+ p[i - 1] * p[k] * p[j];
			if (q < m[i][j])
				m[i][j] = q;
		}
	}
	return m[i][j];
}

void MemorizedMatrixChain(vector<int>p)
{
	int n = p.size() - 1;
	for (int i = 1; i <= n; ++i)
	{
		for (int j = i; j <= n; ++j)
			m[i][j] = INF;
	}
	LookupChain(p, 1, n);
}

int main()
{
	vector<int> p{ 30, 35, 15, 5, 10, 20, 25 };

	cout << "矩阵维度为: ";
	for (auto i = p.begin(); i < p.end(); ++i)
		cout << *i << " ";
	cout << endl;

	MemorizedMatrixChain(p);
	cout << "最小乘法次数: " << m[1][6] << endl;

	return 0;
}
```
**可参考本站 矩阵连乘（动态规划法）和矩阵连乘（递归法）**

<div align="center">
<img src="http://rann.cc/assets/img/qrcode-logo.png" width="340" height="400" />
</div>

> 本文系本人个人公众号「梦回少年」原创发布，扫一扫加关注。