---
layout: post
title: Junit4中的新断言assertThat的方法
tags: Junit
category: Java
---

> 原文出处：http://www.gn00.com/t-184116-1-1.html

如果需要是用assertThat需要在项目中引入junit4的jar包,以及hamcrest-core.jar和hamcrest-library.jar

下面是常用断言的代码

```java
import static org.hamcrest.Matchers.*;
 import static org.junit.Assert.assertThat;
  
 import java.util.ArrayList;
 import java.util.HashMap;
 import java.util.List;
 import java.util.Map;
  
 import org.junit.Before;
 import org.junit.Test;
  
 import com.lyh.share.model.User;
  
 public class UserDaoTest {
          
         private User test1;
         private User test2;
          
         @Before
         public void init(){
                 test1 = new User();
                 test1.setUsername("tt1");
                 test1.setPassword("123");
                 test1.setShares(50);
                 test2 = new User();
                 test2.setUsername("tt2");
                 test2.setPassword("321");
                 test2.setShares(20);
         }
          
         @Test
         public void findUser(){
                  
                 /**数值匹配**/
                 //测试变量是否大于指定值
                 assertThat(test1.getShares(), greaterThan(50));
                 //测试变量是否小于指定值
                 assertThat(test1.getShares(), lessThan(100));
                 //测试变量是否大于等于指定值
                 assertThat(test1.getShares(), greaterThanOrEqualTo(50));
                 //测试变量是否小于等于指定值
                 assertThat(test1.getShares(), lessThanOrEqualTo(100));
                  
                 //测试所有条件必须成立
                 assertThat(test1.getShares(), allOf(greaterThan(50),lessThan(100)));
                 //测试只要有一个条件成立
                 assertThat(test1.getShares(), anyOf(greaterThanOrEqualTo(50), lessThanOrEqualTo(100)));
                 //测试无论什么条件成立(还没明白这个到底是什么意思)
                 assertThat(test1.getShares(), anything());
                 //测试变量值等于指定值
                 assertThat(test1.getShares(), is(100));
                 //测试变量不等于指定值
                 assertThat(test1.getShares(), not(50));
                  
                 /**字符串匹配**/
                 String url = "http://www.taobao.com";
                 //测试变量是否包含指定字符
                 assertThat(url, containsString("taobao"));
                 //测试变量是否已指定字符串开头
                 assertThat(url, startsWith("http://"));
                 //测试变量是否以指定字符串结尾
                 assertThat(url, endsWith(".com"));
                 //测试变量是否等于指定字符串
                 assertThat(url, equalTo("http://www.taobao.com"));
                 //测试变量再忽略大小写的情况下是否等于指定字符串
                 assertThat(url, equalToIgnoringCase("http://www.taobao.com"));
                 //测试变量再忽略头尾任意空格的情况下是否等于指定字符串
                 assertThat(url, equalToIgnoringWhiteSpace("http://www.taobao.com"));
                  
                  
                 /**集合匹配**/
                  
                 List<User> user = new ArrayList<User>();
                 user.add(test1);
                 user.add(test2);
                  
                 //测试集合中是否还有指定元素
                 assertThat(user, hasItem(test1));
                 assertThat(user, hasItem(test2));
  
                 /**Map匹配**/
                 Map<String,User> userMap = new HashMap<String,User>();
                 userMap.put(test1.getUsername(), test1);
                 userMap.put(test2.getUsername(), test2);
                  
                 //测试map中是否还有指定键值对
                 assertThat(userMap, hasEntry(test1.getUsername(), test1));
                 //测试map中是否还有指定键
                 assertThat(userMap, hasKey(test2.getUsername()));
                 //测试map中是否还有指定值
                 assertThat(userMap, hasValue(test2));
         }
          
 }
```


### 联系我

- 邮箱: xmusaber@163.com
- QQ: 932191671

<div align="center">
<img src="http://rann.cc/assets/img/qrcode-logo.png" width="340" height="400" />
</div>

> 本文系本人个人公众号「梦回少年」原创发布，扫一扫加关注。