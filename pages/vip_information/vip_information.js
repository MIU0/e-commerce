Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  vip_information: function(e) {
    var that = this;
    var c_user_id = (wx.getStorageSync('c_user_id'));
    that.setData({
      c_user_id: c_user_id
    });
    const value = e.detail.value;
    var phone = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!phone.test(value.phone)) {
      wx.showModal({
        title: '提示',
        content: '手机号格式错误',
      })
      return false;
    }
    // console.log(that.data, 9999);
    if (value.name && value.phone) {
      wx.request({
        url: `${getApp().globalData.baseUrl}/wechat/vip/saveUserVip`,
        data: {
          'c_user_id': c_user_id,
          'name': e.detail.value.name,
          'phone': e.detail.value.phone
        },
        
        success: function(res) {
          console.log(e.detail.value.name,999999)
          if (res.data.code == 200) {
            wx.showModal({
              title: '提示',
              content: '领取成功',
              showCancel: false,
              success: function(res) {
               wx.redirectTo({
                 url: '../vip_details/vip_details',
               });
              }
            })
          } else {
            wx.showModal({
              title: '提示',
              content: '提交异常',
              showCancel: true,
            })
          }
        }
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '请填写完整资料',
        showCancel: false
      })
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})