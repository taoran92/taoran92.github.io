---
layout: post
title: 『原创』算法#1 C++ 信使
tags: 原创 Algorithm 最短路径
category: 算法
date: 2015-08-05 22:55:40
description: 最短路径问题
---

**问题描述**

战争时期，前线有n个哨所，每个哨所可能会与其他若干个哨所之间有通信联系。信使负责在哨所之间传递信息，当然，这是要花费一定时间的（以天为单位）。指挥部设在第一个哨所。当指挥部下达一个命令后，指挥部就派出若干个信使向与指挥部相连的哨所送信。当一个哨所接到信后，这个哨所内的信使们也以同样的方式向其他哨所送信。直至所有n个哨所全部接到命令后，送信才算成功。因为准备充足，每个哨所内都安排了足够的信使（如果一个哨所与其他k个哨所有通信联系的话，这个哨所内至少会配备k个信使）。
现在总指挥请你编一个程序，计算出完成整个送信过程最短需要多少时间。

输入格式

输入文件msner.in，第1行有两个整数n和m，中间用1个空格隔开，分别表示有n个哨所和m条通信线路。1<=n<=100。
第2至m+1行：每行三个整数i、j、k，中间用1个空格隔开，表示第i个和第j个哨所之间存在通信线路，且这条线路要花费k天。

输出格式

输出文件msner.out，仅一个整数，表示完成整个送信过程的最短时间。如果不是所有的哨所都能收到信，就输出-1。

输入样例

```bash
4 4
1 2 4
2 3 7
2 4 1
3 4 6
```

输出样例
11

算法思想：最短路径。求出源点到所有点的最短路径然后求最大。若某点从源点不可达，即dist[i]==INF，输出-1

代码实现

```java
 /*
 * @file				Dijkstra.cpp
 * @brief				求解单源最短路径
 * @author				tao
*/
#include <iostream>
#include <algorithm>
using namespace std;
#define MAXN 101
#define INF 0x3f3f3f3f

int graph[MAXN][MAXN];
int dist[MAXN];

void ShortestPath_Dijk(int n)
{
	int i, j;
	bool S[MAXN];

	for (i = 1; i <= n; ++i)
	{
		dist[i] = graph[1][i];
		S[i] = 0;
	}
	dist[1] = 0;
	S[1] = 1;
	for (i = 2; i <= n; ++i)
	{
		int min = INF;
		int u = 1;

		for (j = 1; j <= n; ++j)
		{
			if (!S[j] && dist[j] < min)
			{
				u = j;
				min = dist[j];
			}
		}
		S[u] = 1;

		/*松弛操作*/
		for (j = 1; j <= n; ++j)
		{
			if (!S[j] && graph[u][j] < INF)
				if (dist[u] + graph[u][j] < dist[j])
				{
					dist[j] = dist[u] + graph[u][j];
				}
		}
	}
}

int main()
{
	int  n, m, time;
	int x, y, cost;
	bool flag;

	memset(graph, INF, sizeof(graph));
	memset(dist, INF, sizeof(dist));
	while (cin >> n >> m)
	{
		for (int i = 1; i <= m; ++i)
		{
			cin >> x >> y >> cost;
			graph[x][y]= graph[y][x] = cost;
		}
		ShortestPath_Dijk(n);
		flag = false;
		for (int i = 1; i <= n; i++)
		{
			if (dist[i] == INF)
			{
				flag = true;
				break;
			}
			else
			{
				time = max(time, dist[i]);
			}
		}

		if (flag) cout << "-1" << endl;
		else
		{
			cout << time << endl;
		}
		//长度

	}
	return 0;
}
```

<div align="center">
<img src="http://rann.cc/assets/img/qrcode-logo.png" width="340" height="400" />
</div>

> 本文系本人个人公众号「梦回少年」原创发布，扫一扫加关注。