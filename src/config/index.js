/*
 * @Author: wth
 * @Date: 2021-09-30 08:19:30
 * @LastEditors: wth
 * @LastEditTime: 2022-01-05 21:59:52
 * @Description: 打包/运行项目都会执行当前文件配置。可配置的为url，商标文字（RECORDNO.js根据当前文件的配置，动态写入内容）
 * @FilePath: \wxmao-scrm-ui\src\config\index.js
 */
// 配置编译环境和线上环境之间的切换
// const env = process.env
// noinspection HttpUrlsUsage

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
