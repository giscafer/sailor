# sailor admin 模板

基于 [sailor](https://github.com/giscafer/sailor)，快速搭建自己的管理系统。

## 快速开始

其实这个项目直接双击 `index.html` 都能看大部分效果，不过为了更完整体验，请运行下面的命令：

```bash

# 安装依赖
npm i
# 打开服务 localhost:3200
npm start
```

## 使用说明

#### 1. `pages` 下有 `sites.json` 是菜单目录导航

格式如下：

```json
{
  "status": 0,
  "msg": "",
  "data": {
    "pages": [
      {
        "label": "Home",
        "url": "/",
        "redirect": "/index/1"
      },
      {
        "label": "列表示例",
        "url": "/crud",
        "rewrite": "/crud/list",
        "icon": "fa fa-cube",
        "children": [
          {
            "label": "列表",
            "url": "/crud/list",
            "icon": "fa fa-list",
            "schemaApi": "get:/pages/crud-list.json"
          },
          {
            "label": "新增",
            "url": "/crud/new",
            "icon": "fa fa-plus",
            "schemaApi": "get:/pages/crud-new.json"
          },
          {
            "label": "查看",
            "url": "/crud/:id",
            "schemaApi": "get:/pages/crud-view.json"
          },
          {
            "label": "修改",
            "url": "/crud/:id/edit",
            "schemaApi": "get:/pages/crud-edit.json"
          }
        ]
      },
      {
        "label": "分组2",
        "children": [
          {
            "label": "用户管理",
            "schema": {
              "type": "page",
              "title": "用户管理",
              "body": "页面C"
            }
          },
          {
            "label": "外部链接",
            "link": "http://github.com/giscafer/sailor"
          }
        ]
      }
    ]
  }
}
```

#### 2. `pages` 目录下放页面 json 文件

由第一部的格式了解到，其中 `schemaApi` 是动态获取页面 schema 内容渲染。

```json
{
  "schemaApi": "get:/pages/crud-list.json"
}
```
