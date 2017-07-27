const observer = require('../../libs/observer').observer;
import store from '../../stores/index';
let app = getApp();
Page(observer({
  data: {
    currentPlayers: [],
    checked: false
  },
  props: {
    store: app.globalData.store
  },
  onLoad: function () {
    // console.log(app)
    let store = wx.getStorageSync('store');

    if(store) {
      this.props.store.formStorageToStore(store);
    }
    
  },
  onShow: function () {
    this.props.store = app.globalData.store;
    
    // let store =this.props.store.currentStore;
    
  },
  onHide: function () {
    app.globalData.store = this.props.store;
    
    let store =this.props.store.currentStore;
    wx.setStorageSync('store', store)
  },
  setCurrentPlayers: function (e) {
    let currentPlayers = e.detail.value
    this.setData({
      currentPlayers
    })
  },
  addGame: function () {
    let len = this.data.currentPlayers.length;
    if (len === 2) {
      let [player1, player2] = this.data.currentPlayers;
      player1 = parseInt(player1, 10);
      player2 =parseInt(player2,10);
      // 新增比赛
      this.props.store.startNewGame(player1, player2);

      // 清除勾选
      this.setData({
        checked: false
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请选择两名玩家进行游戏',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }

  },
  addScore: function (e) {
    let player = e.currentTarget.dataset.whoget;
    this.props.store.addScore(player);
  },
  giveUpGame: function () {
    this.props.store.giveUpGame();
  },
  addPlayer: function () {
    // console.log(1)
    // 跳转到成员页
    wx.navigateTo({
      url: '../players/players',
      success: function (res) {
        // success
        console.log(res);
      },
      fail: function (res) {
        // fail
        console.log(res);
      },
      complete: function (res) {
        // complete
        console.log(res);
      }
    })
  },
  gameHistory: function () {
    // console.log(1)
    // 跳转到成员页
    wx.navigateTo({
      url: '../games/games',
      success: function (res) {
        // success
        console.log(res);
      },
      fail: function (res) {
        // fail
        console.log(res);
      },
      complete: function (res) {
        // complete
        console.log(res);
      }
    })
  }

}))