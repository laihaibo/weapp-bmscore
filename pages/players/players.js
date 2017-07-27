const observer = require('../../libs/observer').observer;
import store from '../../stores/index';

let app = getApp();
Page(observer({
  data: {
    name: ''
  },
  props: {
    store: app.globalData.store
  },
  onLoad: function () {
  },
  onShow: function() {
    this.props.store = app.globalData.store
  },
  onHide: function() {
    app.globalData.store = this.props.store;
  },
  onUnload: function() {
    app.globalData.store = this.props.store;
    let store =this.props.store.currentStore;
    wx.setStorageSync('store', store)
  },
  addPlayer: function (e) {
    let name = e.detail.value.player;
    this.props.store.addPlayer(name);

    // 清除输入
    this.setData({
      name: '',
    })
  },

  removePlayer: function(e) {
    let id = parseInt(e.currentTarget.dataset.removeid, 10);
    this.props.store.removePlayer(id);
  }
}));