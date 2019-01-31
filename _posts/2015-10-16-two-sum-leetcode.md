---
layout: post
title: 『原创』Two Sum - Leetcode
tags: 原创 Algorithm LeetCode
category: 算法
date: 2015-10-16 16:36:01
---

**来源：Leetcode #Problem1**

**题目描述：**
Given an array of integers, find two numbers such that they add up to a specific target number.
The function twoSum should return indices of the two numbers such that they add up to the target, where index1 must be less than index2\. Please note that your returned answers (both index1 and index2) are not zero-based.
You may assume that each input would have exactly one solution.

**Input: numbers={2, 7, 11, 15}, target=9
Output: index1=1, index2=2**

解决方法：

一开始使用循环搜索，本地可以运行，OJ上显示超时，显然需要降低时间复杂度，遂采用hashmap实现O(n)复杂度的算法。
代码如下

```java
public class Solution {
    public int[] twoSum(int[] nums, int target) {
       int[] res = new int[2];
		Map<Integer, Integer> map = new HashMap<Integer, Integer>();
		for (int i= 0; i<nums.length; i++) {
			if (map.containsKey(target-nums[i])) {
				res[1] = i+1;
				res[0] = map.get(target-nums[i]);
				return res;
			}

			map.put(nums[i], i+1);
		}

		return res;
    }
}
```

这种题在leetcode上是一类题，站长会陆续更新的。

<div align="center">
<img src="http://rann.cc/assets/img/qrcode-logo.png" width="340" height="400" />
</div>

> 本文系本人个人公众号「梦回少年」原创发布，扫一扫加关注。