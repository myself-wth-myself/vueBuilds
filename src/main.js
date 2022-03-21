import Vue from "vue";
import App from "./App.vue";
import router from "./router";
// 引入适配模块
import "@/assets/css/reset.css";
import globalVantToastLoading from "./util/globalVantToastLoading";
window.$loading = new globalVantToastLoading();
Vue.config.productionTip = false;

// 引入Vant
import Vant from "vant";
import "vant/lib/index.css";

Vue.use(Vant);
new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
