var util = require('../../utils/util.js');  
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myaccounts_shops:[],
    information:[],
    my_orders:[],
    phoneNumber:'123456789'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      order_id: options.url
    })
  },
  // 退款
  refund: function (e) {
    var aa = e.currentTarget.dataset.order_id;
    wx.navigateTo({
      url: '../refund/refund?url=' + aa,
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
    var that = this;
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/order/getShopOrderDetails`,
      data: {
        order_id: that.data.order_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var new_myaccounts_shops = res.data.data.t_order; 
        console.log(new_myaccounts_shops,6666666)
        that.setData({
          myaccounts_shops: new_myaccounts_shops, 
          deliver: new_myaccounts_shops.t_order_shop_address,
          phoneNumber: res.data.data.t_store_info.phone
        })

      }
  })
  },
/**打电话 */
  my_phone:function(e){
    var that=this;
    
wx.makePhoneCall({
  phoneNumber: that.data.phoneNumber,
  
})
  },
  //取消订单
  quxiao: function (e) {
    //console.log(1111);
    var that = this;
    wx.showModal({
      title: '您已取消订单',
      success: res => {

        if (res.confirm) {
          // console.log(1111);
        
          var current = e.currentTarget.dataset.current;
          var order_id = e.currentTarget.dataset.order_id;
          if (current == 1) {
            wx.request({
              url: `${getApp().globalData.baseUrl}/wechat/refund/refundPay`,
              header: {
                'content-type': 'application/json'
              },
              data: {
                'order_id': order_id
              },
              success: function (res) {
                if (res.data.code == 200) { 

                }
              }
            })
           
          }
          wx.request({
            url: `${getApp().globalData.baseUrl}/wechat/order/updateStatus`,
            data: {
              status: 7,
              order_id: order_id
            },
            header: {
              'content-type': 'application/json'  // 默认值
            },
            success:function(){   
            } 
          })
          wx.navigateBack();
        } else {
          console.log('用户点击取消')
        }
       
      }
    });

  },

  order_a: function () {
    var that = this;
    console.log(that.data.currentTab);
    var status = that.data.currentTab;
    if (status == 9) {
      status = '';
    }
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/order/getOrderList`,
      data: {
        status: status,
        c_user_id: that.data.c_user_id
      },
      header: {
        'content-type': 'application/json'  // 默认值
      },
      success: function (res) {
        // var my_orders=[]
        var new_my_order = res.data.data;

        //  my_orders.push(new_my_order)
        // console.log(new_my_order, 55)
        var my_choose = 0;
        if (!new_my_order || new_my_order.length == 0) {
          my_choose = 1;
        }
        that.setData({
          my_orders: new_my_order,
          my_choose: my_choose
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
    wx.reLaunch({
      url: '../all_order/all_order',
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