---
layout: post
title: 『原创』算法#6 矩阵连乘（动态规划）
tags: 原创 Algorithm 动态规划
category: 算法
date: 2015-08-20 13:21:00
---

### 矩阵连乘 动态规划

**题目描述**：给定n个矩阵｛A1,A2,…,An｝，其中Ai与Ai+1是可乘的，i=1,2 ,…,n-1。如何确定计算矩阵连乘积的计算次序，使得依此次序计算矩阵连乘积需要的数乘次数最少。例如：

　　A1={30x35} ; A2={35x15} ;A3={15x5} ;A4={5x10} ;A5={10x20} ;A6={20x25} ;

最后的结果为：((A1(A2A3))((A4A5)A6))  最小的乘次为15125。

**解题思路**：能用动态规划的一个性质就是最优子结构性质，也就是说计算A[i:j]的最优次序所包含的计算矩阵子琏A[i:k]和A[k+1:j]的次序也是最优的。动态规划算法解此问题，可依据其递归式以自底向上的方式进行计算（即先从最小的开始计算）。在计算过程中，保存已解决的子问题答案。每个子问题只计算一次，而在后面需要时只要简单查一下，从而避免大量的重复计算，最终得到多项式时间的算法。我们可以根据下面这个公式来计算结果。其中p[i-1]表示的是第i个矩阵的行数,p[k]表示i:k矩阵合起来后最后得到的列数，p[j]是k+1:j合起来后得到的列数。这个部分的计算方法其实就是计算两个矩阵相乘时总共的乘次数，自己琢磨琢磨就明白了。

![](http://7xlkoc.com1.z0.glb.clouddn.com/matrix.png)

从连乘矩阵个数为2开始计算每次的最小乘次数m[i][j]: m[0][1] m[1][2] m[2][3] m[3][4] m[4][5]  //m[0][1]表示第一个矩阵与第二个矩阵的最小乘次数

然后再计算再依次计算连乘矩阵个数为3:m[0][2] m[1][3] m[2][4] m[3][5]

　　　　　　　　　   连乘矩阵个数为4：m[0][3] m[1][4] m[2][5]

　　　　　　　　　　连乘矩阵个数为5：m[0][4] m[1][5]

　　　　　　　　　　连乘矩阵个数为6：m[0][5] //即最后我们要的结果
**具体实现：**

```java
/*
 * @file				DPMatrixChain.cpp
 * @brief				MatrixChain
 * @author 			        taoxiaoxiao
 * @date				11-3-2013
 * @version			        v1.0
 */

//实例：矩阵维数30X35 35X15 15X5 5X10 10X20 20X25
#include <iostream>;
#include <vector>;
using namespace std;

#define N 6
#define INF 0x3f3f3f3f

int m[N + 1][N + 1], s[N + 1][N + 1];

void DPMatrixChain(vector<int> p)
{
	int n = p.size() - 1;
	int i, j, c, k;

	for (i = 1; i <= n; ++i)
		m[i][i] = 0;
	for (c = 2; c <= n; ++c)
	{
		for (i = 1; i <= n - c + 1; ++i)
		{
			j = i + c - 1;
			m[i][j] = INF;
			for (k = i; k <= j - 1; ++k)
			{
				int q = m[i][k] + m[k + 1][j] + p[i - 1] * p[k] * p[j];
				if (q < m[i][j])
				{
					m[i][j] = q;
					s[i][j] = k;
				}
			}
		}
	}
}

void showpath(int i, int j)
{
	if (i == j)
		cout <<"A"<<i;
	else
	{
		cout <<"(";
		showpath(i, s[i][j]);
		showpath(s[i][j] + 1, j);
		cout <<")";
	}
}

int main()
{
	vector<int> p{ 30, 35, 15, 5, 10, 20, 25 };

	DPMatrixChain(p);
	cout <<"最优加括号方式为：";
	showpath(1, 6);
	cout << endl;
	cout << "最小乘法次数：" << m[1][6] << endl;

	return 0;
}
```

结果

![](http://aimio-tiny.stor.sinaapp.com/tinypic%2Fmatrix2.png)

<div align="center">
<img src="http://rann.cc/assets/img/qrcode-logo.png" width="340" height="400" />
</div>

> 本文系本人个人公众号「梦回少年」原创发布，扫一扫加关注。