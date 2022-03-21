import Vue from "vue";
import VueRouter from "vue-router";
const index = () =>
  import(/* webpackChunkName: "page" */ "@/views/index/index");

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: index,
  },
  {
    path: "/index",
    component: index,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
