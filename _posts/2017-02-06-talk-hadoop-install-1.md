---
layout: post
title: 【Hadoop】深入浅出Hadoop集群搭建补遗
tags: 原创 Hadoop
category: 大数据
---	

搭建此环境主要用来跑实验和论文相关，因此我们的操作直接在root用户下，不可用于生产环境。且下文命令、文件均特指Ubuntu14.04 Linux发行版操作系统下。

本次环境搭建包括Hadoop集群的伪分布式安装（基于虚拟机的方式），同时扩展一些诸如大数据知识，VMware网络方式和linux命令等相关。本文扩展均已黑体EXT标识。

**文件准备**：

```
VMware Workstation10
Ubuntu14.04
jdk-6u24-linux-bin
Hadoop-1.1.2.tar.gz
```

**安装步骤**：

1、ubuntu以root身份登录

2、关闭防火墙（Hadoop各节点间RPC机制通信）

2.1关闭虚拟机防火墙

2.2 关闭主机防火墙

```
方法：ufw disable 
EXT：ufw命令ufw disable | enable | status
```

3、修改ip

3.1 设置虚拟机网络方式为桥接模式

3.2 设置静态IP

方法：

```sudo vi /etc/network/interfaces（针对Ubuntu发行版）```

注：Ubuntu虚拟机的gateway网关，netmask子网掩码设置与主机
一样，IP地址address设置为与主机同一网段。原因参见下文桥接模式。

4、网卡设置生效

方法：```sudo /etc/init.d/networking restart```

5、修改hostname以及绑定

```
修改hostname：vi /etc/hostname
绑定：vi /etc/hosts（防止重启主机名失效）
```

6、配置SSH免密登录

6.1 Ubuntu虚拟机安装openssh-server（确保SSH服务启动）

6.2 Ubuntu虚拟机修改SSH配置文件/etc/ssh/sshd_config将PermitRootLogin without-password改为yes（允许root用户SSH连接）

![](http://taoxiaoran.top/assets/img/blogimg/shaonian2.png)
    
6.3设置免密
执行命令ssh-keygen –t rsa产生密钥，位于目录~/.ssh/

然后```cp id_rsa.pub authorized_keys```

验证 ssh localhost

7、安装JDK
略去

8、安装hadoop

8.1 配置HADOOP_HOME环境变量

8.2 修改hadoop的4个配置文件 位于$HADOOP_HOME/conf下
		
1、hadoop-env.sh

```export JAVA_HOME=/usr/local/jdk1.6.0_24```

2、core-site.xml

```sh
<configuration>
    <property>
        <name>fs.default.name</name>
        <value>hdfs://hadoop:9000</value>
   		<description>改为自己的主机名</description>
    </property>
    <property>
        <name>hadoop.tmp.dir</name>
        <value>/usr/local/hadoop/tmp</value>
    </property>
</configuration>
```

3、hdfs-site.xml

```sh
<configuration>
    <property>
        <name>dfs.replication</name>
       	<value>1</value>
    </property>
    <property>
        <name>dfs.permissions</name>
        <value>false</value>
    </property>
</configuration>
```

4、mapred-site.xml

```sh
<configuration>
    <property>
        <name>mapred.job.tracker</name>
        <value>hadoop:9001</value>
		<description>改为自己的主机名</description>
    </property>
</configuration>
```

8.3 Hadoop NameNode格式化

命令hadoop namenode -format

8.4 启动与验证

启动：start-all.sh 

验证：jps（Hadoop的5个进程）

![](http://taoxiaoran.top/assets/img/blogimg/shaonian1.png)

9、其他问题：

9.1、NameNode界面: 浏览器查看hadoop:50070

9.2、Map/Reduce界面: 浏览器查看hadoop:50030

9.3、多次格式化hadoop错误？

解决方法：删除/usr/local/hadoop/tmp文件夹，重新格式化

9.4解决```$HADOOP_HOME is deprecated```的warning

方法：令$HADOOP_HOME_WARN_SUPPRESS=0

至此，hadoop的伪分布式搭建完毕，后续带来完全分布式的集群搭建。

10、EXT扩展Vmware的三种网络方式

```
Vmnet0 桥接
Vmnet1 主机模式
Vmnet8 NAT模式
```

10.1 桥接模式Vmnet0

什么是桥接模式？桥接模式就是将主机网卡与虚拟机虚拟的网卡利用虚拟网桥进行通信。在桥接的作用下，类似于把物理主机虚拟为一个交换机，所有桥接设置的虚拟机连接到这个交换机的一个接口上，物理主机也同样插在这个交换机当中，所以所有桥接下的网卡与网卡都是交换模式的，相互可以访问而不干扰。在桥接模式下，虚拟机ip地址需要与主机在同一个网段，如果需要联网，则网关与DNS需要与主机网卡一致。
适用： 桥接模式配置简单，但如果你的网络环境是ip资源很缺少或对ip管理比较严格的话，那桥接模式就不太适用了。

10.2 NAT地址转换模式（Vmnet8）

如果你的网络ip资源紧缺，但是你又希望你的虚拟机能够联网，这时候NAT模式是最好的选择。NAT模式借助虚拟NAT设备和虚拟DHCP服务器，使得虚拟机可以联网。

10.3 主机模式（VMnet1）

Host-Only模式其实就是NAT模式去除了虚拟NAT设备，然后使用VMware Network Adapter VMnet1虚拟网卡连接VMnet1虚拟交换机来与虚拟机通信的，Host-Only模式将虚拟机与外网隔开，使得虚拟机成为一个独立的系统，只与主机相互通讯。

<div align="center">
<img src="http://rann.cc/assets/img/qrcode-logo.png" width="340" height="400" />
</div>

> 本文系本人个人公众号「梦回少年」原创发布，扫一扫加关注。