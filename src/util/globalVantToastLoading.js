import { Toast } from 'vant'

export default class globalVantToastLoading {
  constructor(message="加载中", forbidClick= true) {
    this.message = message
    this.forbidClick = forbidClick
    Toast.setDefaultOptions( { duration: 3000 }) //全局的Toast设置
  }
  open(message,forbidClick) {
    Toast.loading({
      message: message||this.message,
      forbidClick: forbidClick||this.forbidClick ,
      duration:0
    })
  }
  close() {
    Toast.clear()
  }
}
