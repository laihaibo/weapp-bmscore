const observer = require('../../libs/observer').observer;

let app = getApp();
Page(observer({
  data: {
    filters: [],
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
  setFilter: function(e) {
    // console.log(e.detail.value)
    let id = parseInt(e.detail.value,10);
    // let id = 1;
    this.props.store.setFilter(id);
    // console.log(this.props.store.games.map(game => console.log(game.player1 == 1,game.player2 ==2)))
  }
}));