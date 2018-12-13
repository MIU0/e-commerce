Page({

  /**
   * 页面的初始数据
   */
  data: {
    textarea:'',
    selectTime:false,
    selectpay:false,
    my_remark:false,
    currentTab:0,
    current:0,
    
    buy_list:[],
    time_items:[
    ],
    radioCheckVal: 0,
    time_order:[],
    items: [
      { name: '0', value: '微信' },
      { name: '1', value: '会员卡', checked: 'true' }
    ]
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
      url: `${getApp().globalData.baseUrl}/wechat/order/confirmShopOrder`,
      data:{
        c_user_id: c_user_id
      },
      header: {
        'content-type': 'application/json'  // 默认值
      },
      success: function (res){
        //console.log(res.data,111)
        var new_buy_list = res.data.data;
        console.log(new_buy_list,444444);
        var userAddress=new_buy_list.userAddress;
        var cartList = new_buy_list.cartList;
        var sum_price = new_buy_list.sum_price;
        var t_coupons = new_buy_list.t_coupons;
        var b=true;
        var c_user_vip = new_buy_list.c_user_vip;
        var pay_type="0";
        if (c_user_vip){
          var balance=c_user_vip.balance;
          if (balance > parseFloat(sum_price)){
            pay_type = "1";
          }
        }
        console.log(pay_type,888989);
        if (userAddress){
            b=false;
        } 
        var coupons_null=1;
        if (!t_coupons){
          coupons_null=0
        }
        that.setData({
          userAddress: userAddress,
          cartList: cartList,
          sum_price: sum_price,
          t_coupons: t_coupons,
          isNull:b,
          coupons_null: coupons_null,
          pay_type: pay_type,
          c_user_vip: c_user_vip,
          init_type: pay_type
        })        
      }
    })

  },

// 单选框点击事件
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    var pay_type = e.detail.value;
    console.log(pay_type,787878);
    this.setData({
      pay_type: pay_type,
      selectpay: false
    })

  },
//打开支付方式弹出层
  pay_style:function(){
    this.setData({
      selectpay: true
    })
  },
  closepay:function(){
   this.setData({
  selectpay:false
})
},
  //添加备注
  remarks: function (e) {
    this.setData({
      remarks:e.detail.value
    })
  },
  preventTouchMove: function () {
  },
  bindText: function (e) {
    this.setData({
      remarks: e.detail.value
    })
  },

  // 跳转到'到店自取'
  // payInStore: function () {
  //   wx.navigateTo({
  //     url: '../pay_in_store/pay_in_store',
  //   })
  // },

  // 跳转到'我的地址'
  myAddress: function () {
    wx.navigateTo({
      url: '../my_address/my_address',
    })
  },
 
/**确认支付 */
  toPay:function(e){
    var that=this;
    var remarks = that.data.remarks;
    console.log(that.data)
    if (!remarks){
      remarks='无'
    }
    if(!that.data.userAddress){
      wx.showModal({
        title: '提示',
        content: '收货地址不能为空',
      })
      return false;
    }
    var t_coupons=that.data.t_coupons;
    var coupons_id='';
    if (t_coupons){
      coupons_id = t_coupons.coupons_id;
    }
    // console.log(that.data,55555);
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/order/toShopOrder`,
      data: {
        eat_type:3,
        address_id: that.data.userAddress.address_id,
        coupons_id:coupons_id,
        remarks:remarks,
        c_user_id: that.data.c_user_id,
        pay_type:that.data.pay_type,
        
      },
      header: {
        'content-type': 'application/json'  // 默认值
      },
      success:function (res) {
        console.log(res.data.data,999999)
       if(res.data.code==200){
         var order_id = res.data.data.order_id;
         if (that.data.pay_type==0){
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
                     });
                   },
                   'fail': function (res) {
                     console.log("支付失败");
                   },
                   'complete': function (res) {
                     console.log("pay complete")
                     wx.redirectTo({
                       url: '../settle_account/settle_account?url=' + order_id,
                     })
                   }
                 })
             }
           })
         }else{
           wx.request({
             url: `${getApp().globalData.baseUrl}/wechat/pay/balancePay`,
             data: {
               order_id: order_id
             },
             success: function (param) {
                if(param.data.code=200){
                  wx.showModal({
                    title: '提示',
                    content: '支付成功',
                    success:function(res){
                      wx.redirectTo({
                        url: '../settle_account/settle_account?url=' + order_id,
                      })
                    }
                  })

                }else if(param.data.code=501){
                  if (param.data.code = 200) {
                    wx.showModal({
                      title: '提示',
                      content: '余额不足'
                    });
                }

              
             }
               
             }
             
           });
           
         }
         
       }
    
      }
    });
  },

  check_sure:function(e){
    var time = e.target.dataset.time;
    this.setData({
      time: time
    });
      //console.log(value);
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