var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectSeason: false,
    v_status:0,
    loadingHidden: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      order_id: options.url
    })
    this.onShow_a();
  },
  // 关闭'选择时间'弹出层
  my_close: function(e) {
    this.setData({
      selectSeason: false
    })
  },
  select_Season: function() {
    this.setData({
      selectSeason: true
    })
  },

  //退款原因点击事件
  my_reason:function(e){
    this.setData({
      loadingHidden: false
    });
    var that = this;
    setTimeout(function () {
      var c_reason = e.target.dataset.c_reason;
      console.log(c_reason, 999999999);
      that.setData({
        c_reason: c_reason,
        v_status: 1,
        selectSeason: false,
        loadingHidden: true
      })
    }, 500);
  },
  //提交退款信息
  submit_reason:function(){
   var that=this;
    var c_reason = that.data.c_reason
    if (!c_reason){
      wx.showModal({
        title: '提示',
        content: '请选择退款原因',
      })
      return false;
    }
    console.log(c_reason,9999)
   wx.request({
     url: `${getApp().globalData.baseUrl}/wechat/order/toReturnPay`,
     data: {
       order_id: that.data.order_id,
       c_reason: c_reason
     },
     header: {
       'content-type': 'application/json' // 默认值
     },
     success:function(res){
       wx.navigateBack({   
       })
     }
   })
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
        var that=this;
    // console.log(that.data.order_id,99999)
        wx.request({
          url: `${getApp().globalData.baseUrl}/wechat/order/getRetundInfo`,
          data: {
            order_id: that.data.order_id
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success:function(res){
    console.log(res.data.data,7777);
            var refund_information=[];
            var new_refund_information=res.data.data;
            var commodity_infoList = new_refund_information.commodity_infoList;
            var t_refund_apply = new_refund_information.t_refund_apply;
            console.log(t_refund_apply,999);
            var create_time ="";
            if (t_refund_apply!=null){
              create_time = t_refund_apply.create_time;
              create_time = util.formatTime(new Date(create_time));
            }
            
            that.setData({
              refund_information: new_refund_information,
              commodity_infoList: commodity_infoList,
              t_refund_apply: t_refund_apply,
              create_time: create_time
            })
          }
        })
  },
  onShow_a: function() {
    var that = this;
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/order/getReturnReason`,
      data: {
        // order_id: that.data.order_id,
        // c_reason: that.data.c_reason,
      },
      header: {
        'content-type': 'application/json'  // 默认值
      },
      success:function(res){
        // console.log(res.data.data, 7777);
        var reason_list=[]
        var new_reason_list=res.data.data;
        for (var i = 0; i < new_reason_list.length;i++){
          reason_list.push(new_reason_list[i])
        } 
        that.setData({
          reason_list: reason_list
        })
      }
    })
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