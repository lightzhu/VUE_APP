# VUE_APP
Vue 手机项目，结合mui可打包app
# Node开发版本
* v8.10.0

# 开发阶段要将webpack的开发配置文件的代理改掉

# mui不能直接通过npm安装
* 解决:将mui压缩包解压到node_modules下

# 关于underscore报错的问题
* 再_的源码中增加了方法，解决插件本身排序出错的问题
* 在源码underscore.js中加上
>  _.compare=function(propertyName, order) {
    return function (object1, object2) {
      var value1 = parseFloat(object1[propertyName]);
      var value2 = parseFloat(object2[propertyName]);
      switch (order) {
        case "asc":
          return value1 - value2;
          break;
        case "desc":
          if (value2 < value1) {
            return -1;
          } else if (value2 > value1) {
            return 1;
          } else {
            return 0;
          }
          break;
      }
    }
  };
# 视屏演示
[https://cdn.jsdelivr.net/gh/lightzhu/public_cdn@0.2/video/anji-app.mp4]
# web演示地址
* 用户名和密码随意
[http://appdemo-light.1d35.starter-us-east-1.openshiftapps.com]
