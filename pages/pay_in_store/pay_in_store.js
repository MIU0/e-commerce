Page({

  /**
   * 页面的初始数据
   */
  data: {
    textarea: '',
    selectTime: false, //选择时间
    selectNum: false, //选择就餐人数
    currentTab: 0,
    current: 0,
    time_items: [
    ],
    num_items: [
    ],
    time_order :[]
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
    var that = this;
    var c_user_id = (wx.getStorageSync('c_user_id'));
    that.setData({
      c_user_id: c_user_id
    });
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/order/ddConfirmOrder`,
      data: {
        c_user_id: c_user_id
      },
      header: {
        'content-type': 'application/json'  // 默认值
      },
      success: function(res) {
        console.log(res.data, 2222222);
        var new_buy_list = res.data.data;
        var t_store_info = new_buy_list.t_store_info;
        var cartList = new_buy_list.cartList;
        var sum_price = new_buy_list.sum_price;
        var mr_time = new_buy_list.mr_time;
        that.setData({
          t_store_info: t_store_info,
          cartList: cartList,
          sum_price: sum_price,
          time: mr_time,
          date1: 0
        })
      }
    })
  },
  // 今天、明天、后天
  selectTime: function () {
    var that = this;
    this.setData({
      selectTime: true
    })
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/order/getDate`,
      data: {

      },
      header: {
        'content-type': 'application/json'  // 默认值
      },
      success: function (res) {
        var time_order = [];
        var new_time_order = res.data.data;
        //console.log(new_time_order, 8888888)
        for (var i = 0; i < new_time_order.length; i++) {
          time_order.push(new_time_order[i])
        }
        that.setData({
          time_order: time_order

        })
        that.sss();


      }
    })
  },
  // 选择到店时间
  selectWeek: function (e) {
    var that = this;
    let index = e.target.dataset.current;
    that.setData({
      currentTab: index,
      current: index,
      date1: index
    })
    that.sss();
  },
  //获取到店时间共用接口
  sss: function () {
    var that = this;
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/order/getTime`,
      data: {
        date: that.data.currentTab
      },
      header: {
        'content-type': 'application/json'  // 默认值
      },
      success: function (res) {
        //console.log(res.data.data,6666)
        var time_items = [];
        var new_time_items = res.data.data;
        for (var i = 0; i < new_time_items.length; i++) {
          time_items.push(new_time_items[i])
        }
        that.setData({
          time_items: time_items
        })
      }
    });
  },
  /**选择到店时间点击确认 */
  top_sure: function () {
    var that = this;
    //  console.log(that.data,9999999)
    that.setData({
      selectTime: false
    })

  },
  check_sure: function (e) {
    var time = e.target.dataset.time;
    this.setData({
      time: time
    });
    //console.log(value);
  },
  // 关闭'选择时间'弹出层
  closemask: function() {
    this.setData({
      selectTime: false
    })
  },
  // 选择到店时间

 

  //添加备注
  remarks: function (e) {
    this.setData({
      remarks: e.detail.value
    })
  },
  phone:function(e){
    this.setData({
      phone: e.detail.value
    })
  },
  preventTouchMove: function () {
  },
  /**去支付 */
  toPay: function (e) {
    var that = this;
    var remarks = that.data.remarks;
    var phone_a = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    var phone = that.data.phone;
    if (!remarks) {
      remarks = '无'
    }
    console.log(that.data,99999999)
    if (!phone) {
      wx.showModal({
        title: '提示',
        content: '手机号不能为空',
      })
      return false;
    }
    if (!phone_a.test(phone)) {
      wx.showModal({
        title: '提示',
        content: '请输入正确的手机号',
      })
      return false;
    }
    console.log(phone,22222)
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/order/toOrder`,
      data: {
        eat_type: 1,
        // address_id: that.data.userAddress.address_id,
        remarks: remarks,
        phone: phone,
        c_user_id: that.data.c_user_id,
        time:that.data.time,
        date:that.data.date1
      },
      header: {
        'content-type': 'application/json'  // 默认值
      },
      success: function (res) {
        if (res.data.code == 200) {
          var order_id = res.data.data.order_id;
          var openId = (wx.getStorageSync('openId'));
          wx.request({
            url: `${getApp().globalData.baseUrl}/wechat/pay/weChatPay`,
            data: {
              openid: openId,
              order_id: order_id
            },
            success: function (param) {
              console.log(param.data);
              console.log(param.data.data.timeStamp);
              console.log(param.data.data.nonceStr);
              console.log(param.data.data.package);
              console.log(param.data.data.paySign);
              wx.requestPayment(
                {
                  'timeStamp': '' + param.data.data.timeStamp,
                  'nonceStr': '' + param.data.data.nonceStr,
                  'package': '' + param.data.data.package,
                  'signType': 'MD5',
                  'paySign': '' + param.data.data.paySign,
                  'success': function (res) {
                    console.log(res);
                    wx.showToast({
                      title: '支付成功',
                      icon: 'success',
                      duration: 2000
                    }
                    );
                  },
                  'fail': function (res) {
                    console.log("支付失败");
                  },
                  'complete': function (res) {
                    console.log("pay complete")
                    wx.redirectTo({
                      url: '../shop_settle_account/shop_settle_account?url=' + order_id,
                    })
                  }
                })
            }
          })
        }

      }
    });
  },

  /**
   * 地图
   */
  openMap: function() {
    var that=this;
    // console.log(that.data.t_store_info,66666)
    
    var name = that.data.t_store_info.province + that.data.t_store_info.city + that.data.t_store_info.county
    var address = that.data.t_store_info.address
    wx.openLocation({
      latitude: 30.504, // 纬度，范围为-90~90，负数表示南纬
      longitude: 114.443, // 经度，范围为-180~180，负数表示西经
      name: name,
      address: address,
      scale: 28, // 缩放比例
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