import request from '../../utils/request'

let isSend = false; // 函数节流使用
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholderContent: '',
    listData: [],
    searchContent: '', //输入的input数据
    searchList: [],
    historyList: [], // 搜索历史记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getListData()
  },

  async getListData() {
    const placeholder = await request('/search/default');
    if (placeholder.code === 200) {
      this.setData({
        placeholderContent: placeholder.data.showKeyword
      })
    }

    const listData = await request('/search/hot/detail')
    if (listData.code === 200) {
      this.setData({
        listData: listData.data
      })
    }
  },

  handleInputChange(event) {
    this.setData({
      searchContent: event.detail.value.trim()
    })

    if (isSend) {
      return
    }
    isSend = true;
    this.getSearchList();
    // 函数节流
    setTimeout(() => {
      isSend = false;
    }, 300)
  },

  async getSearchList() {
    const {
      searchContent,
      historyList
    } = this.data;
    if (!searchContent) {
      this.setData({
        searchList: []
      })
      return;
    }
    const searchListData = await request('/search', {
      keywords: searchContent,
      limit: 10
    });
    this.setData({
      searchList: searchListData.result.songs
    })

    // 将搜索的关键字添加到搜索历史记录中
    if (historyList.indexOf(searchContent) !== -1) {
      historyList.splice(historyList.indexOf(searchContent), 1)
    }
    historyList.unshift(searchContent);
    this.setData({
      historyList
    })

    wx.setStorageSync('searchHistory', historyList)
  },

  clearSearchContent() {
    this.setData({
      searchContent: '',
      searchList: []
    })
  },

  // 删除搜索历史记录
  deleteSearchHistory() {
    wx.showModal({
      content: '确认删除吗?',
      success: (res) => {
        if (res.confirm) {
          // 清空data中historyList
          this.setData({
            historyList: []
          })
          // 移除本地的历史记录缓存
          wx.removeStorageSync('searchHistory');
        }
      }
    })
  },

  //返回播放页
  handleToVideo(){
    wx.switchTab({
      url: '/pages/video/video',
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