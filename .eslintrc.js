module.exports = {
  root: true,

  env: {
    node: true
  },

  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    "plugin:vue/essential",
    "eslint:recommended"
  ],
  plugins: ['vue'],
  rules: {
    'vue/v-bind-style': 1,
    'no-irregular-whitespace': 1,
    'vue/v-on-style': 1,
    'vue/return-in-computed-property': 0,
    'vue/no-unused-vars': 0,//警告：标签内部的插槽声明了抛出来的变量，未使用
    'vue/camelcase': 2,
    'vue/eqeqeq': 2,
    'vue/no-static-inline-styles': 1,//警告：标签内部不允许写style样式
    'eqeqeq':2,//报错：必须===或者!==
    'no-undef':1,//警告：定义的变量，未使用
    'no-unused-vars':1,//警告：定义的变量，未使用===>函数形参
    'no-var':2,//报错：只允许使用let，const。var声明报错
    'no-empty':1,//警告：不明空格出现警告
    'no-case-declarations':0,//关闭：case不出现变量声明
    'no-self-assign':0,//关闭
    'no-useless-escape':1,//警告
  }
};
