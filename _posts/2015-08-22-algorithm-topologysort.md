---
layout: post
title: 『原创』算法#3 深度优先搜索+拓扑排序
tags: 原创 Algorithm DFS
category: 算法
date: 2015-08-22 20:45:05
---

### 深度优先搜索+拓扑排序 

深度优先搜索可以实现拓扑排序

//深度优先搜索的完成时间进行排序就是拓扑排序的逆序。

输入图G

![](http://7xlkoc.com1.z0.glb.clouddn.com/dfs.png "茶馆、岛、慵懒的猫...都是美好的时光...")

G的邻接矩阵存储data.txt

```bash
6
0 1 0 1 0 0
0 0 1 0 0 0
0 0 0 1 0 0
0 1 0 0 0 0
0 0 1 0 0 1
0 0 0 0 0 0
```

DFS程序

```java
/*
 * @file						DFS.cpp
 * @brief						implementing DFS page117
 * @author					taoxiaoxiao
 * @date						10-1-2014
*/

#include <iostream>
#include <fstream>
using namespace std;

#define NIL -1
#define WHITE 0
#define GRAY 1
#define BLACK 2
#define INF 0x3f3f3f3f
#define MAXN 101

int graph[MAXN][MAXN]; 
int dist[MAXN], f[MAXN];
int color[MAXN], pre[MAXN];
int N, time;

void DFSVisit(int u)
{
	color[u] = GRAY;
	time=time+1;
	dist[u] = time;
	for (int i = 0; i < N; ++i)
	{
		if (graph[u][i] != 0 && color[i] == WHITE)
		{
			pre[i] = u;
			DFSVisit(i);
		}
	}
	color[u] = BLACK;
	time ++;
	f[u] = time;
}

void DFS()
{
	int i;

	for (i = 0; i < N; ++i)
	{
		color[i] = WHITE;
		pre[i] = NIL;
	}
	time = 0;
	for (i = 0; i < N; ++i)
	{
		if (color[i] == WHITE)
			DFSVisit(i);
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
		cout << "open file error" << endl;
		return 0;
	}
	while (!infile.eof())
	{
		infile >> N;
		for (i = 0; i < N; ++i)
		{
			for (j = 0; j < N; ++j)
				infile >> graph[i][j];
		}
		DFS();
		for (i = 0; i < N; ++i)			//顶点访问结束时间
			cout << f[i] << " ";
		cout << endl;
	}

	return 0;
}
```

顶点完成时间排序的一个拓扑排序

```java
/*
* @file						DFS.cpp
* @brief					implementing DFS+拓扑排序
* @author/Univ.				taoxiaoxiao
* @date						10-1-2014
*/

#include <iostream>
#include <fstream>
using namespace std;

#define NIL -1
#define WHITE 0
#define GRAY 1
#define BLACK 2
#define INF 0x3f3f3f3f
#define MAXN 101

int graph[MAXN][MAXN];
int dist[MAXN], f[MAXN];
int color[MAXN], pre[MAXN];
int N, time;

struct str_node
{
	int id;
	int time;
} node[10];

int cmp(const void *x, const void *y)
{
	return (*(str_node*)x).time >  (*(str_node*)y).time ? -1 : 1;
}

void DFSVisit(int u)
{
	color[u] = GRAY;
	time = time + 1;
	dist[u] = time;
	for (int i = 0; i < N; ++i)
	{
		if (graph[u][i] != 0 && color[i] == WHITE)
		{
			pre[i] = u;
			DFSVisit(i);
		}
	}
	color[u] = BLACK;
	time++;
	f[u] = time;
}

void DFS()
{
	int i;

	for (i = 0; i < N; ++i)
	{
		color[i] = WHITE;
		pre[i] = NIL;
	}
	time = 0;
	for (i = 0; i < N; ++i)
	{
		if (color[i] == WHITE)
			DFSVisit(i);
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
		cout << "open file error" << endl;
		return 0;
	}
	while (!infile.eof())
	{
		infile >> N;
		for (i = 0; i < N; ++i)
		{
			for (j = 0; j < N; ++j)
				infile >> graph[i][j];
		}
		DFS();
		for (i = 0; i < N; ++i)
		{
			node[i].id = i;
			node[i].time = f[i];
		}
		qsort(node, N, sizeof(node[0]), cmp);

		for (i = 0; i < N; ++i)
		{
			cout << node[i].id << " ";
		}
		cout << endl;
	}

	return 0;
}
```
输出一个拓扑排序

4 5 0 1 2 3

<div align="center">
<img src="http://rann.cc/assets/img/qrcode-logo.png" width="340" height="400" />
</div>

> 本文系本人个人公众号「梦回少年」原创发布，扫一扫加关注。