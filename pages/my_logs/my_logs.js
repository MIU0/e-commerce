Page({

  /**
   * 页面的初始数据
   */
  data: {
    num:0,
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      order_id: options.url
    })
   
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
    console.log(that.data,77777)
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/order/getLogisticsInfo`,
      data:{
        order_id: that.data.order_id
      },
      header:{
        'content-type': 'application/json'  // 默认值
      },
      success:function(res){
console.log(res.data.data,88888);
var my_logs=res.data.data;
that.setData({
  my_logs: my_logs
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