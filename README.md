dwui cli 

# 使用说明
- 全局安装
> npm install -g dwui-cli

- 创建工程

> dwui create

- 基于dwui-cli 扩展自己的cli

> 原理：dwui-cli 实际是通过命令行的方式从github下下载已定义的模板项目
然后对项目名称进行更改，所以原理十分简单。要定制自己的cli，只需要更改config目录下的
cli-config.json 文件，将配置项修改为自己的npm cli 路径和自己的模板配置文件地址

```
{
  "npmCliUrl": "https://registry.npmjs.org/dwui-cli",
  "templateListInfoUrl": "https://sunshineshenjin.github.io/dwui-rep/dwui-cli-templates.json"
}
```
> 参数说明： npmCliUrl: 是指当前cli发布到npm上的路径，使用cli时会检测版本号
            templateListInfoUrl: 模板文件信息

- 参考说明
 主要fork : https://www.npmjs.com/package/asuna-cli 及其文章，感谢
 部分参考： https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli
 
 其实 vue-cli和我们这种实现是不同的，它的逻辑复杂的多，包括使用命令行插件执行 npm install 工作，我们这种简单直接。
 
 - github
 https://github.com/sunshineshenjin/dwui-cli