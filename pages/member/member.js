Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    pres: [
    ],
    myloading: true,
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
var that=this;
wx.request({
  url: `${getApp().globalData.baseUrl}/wechat/vip/getRecgarge`,
  data:{

  },
  header:{   
  },
  success:function(res){
    var new_pres = res.data.data
    console.log(new_pres,555555);
    var recharge_id='';
    if (new_pres){
      recharge_id = new_pres[0].id;
    }
    //var recharge_id=new_pres[0].id;
    that.setData({
      pres:new_pres,
      recharge_id: recharge_id
    })
  }
})
  },
  /**切换背景变色 */
  click: function(e) {
    var ids = e.currentTarget.dataset.id; //获取自定义的id   
    var recharge_id = e.currentTarget.dataset.recharge_id;    
    this.setData({      
      id: ids,  //把获取的自定义id赋给当前组件的id(即获取当前组件)    
      recharge_id: recharge_id  
      })

  },
  myPay:function(){
    var that = this;
    that.setData({
      myloading: false
    });
   
    setTimeout(function () {
      that.setData({
        myloading: true
      });
    }, 3000)
    console.log(that.data.recharge_id,222);
    var c_user_id = (wx.getStorageSync('c_user_id'));
    that.setData({
      c_user_id: c_user_id
    });
    
        
        var openId = (wx.getStorageSync('openId'));
       
          wx.request({
            url: `${getApp().globalData.baseUrl}/wechat/vip/payRecgarge`,
            data: {
              recharge_id: that.data.recharge_id,
              openid: openId
            },
            header: {},
            success: function (param){
              console.log(param.data);
              var record_id = param.data.data.record_id;
              // console.log(param.data.data.timeStamp);
              // console.log(param.data.data.nonceStr);
              // console.log(param.data.data.package);
              // console.log(param.data.data.paySign);
              wx.requestPayment(
                {
                  'timeStamp': '' + param.data.data.timeStamp,
                  'nonceStr': '' + param.data.data.nonceStr,
                  'package': '' + param.data.data.package,
                  'signType': 'MD5',
                  'paySign': '' + param.data.data.paySign,
                  'success': function (res) {
                    console.log(res);
                    wx.request({
                      url: `${getApp().globalData.baseUrl}/wechat/vip/paySuccess`,
                      data: {
                        c_user_id: c_user_id,
                        id: record_id,
                        recharge_id: that.data.recharge_id
                      },
                      header: {},
                      success: function (res) {
                        if(res.data.code==200){
                          wx.showToast({
                            title: '支付成功',
                            icon: 'success',
                            duration: 2000
                          });
                        }
                      }
                    });
                    
                  },
                  'fail': function (res) {
                    console.log("支付失败");
                  },
                  'complete': function (res) {
                    console.log("pay complete")
                    wx.redirectTo({
                      url: '../person_center/person_center?url=' + record_id,
                    })
                  }
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