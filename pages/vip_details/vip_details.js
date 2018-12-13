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
      url: `${getApp().globalData.baseUrl}/wechat/vip/checkVip`,
      data:{
        c_user_id: c_user_id
      },
      header:{
      },
      success:function(res){
console.log(res.data.data,99999);
        var vip_information = res.data.data;
        that.setData({
          vip_information: vip_information
        })
      }
    })
  },
  deposit:function(){
wx.navigateTo({
  url: '../member/member',
})
  },
  record:function(){
    wx.navigateTo({
      url: '../vip_record/vip_record',
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
    wx.navigateBack ({
      delta:2
    })
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