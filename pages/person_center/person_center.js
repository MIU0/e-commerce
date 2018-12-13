Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      avatarUrl: "", //用户头像
      nickName: "", //用户昵称
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.onShow_a();
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
    })

    wx.getUserInfo({

      withCredentials: true, //此处设为true，才会返回encryptedData等敏感信息
      success: function(res) {
        that.setData({
          userInfo: res.userInfo,
          my_person: 0
        })
      },
      fail:function(res){
        that.setData({
          my_person: 1
        })
        
      }
    })
    that.onShow_a();
  },
  //优惠券、余额等信息
  onShow_a:function(){
    var that = this;
    var c_user_id = (wx.getStorageSync('c_user_id'));
    console.log(c_user_id,44444)
    that.setData({
      c_user_id: c_user_id
    })
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/user/personCenter`,
      data:{
        c_user_id: c_user_id
      },
      header:{
        'content-type': 'application/json' // 默认值
      },
      success:function(res){
console.log(res.data.data,66666)
        var person_information = res.data.data;
        var c_user_vip = person_information.c_user_vip;
        var balance='0.00'
        if (c_user_vip){
          balance = c_user_vip.balance;
        }
        that.setData({
          person_information: person_information,
          balance: balance
        })

      }
    })
  },
  // 跳转到我的地址
  my_address: function() {
    wx.navigateTo({
      url: '../my_address/my_address',
    })
  },
  seller:function(){
    wx.navigateTo({
      url: '../seller/seller',
    })
  },
  /**跳转到会员充值 */
  vip: function(e) {
    var that = this
    var c_user_id = (wx.getStorageSync('c_user_id'));
    // console.log(c_user_id, 7777777)
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/vip/checkVip`,
      data: {
        c_user_id: c_user_id
      },
      header:{
        'content-type': 'application/json' // 默认值
      },
      success:function(res){
        // console.log(res.data.data,8888);
        if (!res.data.data){
          wx.navigateTo({
            url: '../person_important/person_important',
          })
        }else{
          wx.navigateTo({
            url: '../vip_details/vip_details',

          })
        }
       
      }
    })
    
  },
  /**红包跳转 */

  // red_packet: function () {
  //   wx.navigateTo({
  //     url: '../red_packet/red_packet',
  //   })
  // },
  /**优惠券跳转 */
  coupon: function () {
    wx.navigateTo({
      url: '../coupon/coupon',
    })
  },
  /**余额跳转 */
  // mymoney: function () {
  //   wx.navigateTo({
  //     url: '../money/money',
  //   })
  // },
  /**获取用户信息 */
  getUserInfo: function() {
    var that = this;
    wx.getUserInfo({
      withCredentials: true, //此处设为true，才会返回encryptedData等敏感信息
      success: function (res) {
        console.log(res.userInfo,999999)
        var sex = 'F'
        if (res.userInfo.gender == 0) {
          sex = "M"
        } else {
          sex = "F"
        }
        wx.request({
          url: `${getApp().globalData.baseUrl}/wechat/user/updateUser`,
          data: {
            c_user_id: that.data.c_user_id,
            user_name: res.userInfo.nickName,
            sex: sex
          },
          header: {
            'content-type': 'application/json'  // 默认值
          },
          success: function (res) {

          }

        })
        that.setData({
          userInfo: res.userInfo,
          my_person: 0
        })
      },
      fail: function (res) {
        that.setData({
          my_person: 1
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