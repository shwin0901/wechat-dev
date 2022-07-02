import request from '../../utils/request'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [],
    recommendList: [],
    topList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getBannerList()
    this.getRecommendList()
    this.getTopList()
  },

  getBannerList: async function () {
    const bannerDatalist = await request('/banner', {
      type: 2
    })
    if (bannerDatalist && bannerDatalist.data.code === 200) {
      this.setData({
        bannerList: bannerDatalist.data.banners
      })
    }
  },

  getRecommendList: async function () {
    const recommendListData = await request('/personalized', {
      limit: 10
    })
    if (recommendListData && recommendListData.data.code === 200) {
      this.setData({
        recommendList: recommendListData.data.result
      })
    }
  },

  getTopList: async function () {
    let index = 0;
    const resultArr = [];
    while (index < 5) {
      let topListData = await request('/top/list', {
        idx: index++
      });
      console.log("topListData", topListData)
      // splice(会修改原数组，可以对指定的数组进行增删改) slice(不会修改原数组)
      let topListItem = {
        name: topListData.data.playlist.name,
        tracks: topListData.data.playlist.tracks.slice(0, 3)
      };
      resultArr.push(topListItem);
      // 不需要等待五次请求全部结束才更新，用户体验较好，但是渲染次数会多一些
      
      this.setData({
        topList: resultArr
      })
    }
    console.log(this.topList)
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