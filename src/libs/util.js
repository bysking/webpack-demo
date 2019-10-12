/**
 * 是否为字符串
 * @param {Object} value
 */
function isString (value) {
  return value === value + ''
}

export default {
  isString
}
