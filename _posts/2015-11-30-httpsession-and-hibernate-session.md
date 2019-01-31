---
layout: post
title: HttpSession与Hibernate中Session的区别
tags: JavaWeb
category: Java
date: 2015-11-30 16:04:17
---

<font color="red"><center>本文部分内容转载于网络，站长已阅读并测试，保证其正确性。Update:2015-11-4</center></font>

## 一、javax.servlet.http.HttpSession是一个抽象接口

它的产生:J2EE的Web程序在运行的时候,会给每一个新的访问者建立一个HttpSession,这个Session是用户身份的唯一表示。注意,是容器(Tomcat,Resin)自动创建的。

用途:存放这个用户的一些经常被用到的信息,例如:用户名,权限。例如在购物车程序里,存放用户买的商品。

销毁:一定时间(跟容器有关)内,用户无任何动作,session自动销毁。

得到的方法:

HttpSession session = request.getSession();

常用方法setAttribute

session.setAttribute(key,value);

这样在另一个jsp或者Servlet里,可以用

session.getAttribute(key);得到value

类似一个Map

## 二、org.hibernate.Session

它是hibernate操作数据库的一个句柄对象。它跟上面那个Session唯一的相似处就是名字有点像,其他没任何一样的地方。

一般的Hibernate程序中,Session由用户手动获取,手动关闭。

正规项目中,在业务层获取Session

Session session = HibernateSessionFactory.openSession();

然后把此session传给dao层,将数据持久化或其他的操作。

一次业务逻辑可能调用多个dao方法,例如银行转帐,是一个先减后增的过程,所以会调用2个dao里的方法(甲帐户减,乙帐户增)。因此,可以利用业务层产生的同一个Session来做这件事

a1和a2代表帐户实体。

a1是甲的,a2是乙的。

a1.setAcount(a1.getAcount()-1000);

a2.setAcount(a2.getAcount()+1000);

dao.update(a1,session);

dao.update(a2,session);

Transaction tx = session.beginTransaction();

tx.commit();

最后在业务层,将session关闭

session.close();

或者调用HibernateSessionFactory.closeSession(session);

最好能加上异常捕捉,之类,如产生异常,即时回滚。保证操作不出意外。
```java
try{
...
tx.commit();

}catch(Exception e){
tx.rollback();
}finally{
HibernateSessionFactory.closeSession(session);
}
```
默认session的时间为20分钟,如果想在这之前清除的话可以使用Session.Abandorn方法

<div align="center">
<img src="http://rann.cc/assets/img/qrcode-logo.png" width="340" height="400" />
</div>

> 本文系本人个人公众号「梦回少年」原创发布，扫一扫加关注。