import Vue from 'vue'

const vm = new Vue()
let toast

function baseToast (msg, mask = false, time = 1500, type = 'txt') { // 参数以及默认值
  toast = vm.$createToast({ // 基于使用vue的组件展示提示信息，封装
    type: type,
    txt: msg,
    mask: mask,
    time: time
  })
  toast.show()
}

/**
  * 显示toast
  * @param {String} msg 信息
  */
function showToast (msg) {
  baseToast(msg)
}
// 隐藏toast
function hideToast () {
  if (toast) {
    toast.hide()
  }
}
/**
  * 显示loading
  * @param {String} msg 信息
  */
function showLoading (msg = '加载中...') {
  baseToast(msg, true, 0, 'loading')
}

export default {
  showToast,
  showLoading,
  hideToast
}
