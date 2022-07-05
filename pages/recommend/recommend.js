import request from '../../utils/request'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    day: new Date().getDate(),
    month: new Date().getMonth() + 1,
    recommendList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) {
      wx.showToast({
        title: '请登录',
        icon: "none",
        success: () => {
          wx.reLaunch({
            url: '/pages/login/login',
          })
        }
      })
    }

    this.getRecommendList()
  },

  async getRecommendList() {
    const result = await request('/recommend/songs')
    if (result.code === 200) {
      this.setData({
        recommendList: result.data.dailySongs
      })
    }
  },

  toSongDetail(event) {
    const musicId = event.currentTarget.dataset.musicid
    console.log('musicId', musicId)
    wx.navigateTo({
      url: '/pages/songDetail/songDetail?musicId=' + musicId,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})