
<template>
  <div id="">
    <h1>多环境打包配置</h1>
    <van-button type="primary" @click="textSend">ce环境的测试按钮</van-button>
    <van-button type="danger" @click="textSend">test环境的测试按钮</van-button>
  </div>
</template>

<script>
import { getTrusteeshipStatistics } from "@/request/apis.js";
const components = {};
export default {
  data() {
    return {};
  },

  methods: {
    //测试接口地址
    async textSend() {
      try {
        await getTrusteeshipStatistics();
      } catch (error) {}
    },
  },

  computed: {},

  watch: {},

  created() {},

  mounted() {},

  components: { ...components },
};
</script>
<style lang='scss' scoped>
</style>