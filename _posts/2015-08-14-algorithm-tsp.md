---
layout: post
title: 『原创』算法#2 模拟退火求解TSP问题
tags: 原创 Algorithm TSP 模拟退火
category: 算法
date: 2015-08-14 16:48:06
---

**注意：本文采用<2变换法产生路径>**

**问题描述：经典TSP问题。**

旅行商问题，即TSP问题（Travelling Salesman Problem）又译为旅行推销员问题、货郎担问题，是数学领域中著名问题之一。假设有一个旅行商人要拜访n个城市，他必须选择所要走的路径，路径的限制是每个城市只能拜访一次，而且最后要回到原来出发的城市。路径的选择目标是要求得的路径路程为所有路径之中的最小值。

```java
 /*
 * @file2                             SA.cpp
 * @brief                             SA解TSP
 * @author/Univ.                      taoxiaoxiao/XMU
 * @date                              11-2-2014
*/

#include <iostream>
#include <fstream>
#include <random>
using namespace std;

#define max 51                                           //最大的输入规格
int a[max][max];                                         //距离矩阵
int curPath[max], newPath[max], bestPath[max];          //当前解、新解、最优解
int length, bestLength = 0;                              //解的结果、最优解的结果
int n;                                                    //输入的节点数
int Lk= 2000;                                            //Mapkob链长
double t = 100.0, alpha = 0.9;                            //温度、衰减速度

double rand1()
{
        //产生0-1间随机数

    static default_random_engine e;                        //引擎
    static uniform_real_distribution<double> u(0, 1);      //分布

    return u(e);
}

int rand2(int n)
{
    static default_random_engine e;                        //引擎
    static uniform_int_distribution<int> u(1, n);          //分布
    return u(e);
}

inline void swap(int &a, int &b)
{
    int tmp = a;
    a = b;
    b = tmp;
}

int getLength(int *p) 
{
    int len = 0;
    for (int i = 1; i <= n - 1; ++i) 
    {
        len += a[p[i]][p[i + 1]];
    }
    len += a[p[n]][p[1]];

    return len;
}
/*2变换法产生新路径*/
int getNewPath()
{
    //获得新路径，并求出新长度
    int k, m;
    int newLen = 0;

    /* 2分交换 */
    while (1)
    {
        k = rand2(n);
        m = rand2(n);
        if (k != m)
            break;
    }
    /* 新路径 */
    swap(newPath[k], newPath[m]);
    newLen = getLength(newPath);

    return newLen;
}

void sa() 
{
    int i, count;
    int newLength, delta;
    int s = 0;
    int bChange = 0;

    /*初始化操作*/
    for (i = 1; i<= n; i++) 
    {
        bestPath[i]=newPath[i]=curPath[i] = i;
    }
    length = getLength(curPath);
    bestLength = length;

    /*按Metropolis接受准则进行迭代*/
    while (1) 
    {
        count = 0;
        //对每个温度tk产生Lk个解 Lk个解构成一个mapkob链
        while (1) 
        {
            newLength = getNewPath();
            delta = newLength - length;
            if (delta <= 0 || (delta>0 && exp(-delta / t)>rand1())) 
            {       
                //是否接受新解
                bChange = 1;
                for (i = 1; i <= n; i++) 
                {
                    curPath[i] = newPath[i];
                }
                length = newLength;
                if (length < bestLength) 
                {
                    bestLength = length;
                    for (i = 1; i <= n; i++) 
                    {
                        bestPath[i] = curPath[i];
                    }
                }
            }
            if (++count >= Lk) 
                break;
        }//1-while

        t = alpha * t;          //降温
        if (1==bChange) 
        {
            s = 0;
            bChange = 0;
        }
        else 
        {
            s++;
        }
        if (s == 2 || t <=1e-6)
        {           
            //停止准则
            //温度接近零或者有两次结果没变化时
            break;
        }
    }//2-while
}

int main() 
{
    ifstream infile("file2.txt");

    int i, j;
    if (infile.is_open())
        cout << "open file successful." << endl;
    else
    {
        cout << "open file error." << endl;
        return 0;
    }
    while (!infile.eof())
    {
        infile >> n;
        for (i = 1; i <= n; ++i)
        {
            for (j =1; j <= n; ++j)
                infile >> a[i][j];
        }
    }
    infile.close();

    sa();
    for (i = 1; i <= n; ++i)
        cout << bestPath[i] << "->";
    cout << bestPath[1] << endl;
    cout << bestLength << endl;
    system("pause");

    return 0;
}
``` 

需要file2.txt的可以给我回复。

<div align="center">
<img src="http://rann.cc/assets/img/qrcode-logo.png" width="340" height="400" />
</div>

> 本文系本人个人公众号「梦回少年」原创发布，扫一扫加关注。