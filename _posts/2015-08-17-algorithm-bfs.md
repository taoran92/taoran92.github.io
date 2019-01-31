---
layout: post
title: 『原创』算法#4 广度优先搜索（BFS）+路径打印
tags: 原创 Algorithm BFS
category: 算法
date: 2015-08-17 20:55:27
---

### 广度优先搜索（BFS）+路径打印 

利用队列实现深度优先搜索 。考察顶点2作为源点s的深度优先搜索。

![](http://7xlkoc.com1.z0.glb.clouddn.com/bfs1.png "茶馆、岛、慵懒的猫...都是美好的时光...")

输入data.txt 邻接矩阵存储gaph G

```bash
0 1 0 0 0 0 0 0
1 0 1 0 0 0 0 0
0 1 0 1 0 0 0 0
0 0 1 0 1 1 0 0
0 0 0 1 0 1 1 1
0 0 0 1 1 0 1 0
0 0 0 0 1 1 0 1
0 0 0 0 1 0 1 0
```

程序：

```java
/*
 * @file				BFS.cpp
 * @brief				implementing BFS
 * @author				taoxiaoxiao/XMU
 * @date				11-20-2013
 * @version				v1
*/

#include <iostream>
#include <fstream>
#include <queue>
using namespace std;
#define WHITE 0
#define GRAY 1
#define BLACK 2
#define INF 0x3f3f3f3f
#define NIL -1
#define MAXN 101

int graph[MAXN][MAXN], dist[MAXN];
int pre[MAXN], color[MAXN]; 
int n;

void BFS(int s)
{
	int i;
	for (i = 0; i < n; ++i)
	{
		color[i] = WHITE;
		dist[i]= INF;
		pre[i] = NIL;
	}
	color[s] = GRAY;
	dist[s] = 0;
	pre[s] = NIL;

	queue<int> q;
	q.push(s);
	while (!q.empty())
	{
		int u = q.front();
		q.pop();
		for (i = 0; i < n; ++i)
		{
			if (graph[u][i] != 0 && color[i] == WHITE)
			{
				color[i] = GRAY;
				dist[i] = dist[u] + 1;
				pre[i] = u;
				q.push(i);
			}
		}
		color[u] = BLACK;
	}
}

void showpath(int s, int dest)
{
	if (s == dest)
	{
		cout << s;
		return;
	}
	else if (pre[dest] == NIL)
		cout << "No Path From " << s << " to " << dest << endl;
	else
	{
		showpath(s, pre[dest]);
		cout << " " << dest;
	}

}
int main()
{	
	int i, j;
	ifstream infile("data.txt");
	if (infile.is_open())
		cout << "open file successful." << endl;
	else
	{
		cout << "open file error"<< endl;
		return 0;
	}
	cout << "*************************************\n";
	while (!infile.eof())
	{
		infile >> n;
		for (i = 0; i < n; ++i)
			for (j = 0; j < n; ++j)
				infile >> graph[i][j];
		BFS(2);
		for (i = 0; i < n; ++i)
		{
		cout << "从s点（顶点2）到" << i << " 路径为:";
		showpath(2, i);
		cout << endl;
		cout << "经历的边数为:" << dist[i] << endl;
		cout << "*************************************\n";
		}
	}
	infile.close();

	return 0;
}
```

**程序输出结果：**

<div align="center">
<img src="hhttp://7xlkoc.com1.z0.glb.clouddn.com/bfs2.png" />
</div>

<div align="center">
<img src="http://rann.cc/assets/img/qrcode-logo.png" width="340" height="400" />
</div>

> 本文系本人个人公众号「梦回少年」原创发布，扫一扫加关注。