Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgsUrl: [ //轮播

    ],
    index: 0,
    shops_infora: [],
    shops_inforb: [],
    shops_inforc: [],
    shop_item: [ //商品(猜你喜欢)
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    inforHasMore: 1,
    inforPage: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/commodity/getAdver`,
      data: {},
      header: {
        'content-type': 'application/json'  // 默认值
      },
      success: function(res) {
        var data = res.data.data;
        var arr = [];
        that.setData({
          imgsUrl: data
        })
      }
    });
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
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/commodity/getRecommendComm`,
      data: {

      },
      header: {
        'content-type': 'application/json'  // 默认值
      },
      success: function(res) {
        // console.log(res.data,111)
        var shops_infor = []
        var newshops_infor = res.data.data;
        var shops_infor1 = [];
        shops_infor1.push(newshops_infor[0]);
        var shops_infor2 = [];
        shops_infor2.push(newshops_infor[1]);
        var shops_infor3 = [];
        shops_infor3.push(newshops_infor[2]);
        that.setData({
          shops_infora: shops_infor1,
          shops_inforb: shops_infor2,
          shops_inforc: shops_infor3,
        })
        that.onShow1();
      }
    })

  },

  onShow1: function(res) {
    var that = this;
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/commodity/getInfoByCommNum`,
      data: {
        page: 1,
        rows: 30
      },
      header: {
        'content-type': 'application/json'  // 默认值
      },
      success: function(res) {
        if (res.data.code = 200) {
          var shop_item = []
          var new_shop_item = res.data.data;
          // console.log(res.data.data.length,888888)
          for (var i = 0; i < new_shop_item.length; i++) {
            shop_item.push(new_shop_item[i])
          }
          that.setData({
            shop_item: shop_item

          })
          if (res.data.data.length < 30) {
            that.setData({
              inforHasMore: 0
            })
          } else {
            that.setData({
              inforPage: 2
            })
          }
        } else {
          that.setData({
            shop_lists: [],
            inforHasMore: 0,
          });
        }

      },
      fail: function(res) {
        console.log('查询失败');
      }
    })
  },
  // 进入商品详情
  store_details: function(e) {
    //console.log(e, 55555)
    var aa = e.currentTarget.dataset.id
    // console.log(aa, 55555)
    wx.navigateTo({
      url: '../shop_details/shop_details?url=' + aa,
    })
  },
  /**广告跳转 */
  transition: function(e) {
    var my_transition = e.currentTarget.dataset.adver_url;
    wx.navigateTo({
      url: my_transition,
    })
  },
  /**热门商品分页 */
  loadingMore: function() {
    var that = this;
    var inforHasMore = that.data.inforHasMore;
    if (inforHasMore == 1) {
      wx.showLoading({
        title: '正在加载',
      })
      var pa_shop_item = that.data.shop_item;
      var inforPage = that.data.inforPage;
      wx.request({
        url: `${ getApp().globalData.baseUrl}/wechat/commodity/getInfoByCommNum`,
        data: {
          page: inforPage,
          rows: 20
        },
        header: {
          'content-type': 'application/json'  // 默认值
        },
        success: function(res) {
          wx.hideLoading();
          if (res.data.code = 200) {
            var shop_item = [];
            var new_shop_item = pa_shop_item.concat(res.data.data);
            for (var i = 0; i < new_shop_item.length; i++) {
              shop_item.push(new_shop_item[i])
            }
            that.setData({
              shop_item: shop_item
            });
            if (res.data.data.length < 20) {
              that.setData({
                inforHasMore: 0
              })
            } else {
              that.setData({
                inforPage: ++inforPage
              })
            }
          } else {
            that.setData({
              shop_item: pa_shop_item,
              inforHasMore: 0,
            });
          }
        },
        fail: function(res) {
          console.log("加载失败")
        },
        complete: function(res) {
          console.log("加载完成")
        }

      })
    }
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