Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,
    lq_status:0
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
      url: `${getApp().globalData.baseUrl}/wechat/coupons/getAllCouponsList`,
      data: {
        c_user_id: c_user_id

      },
      header: {
        'content-type': 'application/json'  // 默认值
      },
      success:function(res){
        var coupon_list=[];
        var new_coupon_list=res.data.data;
        for (var i = 0; i < new_coupon_list.length;i++){
          coupon_list.push(new_coupon_list[i])
        }
        console.log(coupon_list,9999)
        that.setData({
          coupon_list: coupon_list
        })
      }
    })
  },

  coupon_click:function(e){
    var that=this;
    var c_user_id = (wx.getStorageSync('c_user_id'));
    that.setData({
      c_user_id: c_user_id
    });
    var coupons_id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var coupon_list = that.data.coupon_list;
    coupon_list[index].lq_status=1;
    that.setData({
      coupons_id: coupons_id,
      coupon_list: coupon_list
    })
    console.log(coupons_id,8888)
wx.request({
  url: `${getApp().globalData.baseUrl}/wechat/coupons/addCoupons`,
  data: {
    c_user_id: c_user_id,
    coupons_id: coupons_id
  },
  header: {
    'content-type': 'application/json'  // 默认值
  },
  
  success:function(res){

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