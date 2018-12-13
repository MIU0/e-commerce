
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that=this;
    var c_user_id = (wx.getStorageSync('c_user_id'));
    that.setData({
      c_user_id: c_user_id
    });
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/coupons/getUserCouponsList`,
      data: {
        c_user_id: c_user_id,
      },
      header: {
        'content-type': 'application/json'  // 默认值
      },
      success:function(res){
        //var my_coupon=[];
        var new_my_coupon=res.data.data;
        console.log(new_my_coupon,7777)
        for (var i = 0; i < new_my_coupon.length;i++){
          
          var over_time = new_my_coupon[i]["over_time"]
          new_my_coupon[i]["over_time"] = util.shortTime(new Date(over_time));
        }
        that.setData({
          my_coupon: new_my_coupon
        })
      }

    })
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