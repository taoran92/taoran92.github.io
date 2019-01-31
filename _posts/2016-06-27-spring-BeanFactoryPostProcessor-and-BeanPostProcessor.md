---
layout: post
title: spring后置处理器BeanFactoryPostProcessor和BeanPostProcessor的用法和区别
tags: Spring
category: Java
---

BeanFactoryPostProcessor和BeanPostProcessor都是Spring初始化bean的扩展点。两个接口非常相似。它们的主要区别是： BeanFactoryPostProcessor可以修改BEAN的配置信息而BeanPostProcessor不能，BeanFactoryPostProcessor的回调比BeanPostProcessor要早。
 
BeanFactoryPostProcessor可以对bean的定义（配置元数据）进行处理。也就是说，Spring IoC容器允许BeanFactoryPostProcessor在容器实际实例化任何其它的bean之前读取配置元数据，并有可能修改它。如果你愿意，你可以配置多个BeanFactoryPostProcessor。你还能通过设置 order 属性来控制BeanFactoryPostProcessor的执行次序。

注册BeanFactoryPostProcessor的实例，需要重载

```java
void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException;
```

通过beanFactory可以获取bean的示例或定义等。同时可以修改bean的属性，这是和BeanPostProcessor最大的区别。

例如：

```java
BeanDefinition bd = beanFactory.getBeanDefinition("xxBean");  
MutablePropertyValues mpv =  bd.getPropertyValues();  
if(pv.contains("xxName"))  {  
    pv.addPropertyValue("xxName", "icoder");  
}
```

注册BeanPostProcessor的实例，需要重载

```java
Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException;
Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException;
```

BeanFactoryPostProcessor的回调比BeanPostProcessor要早。

OVER

### 联系我

- 邮箱: xmusaber@163.com
- QQ: 932191671

<div align="center">
<img src="http://rann.cc/assets/img/qrcode-logo.png" width="340" height="400" />
</div>

> 本文系本人个人公众号「梦回少年」原创发布，扫一扫加关注。