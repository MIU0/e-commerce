//app.js

App({
  onLaunch: function() {
    var openId = (wx.getStorageSync('openId'));
    var c_user_id = (wx.getStorageSync('c_user_id'));
    // console.log(openId, 11111);
    // console.log(c_user_id, 222);
    var that = this;
    //if (!openId ||!c_user_id) {
      wx.login({
        success: function (res) {
          // console.log(res.code)
          if (res.code) {

                wx.request({
                  //后台接口地址
                  url: `${getApp().globalData.baseUrl}/wechat/home/index`,
                  data: {
                    code: res.code
                  },
                  method: 'GET',
                  header: {
                    'content-type': 'application/json'
                  },
                  success: function (res) {
                    // this.globalData.userInfo = JSON.parse(res.data);
                    // console.log(res.data,3333);
                    wx.setStorageSync('openId', res.data.openid);
                    wx.setStorageSync('c_user_id', res.data.c_user_id);
                  }
                })


          }
        }
      })

    //}

    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo;

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)

    //           }

    //         }
    //       })

    //     }

    //   }
    // })

  },
  globalData: {
    userInfo: null,
    baseUrl: 'https://www.vimi66.com/fruit'
  }
 
})