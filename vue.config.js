/*
 * @Author: wth
 * @Date: 2021-09-09 09:14:04
 * @LastEditors: wth
 * @LastEditTime: 2021-10-26 15:28:19
 * @Description: file content
 * @FilePath: \wxmao-scrm-qrpage-h5\vue.config.js
 */
const path = require("path");
const fs = require("fs");
const { setProcessEnv } = require("./src/config/index");
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
  publicPath: BASE_PUBLIC_PATH,//后端存放我们通过build命令之后的文件存放的针对于服务器的路径地址
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
