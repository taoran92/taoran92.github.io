---
layout: post
title: 数组中只出现一次的数字
tags: Algorithm
category: 算法
description: 一类问题
---

> 在牛客上看到了很多这种题目 今天总结一下吧

[题目](http://www.nowcoder.com/practice/e02fdb54d7524710a7d664d082bb7811?rp=2&ru=/ta/coding-interviews&qru=/ta/coding-interviews/question-ranking)很简单:

>题目描述
一个整型数组里除了两个数字之外，其他的数字都出现了两次。请写程序找出这两个只出现一次的数字。
>
时间限制：1秒空间限制：32768K
通过比例：21.19%
最佳记录：0 ms|8552K

一开始看到这个题目的时候,很简单的想到了在OJ上做过的一道题目-[1106.字符统计器](http://www.acmicpc.sdnu.edu.cn/problem/show/1106).这个题目的思路就是把字符当做一个索引,然后在对应的数组里面进行计数操作.所以这里我也想到了同样的方法,把每一个数字稻作一个Key,把他的个数当做Value来进行操作.代码如下:

	//num1,num2分别为长度为1的数组。传出参数
	//将num1[0],num2[0]设置为返回结果
	import java.util.HashMap;
	import java.util.Map;
	public class Solution {
		public void FindNumsAppearOnce(int[] array, int num1[], int num2[]) {
			if (array.length == 0 || array.length == 1) {
				num2[0] = num1[0] = 0;
			}
			HashMap<Integer, Integer> map = new HashMap<>();
			for (int i = 0; i < array.length; i++) {
				if (map.containsKey(Integer.valueOf(array[i]))) {
					map.put(Integer.valueOf(array[i]), new Integer(2));
				} else {
					map.put(Integer.valueOf(array[i]), new Integer(1));
				}
			}
			boolean isOne = true;
			for (Map.Entry<Integer, Integer> m : map.entrySet()) {
				if (m.getValue().intValue() == 1) {
					if (isOne) {
						num1[0] = m.getKey().intValue();
						isOne = false;
					} else {
						num2[0] = m.getKey().intValue();
					}
				}
			}
		}
	}
    
提交没问题,但是看了一看排行榜,发现C++大神都是0time就通过了= =
然后看了一下人家的代码,发现他们用的完全和我不是一个思路,用的异或运算!一开始我是觉得好神奇的然后就学习了一下.先总结一下大家的思路都有哪些吧.

1. 比较简单粗暴的,挨个数据检索,没除了他以外的所有元素比较.这个很容易想到,但是时间复杂度是n^2.
2. 先排序,然后在检索,这个复杂度主要看排序算法,最好也是nlgn,最坏n^2.
3. 和我上面的思路一样,用数做key,然后计数,复杂度为n.
4. 重点说一下异或运算这个方法.

其实这个思路也很简单:

> 首先,有一个理论基础,就是相等的两个数异或运算后得0;

所以我们对所有的数据都进行异或运算,最后会的到一个不为0的数,这个数是那两个不相同的数(n1,n2)的异或得到的.姑且先把这个数想象成一个二进制的数,他必然有一位是1(假设这个位置是onePosition),这个1的位置处n1,n2必然有一个是1一个是0;当然,这个1的值都是由很多数据参与计算得到的结果,但是影响都是抵消的,所以这里我们再次运用这个结论,我们把onePosition上为1的归为一组,为0的归为一组.这样n1,n2就分别进入了这两个组里,我们再一次进行异或,就可以得到这两个数了.
代码如下:
	
    //num1,num2分别为长度为1的数组。传出参数
	//将num1[0],num2[0]设置为返回结果
	import java.util.HashMap;
	import java.util.Map;
	public class Solution {
		public void FindNumsAppearOnce(int[] array, int num1[], int num2[]) {
			if (array.length == 0 || array.length == 1) {
				num2[0] = num1[0] = 0;
			}
		
			int sum = 0;
			for (int i = 0; i < array.length; i++) {
				sum ^= array[i];
			}

			int onePosition = 0;
			for (int i = 0; i < 32; i++) {
				if (((sum >> i) & 1) == 1) {
					onePosition = i;
					break;
				}
			}

			for (int i = 0; i < array.length; i++) {
				if (((array[i] >> onePosition) & 1) == 1) {
					num1[0] ^= array[i];
				} else {
					num2[0] ^= array[i];
				}
			}
		}
	}

<div align="center">
<img src="http://rann.cc/assets/img/qrcode-logo.png" width="340" height="400" />
</div>

> 本文系本人个人公众号「梦回少年」原创发布，扫一扫加关注。
