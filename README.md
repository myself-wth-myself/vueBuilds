# 前端vue2.0多环境打包

###### 一、package.json中自定义变量实参

###### 二、在项目工程中配置config文件夹中创建一个index.js管理所有的多环境配置

###### 三、vue.config.js通过node的fs.writeFileSync写入文件

###### 四、用法演示

###### 一、package.json中自定义变量实参

1. 在script的命令的键值后缀添加“--实参”；“--实参”在我们项目中serve或者build执行的时候，都会在process.argv中找到我们定义的实参值;比如以下例子：
   1.1我们在package.json中找到script这个位置。我加入了"serve:cs"的键名，"vue-cli-service serve --cs"的键值。然后我们在vue.config.js中打印process.argv

   ```javascript
     "scripts": {
       "serve": "vue-cli-service serve",
       "serve:cs": "vue-cli-service serve --cs"
     },
   ```

   1.2vue.config.js中打印process.argv的代码例子：

   ```javascript
   //打印的process.argv位置  start
   console.log('process.argv',process.argv)
   //打印的process.argv位置  end
   //感兴趣的可以自己研究一下process这个大对象
   ```

   1.3我们在项目根目录中输入npm run serve:cs；回车跑起来项目;然后仔细观察控制台

```javascript
process.argv [
  'D:\\nodejs\\node.exe',
  'D:\\Users\\ww\\Desktop\\myself\\vueBuilds.git\\node_modules\\_@vue_cli-service@4.5.16@@vue\\cli-service\\bin\\vue-cli-service.js',
  'serve',
  '--cs'
]
```

![image-20220321132813356](C:\Users\ww\AppData\Roaming\Typora\typora-user-images\image-20220321132813356.png)

我们会发现"--cs"；通过process.argv[3]可以拿得到了;"--cs"在当前的最后一项；其实我们只要在package.json的script中的键的值，里面通过"--实参"的格式形式都可以拿到，这里目前我只知道"--实参"的格式形式，可以在项目跑起来的时候拿到，其他方式，目前没有去研究过

###### 二、在项目工程中配置config文件夹中创建一个index.js管理所有的多环境配置

​	 2.1在项目中创建config文件夹并创建index.js。RECORDNO.js可以忽略不用管（这个文件会在我们执行不一样的命令，会动态生成我们需要的打包的配置信息）
![image-20220321135608982](C:\Users\ww\AppData\Roaming\Typora\typora-user-images\image-20220321135608982.png)

2.2在config的文件夹下的index.js中粘贴以下代码

```javascript
const setProcessEnv = (env) => {
  let BASE_PROTOCOL = "http://"; //https或者http
  let BASE_IP = ""; //就是我们要访问的ip地址
  let BASE_PORT = "80"; //访问ip地址的端口号
  let BASE_APP_NAME = "intensiveKanban"; //打包后的文件夹的名字
  let BASE_URL = ""; //完整的访问地址
  let BASE_API_URL = ""; //后端是否在nginx配置有/api或者其他的路径地址。
  let BASE_PUBLIC_PATH = ""; //后端部署我们build出来之后的文件夹包，存放的文件夹位置路径
  let BASE_WEB_SOCKET_URL = ""; //websocket的路径
  let RECORDNO = ""; //商标名字
  let BASE_IP_PATH = ""; //备用变量
  switch (env) {
    case "cs":
      BASE_IP = "192.168.0.206";
      BASE_PORT = "9999";
      BASE_WEB_SOCKET_URL =
        "ws://" +
        BASE_IP +
        ":" +
        BASE_IP_PATH +
        BASE_PORT +
        "/workwechat/ws/scrm";
      BASE_PUBLIC_PATH = BASE_IP_PATH + "/" + BASE_APP_NAME + "/";
      BASE_URL = BASE_PROTOCOL + BASE_IP + BASE_IP_PATH + ":" + BASE_PORT;
      break;
  }

  return {
    BASE_PUBLIC_PATH,
    BASE_API_URL,
    BASE_IP,
    BASE_PORT,
    BASE_APP_NAME,
    BASE_WEB_SOCKET_URL,
    BASE_URL,
    BASE_PROTOCOL,
    RECORDNO,
    BASE_IP_PATH,
  };
};

module.exports = {
  setProcessEnv: setProcessEnv,
};

```

在上图的代码中我们只要关注case的条件判断即可。即我们每次要添加不一样的打包或者启动命令都需要在里面进行配置对应的协议，域名，端口号等。在需要连不一样的地址，就写多一个case即可。case的值就是我们package的script里面配置"--实参的值"（不带--）。

###### 三、vue.config.js通过node的fs.writeFileSync写入文件

3.1在我们的根目录创建vue.config.js文件。并粘贴以下代码|

```javascript
const path = require("path");
const fs = require("fs");
const { setProcessEnv } = require("./src/config/index");//导入我们写的配置多环境的js文件
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
// 项目部署基础
const BUILD_BASE_URL = process.argv[3].slice(2);
const isBuild = process.argv[2] === "build";

//打印的process.argv位置  start
console.log("process.argv", process.argv);
//打印的process.argv位置  end

// ============fs.writeFileSync   start============
const {
  RECORDNO = "",
  BASE_IP = "",
  BASE_URL = "",
  BASE_WEB_SOCKET_URL = "",
  BASE_PORT = "",
  BASE_API_URL = "",
  BASE_PROTOCOL = "",
  BASE_PUBLIC_PATH,
  BASE_APP_NAME,
  BASE_IP_PATH,
} = setProcessEnv(BUILD_BASE_URL);
const tmpUrl = BASE_URL;
console.log("上线的接口地址：", tmpUrl);
const fileContent = `const RECORDNO='${RECORDNO}'
 const BASE_IP='${BASE_IP}'
 const BASE_WEB_SOCKET_URL='${BASE_WEB_SOCKET_URL}'
 const BASE_PORT='${BASE_PORT}'
 const BASE_API_URL='${BASE_API_URL}'
 const BASE_URL='${tmpUrl}'
 const BASE_PUBLIC_PATH='${BASE_PUBLIC_PATH}'
 const BASE_PROTOCOL='${BASE_PROTOCOL}'
 const BASE_APP_NAME='${BASE_APP_NAME}'
 const BASE_IP_PATH='${BASE_IP_PATH}'
 const isLocalhost=${!isBuild}
 export {
   RECORDNO,
   BASE_IP,
   BASE_WEB_SOCKET_URL,
   BASE_PORT,
   BASE_API_URL,
   BASE_URL,
   BASE_PROTOCOL,
   BASE_PUBLIC_PATH,
   BASE_APP_NAME,
   BASE_IP_PATH,
   isLocalhost,
 }`;
const filePath = path.join(__dirname, "/src/config/RECORDNO.js");
try {
  fs.writeFileSync(filePath, fileContent);
} catch (err) {
  fs.writeFileSync(filePath, fileContent);
}
// ============fs.writeFileSync   end============

const setChainWebpackConfig = (config) => {
  if (!isBuild) return;
  // ============打包分析图   start============
  // config
  //   .plugin('webpack-bundle-analyzer')
  //   .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
  // ============打包分析图   end============
  // ============cdn 加载  start============
  config.plugin("html").tap((args) => {
    args[0].BASE_URL = BASE_PROTOCOL + BASE_IP + BASE_PUBLIC_PATH;
    console.log(
      "上线的静态访问路径地址：",
      BASE_PROTOCOL + BASE_IP + BASE_PUBLIC_PATH
    );
    console.log("上线的静态访文件的前缀：", BASE_PUBLIC_PATH);
    return args;
  });
  // ============cdn 加载  end============
  // ============压缩图片 start============
  //  config.module
  //    .rule('images')
  //    .test(/\.(gif|png|jpe?g|svg)$/i)
  //    .use('image-webpack-loader')
  //    .loader('image-webpack-loader')
  //    .options({
  //      bypassOnDebug: true
  //    })
  //    .end()
  // ============压缩图片 end============

  // config.module.push({
  //   test: /\.s[ac]ss$/i,
  //   use: [
  //     "style-loader",
  //     "css-loader",
  //     {
  //       loader: "sass-loader",
  //       options: {
  //         implementation: require("sass"),
  //         sassOptions: {
  //           fiber: false,
  //         },
  //       },
  //     },
  //   ],
  // });
  // 移除 prefetch 插件
  config.plugins.delete("prefetch");
  // 移除 preload 插件
  config.plugins.delete("preload");
};
const setConfigureWebpack = (config) => {
  if (isBuild) {
    // ============ 抽离公共代码  start============
    config.optimization = {
      splitChunks: {
        cacheGroups: {
          // vendor: {
          //   chunks: 'all',
          //   test: /node_modules/,
          //   name: 'vendor',
          //   minChunks: 1,
          //   maxInitialRequests: 5,
          //   minSize: 0,
          //   priority: 100
          // },
          common: {
            chunks: "all",
            test: /[\\/]src[\\/]js[\\/]/,
            name: "common",
            minChunks: 2,
            maxInitialRequests: 5,
            minSize: 0,
            priority: 60,
          },
          styles: {
            name: "styles",
            test: /\.(sa|sc|c)ss$/,
            chunks: "all",
            enforce: true,
          },
          runtimeChunk: {
            name: "main",
          },
        },
      },
    };

    // ============ 抽离公共代码  end============
    // ============ 代码压缩  start============
    config.plugins.push(
      new UglifyJsPlugin({
        uglifyOptions: {
          // 生产环境自动删除console
          // compress: {
          //   drop_debugger: true,
          //   drop_console: true,
          //   pure_funcs: ['console.log']
          // }
        },
        sourceMap: false,
        parallel: true,
      })
    );
    // ============ 代码压缩  end============
    // ============gzip压缩  start============
    const productionGzipExtensions = ["html", "js", "css"];
    config.plugins.push(
      new CompressionPlugin({
        filename: "[path][base].gz[query]",
        algorithm: "gzip",
        test: new RegExp("\\.(" + productionGzipExtensions.join("|") + ")$"),
        threshold: 10240, // 只有大小大于该值的资源会被处理 10240
        minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
        deleteOriginalAssets: false, // 删除原文件
      })
    );
    // ============gzip压缩  end============
  }
};
module.exports = {
  publicPath: BASE_PUBLIC_PATH,
  outputDir: BASE_APP_NAME,//打包的文件夹的名字
  productionSourceMap: false,

  chainWebpack: (config) => {
    // 忽略的打包文件
    const entry = config.entry("app");
    entry.add("babel-polyfill").end();
    entry.add("classlist-polyfill").end();
    setChainWebpackConfig(config);
  },

  configureWebpack: (config) => {
    // console.log("configureWebpack", config);
    setConfigureWebpack(config);
  },
  // 本地开发环境配置
  // 反向代理的配置  start
  devServer: {
    open: true,
    disableHostCheck: true,
    port: BASE_PORT,
    overlay: {
      errors: !isBuild,
    },
    // port: 9999,
    // 转发代理
    proxy: {
      "/api": {
        target: tmpUrl,
        // changeOrigin: true,
        ws: true,
        pathRewrite: {
          "^/api": "",
        },
      },
    },
  },
  // 反向代理的配置  end
  css: {
    // 全局配置utils.scss,详细配置参考vue-cli官网
    loaderOptions: {
      sass: {
        prependData: '@import "@/assets/styles/utils.scss";',
      },
    },
  },
};
```

3.2引入我们写的配置多环境的文件 const { setProcessEnv } = require("./src/config/index");
3.3通过process.argv获取到我们在package.json中的script配置的实参值，然后去掉以下"--"；通过我们写的多环境的配置文件中的setProcessEnv 函数调用；得到对应协议，端口，域名等信息。然后fs.writeFileSync写入一个RECORDNO.js文件。整个项目到时候用到域名，端口，协议等信息，都引入这个文件即可

```
const BUILD_BASE_URL = process.argv[3].slice(2);
const isBuild = process.argv[2] === "build";

//打印的process.argv位置  start
console.log("process.argv", process.argv);
//打印的process.argv位置  end

// ============fs.writeFileSync   start============
const {
  RECORDNO = "",
  BASE_IP = "",
  BASE_URL = "",
  BASE_WEB_SOCKET_URL = "",
  BASE_PORT = "",
  BASE_API_URL = "",
  BASE_PROTOCOL = "",
  BASE_PUBLIC_PATH,
  BASE_APP_NAME,
  BASE_IP_PATH,
} = setProcessEnv(BUILD_BASE_URL);
const tmpUrl = BASE_URL;
console.log("上线的接口地址：", tmpUrl);
const fileContent = `const RECORDNO='${RECORDNO}'
 const BASE_IP='${BASE_IP}'
 const BASE_WEB_SOCKET_URL='${BASE_WEB_SOCKET_URL}'
 const BASE_PORT='${BASE_PORT}'
 const BASE_API_URL='${BASE_API_URL}'
 const BASE_URL='${tmpUrl}'
 const BASE_PUBLIC_PATH='${BASE_PUBLIC_PATH}'
 const BASE_PROTOCOL='${BASE_PROTOCOL}'
 const BASE_APP_NAME='${BASE_APP_NAME}'
 const BASE_IP_PATH='${BASE_IP_PATH}'
 const isLocalhost=${!isBuild}
 export {
   RECORDNO,
   BASE_IP,
   BASE_WEB_SOCKET_URL,
   BASE_PORT,
   BASE_API_URL,
   BASE_URL,
   BASE_PROTOCOL,
   BASE_PUBLIC_PATH,
   BASE_APP_NAME,
   BASE_IP_PATH,
   isLocalhost,
 }`;
const filePath = path.join(__dirname, "/src/config/RECORDNO.js");
try {
  fs.writeFileSync(filePath, fileContent);
} catch (err) {
  fs.writeFileSync(filePath, fileContent);
}
// ============fs.writeFileSync   end============
```

3.4在vue.config.js中配置反向代理，项目跑起来的端口号

```
  // 反向代理的配置  start
  devServer: {
    open: true,
    disableHostCheck: true,
    port: BASE_PORT,//端口号
    overlay: {
      errors: !isBuild,
    },
    // 转发代理
    proxy: {
      "/api": {
        target: tmpUrl,//反向代理的url（就是我们要访问后端接口那个完整的地址）
        // changeOrigin: true,
        ws: true,
        pathRewrite: {
          "^/api": "",
        },
      },
    },
  },
  // 反向代理的配置  end
```

3.5在vue.config.js中配置打包后的文件夹的名字，后端存放我们通过build命令之后的文件存放的针对于服务器的路径地址

```
 publicPath: BASE_PUBLIC_PATH,//后端存放我们通过build命令之后的文件存放的针对于服务器的路径地址
 outputDir: BASE_APP_NAME,//打包的文件夹的名字
```

###### 四、用法演示

4.1后端的服务器接口前缀地址：http://192.168.4.206:8888;  测试接口：/workwechat/Mi/dash-bord/trusteeshipStatistics
步骤1：在package.json的script中起一个"serve:test"的键名，其值为："vue-cli-service serve --test"

步骤2：config文件夹中的index.js的setProcessEnv函数的switch中添加一个条件case "test"。把里面的域名，地址端口等改成对应需要的即可；比如我复制了一份case "cs"的代码，把里面的case "cs"改为case "test"；把"192.168.0.206"改为"192.168.4.206"；把"9999"改为"8888"。代码如下：

```
   case "test":
      BASE_IP = "192.168.4.206";
      BASE_PORT = "8888";
      BASE_WEB_SOCKET_URL =
        "ws://" +
        BASE_IP +
        ":" +
        BASE_IP_PATH +
        BASE_PORT +
        "/workwechat/ws/scrm";
      BASE_PUBLIC_PATH = BASE_IP_PATH + "/" + BASE_APP_NAME + "/";
      BASE_URL = BASE_PROTOCOL + BASE_IP + BASE_IP_PATH + ":" + BASE_PORT;
      break;
```

步骤3：在根目录执行 npm run serve:test即可执行我们刚刚配置好的环境
![image-20220321145303705](C:\Users\ww\AppData\Roaming\Typora\typora-user-images\image-20220321145303705.png)

f12控制打开，找到network
点击test环境的测试按钮。我们就看到请求的地址变成了我们之前配置的
![image-20220321145503062](C:\Users\ww\AppData\Roaming\Typora\typora-user-images\image-20220321145503062.png)

针对于为何不采取网上.env文件的方式去配置。是因为目前我觉得不太使用于目前我的需求。因为针对于不同的.env配置，里面的文件就会一直增加，导致根目录里面会出现很多.env的文件。

