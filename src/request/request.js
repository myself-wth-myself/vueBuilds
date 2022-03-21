/*
 * @Author: wth
 * @Date: 2021-10-26 11:13:02
 * @LastEditors: wth
 * @LastEditTime: 2021-10-26 14:08:21
 * @Description: file content
 * @FilePath: \wxmao-scrm-qrpage-h5\src\request\request.js
 */
import axios from "axios";
import { Toast } from "vant";

// 同时多个请求完成时关闭loading
// 创建axios实例
import { BASE_URL } from "@/config/RECORDNO";

// 同时多个请求完成时关闭loading
let loadingCount = 0;
// 创建axios实例
let instance = axios.create({
  baseURL: BASE_URL,
  timeout: 6000,
});
// axios实例instance1请求拦截器
instance.interceptors.request.use(
  (config) => {
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);
// axios实例instance1响应拦截器
instance.interceptors.response.use(
  (res) => {
    // 将有用的数据返回
    return res.data;
  },
  ({ config, response: res }) => {
    console.log("err", config);
    if (res) {
      let { msg } = res.data;
      Toast(msg);
    }
    console.log("response", res);
  }
);
let request = function (params) {
  // 最终参数
  let { isShowLoading = true, isShowToast = true } = params;
  return new Promise((resolve, reject) => {
    if (isShowLoading) {
      loadingCount++;
      Toast({
        type: "loading",
        forbidClick: true,
        duration: 0,
      });
    }
    instance({
      ...params,
    }).then(
      (data) => {
        if (isShowLoading) {
          loadingCount--;
          if (loadingCount <= 0) {
            loadingCount = 0;
            Toast.clear();
          }
        }
        resolve(data);
      },
      (err) => {
        if (isShowLoading) {
          loadingCount--;
          if (loadingCount <= 0) {
            loadingCount = 0;
            Toast.clear();
          }
        }
        if (isShowToast) {
          Toast("网络出错，请刷新重试！");
        }
        reject(err);
      }
    );
  });
};
export default request;
