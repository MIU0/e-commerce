Page({

  /**
   * 页面的初始数据
   */
  data: {
    my_orders: [],
    currentTab: 9,
    hiddenmodalput: true,

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
    var c_user_id = (wx.getStorageSync('c_user_id'));
    // console.log(c_user_id);
    this.setData({
      c_user_id: c_user_id
    })
    var that = this;
    var status = that.data.currentTab;
    if (status == 9) {
      status = '';
    }

    //console.log(status,999);
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/order/getOrderList`,
      data: {
        status: status,
        c_user_id: c_user_id
      },
      header: {
        'content-type': 'application/json'  // 默认值
      },
      success: function(res) {
        var new_my_order = res.data.data;
        var my_choose = 0;
        if (!new_my_order || new_my_order.length == 0) {
          my_choose = 1;
        }
        // console.log(new_my_order.length);
        that.setData({
          my_orders: new_my_order,
          my_choose: my_choose
        })

      }
    })


  },
  // 跳转到'订单待支付'
  order_confirm: function(e) {
    var aa = e.currentTarget.dataset.order_id
    var status = e.currentTarget.dataset.status
    // console.log(status,33)
    //console.log(aa,444)
    if (status<8){
      wx.navigateTo({
        url: '../settle_account/settle_account?url=' + aa,
      })
    }
      
  },
  refund:function(e){
    var aa = e.currentTarget.dataset.order_id;
    console.log(aa, 88888)
    wx.navigateTo({
      url: '../refund/refund?url=' + aa,
    })
  },
  /**物流 */
  my_logs: function (e) {
    var aa = e.currentTarget.dataset.order_id;
    console.log(aa,88888)
wx.navigateTo({
  url: '../my_logs/my_logs?url='+aa,
})
  },
  // 退款
  refund:function(e){
    var aa = e.currentTarget.dataset.order_id;
    wx.navigateTo({
      url: '../refund/refund?url='+aa,
    })
  },
  //确认收货
  sure: function(e) {
    //console.log(1111);
    var that = this;
    var order_id = e.currentTarget.dataset.order_id;
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/order/updateStatus`,
      data: {
        status: 4,
        order_id: order_id
      },
      header: {
        'content-type': 'application/json'  // 默认值
      },
      success: function(res) {
        wx.showToast({
          title: '您已确认收货',
          success: res => {
            //在提示的成功函数中初始化当前加载订单页为第一页，清空订单列表数据
            //this.setData({ currentPage: 1, orderList: [] });
            //用onLoad周期方法重新加载，实现当前页面的刷新
            var status = e.target.dataset.current;
            wx.request({
              url: `${getApp().globalData.baseUrl}/wechat/order/getOrderList`,
              data: {
                status: status,
                c_user_id: that.data.c_user_id
              },
              header: {
                'content-type': 'application/json'  // 默认值
              },
              success: function(res) {
                // var my_orders=[]
                var new_my_order = res.data.data;
                //  my_orders.push(new_my_order)
                //console.log(new_my_order, 55)
                that.setData({
                  my_orders: new_my_order
                })

              }
            })

          }
        })
      }
    })

  },
  //再来一单
  onemore: function() {
    wx.navigateTo({
      url: '../store_list/store_list',
    })
  },
  //取消订单
  quxiao: function(e) {
    console.log(1111);
    var that = this;
    wx.showModal({
      title: '您已取消订单',
      success: res => {

        if (res.confirm) {
          // console.log(1111);

          var current = e.currentTarget.dataset.current;
          var order_id = e.currentTarget.dataset.order_id;
          if (current == 2) {
            wx.request({
              url: `${getApp().globalData.baseUrl}/wechat/refund/refundPay`,
              header: {
                'content-type': 'application/json'
              },
              data: {
                'order_id': order_id
              },
              success: function(res) {
                console.log(res.data);
                if (res.data.code == 200) {}
               
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
            success: function(res) {


              //在提示的成功函数中初始化当前加载订单页为第一页，清空订单列表数据
              //this.setData({ currentPage: 1, orderList: [] });
              //用onLoad周期方法重新加载，实现当前页面的刷新
              var status = e.target.dataset.current;
              wx.request({
                url: `${getApp().globalData.baseUrl}/wechat/order/getOrderList`,
                data: {
                  status: status,
                  c_user_id: that.data.c_user_id
                },
                header: {
                  'content-type': 'application/json'  // 默认值
                },
                success: function(res) {
                  var new_my_order = res.data.data;
                  that.setData({
                    my_orders: new_my_order
                  })
                  that.order_a();
                }
              })
            }
          })
         
        } else {
          console.log('用户点击取消')
        }
      }
    });


  },

  //支付
  mypay: function(e) {
    var order_id = e.currentTarget.dataset.order_id;
    var eat_type = e.currentTarget.dataset.eat_type;
    //console.log(order_id);
    var openId = (wx.getStorageSync('openId'));
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/pay/weChatPay`,
      data: {
        openid: openId,
        order_id: order_id
      },
      success: function(param) {
        // console.log(param.data);
        // console.log(param.data.data.timeStamp);
        // console.log(param.data.data.nonceStr);
        // console.log(param.data.data.package);
        //console.log(res.data.package);
        // console.log(param.data.data.paySign);
        wx.requestPayment({
          'timeStamp': '' + param.data.data.timeStamp,
          'nonceStr': '' + param.data.data.nonceStr,
          'package': '' + param.data.data.package,
          'signType': 'MD5',
          'paySign': '' + param.data.data.paySign,
          'success': function(res) {
            // console.log(res);
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 2000
            });
          },
          'fail': function(res) {
            console.log("支付失败");
          },
          'complete': function(res) {
            console.log("pay complete");
            if (eat_type == 0) {
              wx.navigateTo({
                url: '../settle_account/settle_account?url=' + order_id,
              })
            } else {
              wx.navigateTo({
                url: '../shop_settle_account/shop_settle_account?url=' + order_id,
              })
            }

          }
        })
      }
    })
  },
  orderChange: function(e) {
    var that = this;
    that.setData({
      currentTab: e.data.current
    });


  },


  order: function(e) {
    var that = this;
    // console.log(e.currentTarget.dataset.current,88)
    if (this.data.currentTab === e.currentTarget.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }


    that.order_a();

  },
  order_a: function() {
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
      success: function(res) {
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