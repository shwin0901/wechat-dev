const host = "http://127.0.0.1:3000"
const mobileHost = "http://test.vaiwan.cn"

export default (url, data = {}, method = "GET", isLogin) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: host + url,
      data,
      method,
      header: {
        cookie: wx.getStorageSync('cookies') ? wx.getStorageSync('cookies').find(item => item.indexOf('MUSIC_U') !== -1) : ''
      },
      success: (res) => {
        if (data.isLogin) {
          console.log("res....", res)
          wx.setStorageSync('cookies', res.cookies)
        }
        resolve(res.data)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}