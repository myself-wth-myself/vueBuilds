import request from "@/request/request.js";
import * as qs from "qs";
export function getTrusteeshipStatistics(query) {
  return request({
    url: "/workwechat/Mi/dash-bord/trusteeshipStatistics",
    method: "get",
    params: query,
  });
}
