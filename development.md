## Centos 环境安装

-   [mongodb](https://www.cnblogs.com/liuge36/p/9882879.html)
-   [端口开放](https://blog.csdn.net/qq_24232123/article/details/79781527)

## mongodb

### 服务启动

```bash
/data/mongodb-3.2/bin/mongod -f --config /data/mongodb-3.2/mongodb.conf
```

### 创建用户

```bash
   db.createUser( { user: "giscafer", pwd: "laohoubin", roles: [ { role: "userAdminAnyDatabase", db: "sailor" } ] } )
```

### kill 掉 mongo 进程

```bash
ps -ef | grep mongod
sudo kill -9 {processid}
```
