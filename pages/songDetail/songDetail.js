import PubSub from 'pubsub-js';
import moment from 'moment';
import request from '../../utils/request'

const appInstance = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false,
    songInfo: {}, // 歌曲详情对象
    musicId: '', // 音乐id
    musicLink: '',
    currentTime: '00:00',  // 实时时间
    durationTime: '00:00', // 总时长
    currentWidth: 0, // 实时进度条的宽度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const musicId = options.musicId
    this.setData({
      musicId,
    })
    console.log('musicId', musicId)

    if (appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === musicId) {
      console.log('appInstance.globalData', appInstance.globalData)
      this.setData({
        isPlay: true
      })
    }

    this.getMusicInfo(musicId)
  },

  async getMusicInfo(musicId) {
    let songData = await request('/song/detail', {
      ids: musicId
    });
    if (songData.code === 200) {
      const durationTime = moment(songData.songs[0].dt).format('mm:ss')
      this.setData({
        songInfo: songData.songs[0],
        durationTime
      })
      wx.setNavigationBarTitle({
        title: this.data.songInfo.name
      })
    }

    // 创建控制音乐播放的实例
    this.backgroundAudioManager = wx.getBackgroundAudioManager();

    this.backgroundAudioManager.onPlay(() => {
      this.changePlayState(true);
      // 修改全局音乐播放的状态
      appInstance.globalData.musicId = musicId;
    });
    this.backgroundAudioManager.onPause(() => {
      this.changePlayState(false);
    });
    this.backgroundAudioManager.onStop(() => {
      this.changePlayState(false);
    });

    this.backgroundAudioManager.onTimeUpdate(() => {
      let currentTime = this.backgroundAudioManager.currentTime;
      this.setData({
        currentTime: moment(currentTime * 1000).format('mm:ss'),
        currentWidth: currentTime / this.backgroundAudioManager.duration * 450
      })
    })

    this.backgroundAudioManager.onEnded(() => {
      //切换下一首
      PubSub.publish('switchType', type)
      // 将实进度条宽带和时时间还原为0
      this.setData({
        currentTime: "00:00",
        currentWidth: 0
      })
    })
  },

  changePlayState(isPlay) {
    // 修改音乐是否的状态
    this.setData({
      isPlay
    })

    appInstance.globalData.isMusicPlay = isPlay;
  },

  handleMusicPlay() {
    let isPlay = !this.data.isPlay;
    this.setData({
      isPlay
    })
    let {
      musicId,
      musicLink
    } = this.data;
    this.musicControl(isPlay, musicId, musicLink)
  },

  async musicControl(isPlay, musicId, musicLink) {
    if (isPlay) {
      if(!musicLink){
        // 获取音乐播放链接
        let musicLinkData = await request('/song/url', {id: musicId});
        musicLink = musicLinkData.data[0].url;
        
        this.setData({
          musicLink
        })
      }
      this.backgroundAudioManager.src = musicLink;
      this.backgroundAudioManager.title = this.data.songInfo.name;
    } else {
      this.backgroundAudioManager.pause();
    }
  },

  handleSwitch(evnet) {
    const type = evnet.currentTarget.id;

    // 关闭当前播放的音乐
    this.backgroundAudioManager.stop();
    // // 订阅来自recommendSong页面发布的musicId消息
    PubSub.subscribe('musicId', (msg, musicId) => {

      // 获取音乐详情信息
      this.getMusicInfo(musicId);
      // 自动播放当前的音乐
      this.musicControl(true, musicId);
      // 取消订阅
      PubSub.unsubscribe('musicId');
    })
    // 发布消息数据给recommendSong页面
    PubSub.publish('switchType', type)
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