import request from '../../utils/request'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg: '单项数据绑定',
    userInfo: {},
    exampleInfo: {
      name: 'wechat',
      age: 26
    }
  },

  //页面跳转
  handleClick(e) {
    // wx.redirectTo({
    //   url: '/pages/home/home',
    // })
    wx.login({
      success: async (res) => {
        console.log(res)
        const result = await request('/getOpenId', {code: res.code})
        console.log(';result', result) //token jwt
      }
    })
  },

  // 弹窗，获取用户信息
  getUserProfile() {
    wx.getUserProfile({
      desc: '123123123',
      success: (res) => {
        this.setData({
          userInfo: res.userInfo, 
        })
        //将用户信息存储在storage里
        wx.setStorageSync('userInfo', res.userInfo)
      },
      fail: (e) => {
        console.log('error', e)
      }
    })
  },

  //获取用户存储信息
  getStorageUserInfo() {
    try{
      const userInfo = wx.getStorageSync('userInfo')
      if(userInfo) {
        this.setData({
          userInfo
        })
      }
    } catch(err) {
      console.log('获取用户存储信息失败', err)
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      msg: '改变后的数据'
    })
    this.getStorageUserInfo()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示 会执行多次
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})