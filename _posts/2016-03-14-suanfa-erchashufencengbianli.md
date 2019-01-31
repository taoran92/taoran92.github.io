---
layout: post
title: 『原创』二叉树的分层遍历
tags: 原创 Algorithm
category: 算法
---

> 二叉树的分层遍历

题目要求：给定一个二叉树的root结点，然后按照每层从左到右的顺序将二叉树结点的值储存在一个二维数组中，每一层一个数组，每一个数组的元素是按照从左到右的顺序进行存储的。

思路：二叉树的分层打印类似于图的广度优先遍历算法，我们可以借助一个队列实现这个过程。

- 初始化队列 将root结点加入到队列之中
- 判断当前队列是否为空
  - 不为空，则出队队列的首元素 并且将不为空的结点入队列
  - 为空则表示遍历完成

经过上述操作之后就可以得到二叉树分层遍历的顺序了。但是我们并不能得到每一个层都有什么元素这样的信息，我们还需要在遍历的过程中使用变量记录这一个过程。

一个`last`变量记录当前打印行的最右结点

一个`nLast`变量记录加入队列的最近一个元素

在元素弹出的时候判断一下是否和`last`元素相等，相等则表示要换行了，这时候要更新`last`的值，就是将`nLast`赋值给`last`即可，这样就实现了这个功能。

```java

import java.util.*;

public class Java {

	public static void main(String[] args) {
		TreeNode one = new TreeNode(1);
		TreeNode two = new TreeNode(2);
		TreeNode three =new TreeNode(3);
		TreeNode four = new TreeNode(4);
		TreeNode five = new TreeNode(5);
		TreeNode six = new TreeNode(6);
		TreeNode seven = new TreeNode(7);
		TreeNode eight = new TreeNode(8);
		TreeNode nine = new TreeNode(9);
		TreeNode ten = new TreeNode(10);
		TreeNode n11 = new TreeNode(11);
		TreeNode n12 = new TreeNode(12);
		TreeNode n13 = new TreeNode(13);
		TreeNode n14 = new TreeNode(14);

		one.left = two;
		one.right = three;
		//two.left = four;
		two.right = five;
		three.left = six;
		three.right = seven;
		four.left = eight;
		//four.right = nine;
		//five.left = ten;
		five.right = n11;
		six.left = n12;
		six.right = n13;

		n13.right = n14;

		TreePrinter p = new TreePrinter();
		int[][] result = p.printTree(one);
		for (int i = 0; i < result.length; i++) {
			for (int j = 0; j < result[i].length; j++) {
				System.out.print(result[i][j]);
			}
			System.out.println("");
		}
	}

}

class TreePrinter {
    public int[][] printTree(TreeNode root) {
        // write code here
    	if (null == root) {
    		return null;
    	}

    	if (null == root.left && null == root.right) {
    		int[][] result = {{root.val}};
    		return result;
    	}

    	int[][] result = new int[10][];

    	Queue<TreeNode> queue = new LinkedList<TreeNode>();	
    	TreeNode last = root;
    	TreeNode nLast = root.right == null ? root.left : root.right;

    	int i = 0;
    	int j = 0;

    	int numOfLine[] = new int[10];

    	result[i] = new int[1];

    	queue.add(root);

    	while(!queue.isEmpty()) {

    		TreeNode tree = queue.poll();
    		result[i][j++] = tree.val;
    		numOfLine[i]++;

    		if (tree.left != null) {
    			queue.add(tree.left);
    			nLast = tree.left;
    		}
    		if (tree.right != null) {
    			queue.add(tree.right);
    			nLast = tree.right;
    		}

    		if (last == tree) {
    			j = 0;
    			i++;
    			result[i] = new int[(int)(Math.pow((double)2, (double)i))];
    			last = nLast;
    		}

    		
    	}

    	int[][] r = new int[i][];
    	//System.out.println(i+"");
    	for (int g = 0; g < i; g++) {
    		r[g] = new int[numOfLine[g]];
    		for (int h = 0; h < numOfLine[g]; h++) {
    			r[g][h] = result[g][h];
    		}
    	}
    	result = null;
    	return r;
    }
}

class TreeNode {
    public int val = 0;
    public TreeNode left = null;
    public TreeNode right = null;
    public TreeNode(int val) {
        this.val = val;
    }
}
```

<div align="center">
<img src="http://rann.cc/assets/img/qrcode-logo.png" width="340" height="400" />
</div>

> 本文系本人个人公众号「梦回少年」原创发布，扫一扫加关注。  


