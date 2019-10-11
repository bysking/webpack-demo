import { getBrowserState } from './enum' // 根据环境来选择存储永久数据的方式

const Keys = { // 字典对应的数据key
  TOKEN: 'token',
  USER_INFO: 'userInfo',
  PROVINCES: 'provinces',
  ENV: 'env'
}

let datas = {} // 数据字典

async function init () {
  return await new Promise((resolve, reject) => {
    setTimeout(() => {
      for (const i in Keys) {
        getData(Keys[i])
      }
      // util.log('astore datas init----', datas) // 打印方法待补充
      resolve()
    }, 500)
  })
}

// 从已经存储的数据域里面获取数据
function getData (key) {
  let data = datas[key] || null
  if (getBrowserState()) { // 浏览器
    data = localStorage.getItem(key)
  } else { // 手机端
    data = api.getPrefs({ // 调用api接口
      sync: true,
      key: key
    })
  }
  // 数据获取后需要parse转化
  try {
    const parseData = JSON.parse(data) // 反序列化
    return parseData
  } catch (err) {
    console.log(err)
  }
  return data
}

function setData (key, data) {
  if (arguments.length !== 2) return // 参数合法性检查

  // 把数据加到数据字典中再存本地
  datas[key] = data

  if (typeof data === 'object') { // 对象存储前需要序列化成字符串
    data = JSON.stringify(data)
  }

  // 开始存储 根据运行设备环境选择存储的方式

  if (getBrowserState()) {
    localStorage.setItem(key, data)
  } else {
    api.setPrefs({
      key: key,
      value: data
    })
  }
}

// 清除登录信息
function clearLoginData () {
  datas = {}
  // 根据环境选择从哪个位置清除数据
  if (getBrowserState()) {
    for (const i in Keys) {
      if (Keys[i] === 'provinces') continue // 城市数据不用移除，因为会经常用到，与用户无关
      console.log(Keys[i])
      localStorage.removeItem(Keys[i])
    }
  } else {
    for (const i in Keys) {
      if (Keys[i] === 'provinces') continue // 城市数据不用移除，因为会经常用到，与用户无关
      api.removePrefs({
        key: Keys[i]
      })
    }
  }
}

// 获取AccessToken
function getToken () {
  return getData(Keys.TOKEN)
}

// 获取用户信息
function getUserInfo () {
  return getData(Keys.USER_INFO)
}

// 获取环境信息
function getEnv () {
  return getData(Keys.ENV)
}

export default {
  Keys,
  init,
  setData,
  getData,
  getToken,
  getUserInfo,
  getEnv,
  clearLoginData
}
