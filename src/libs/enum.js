export const isBrowser = false
let _isBrowser = false

/**
 * get set 函数用来设置全局标识：浏览器和手机端的区别
 * @param {*} (true: PC, false: 移动端)
 */
export function setBrowserState (state) {
  _isBrowser = state
}

export function getBrowserState () {
  return _isBrowser
}
