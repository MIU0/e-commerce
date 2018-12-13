Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 0,
    currentTab: 0,
    cartData: {},
    index: 0,
    type_id: 0,
    tipsshow: "",
    windows_out: false, //弹出层
    shop_lists: [{}],
    select_shop: [],
    swiper_tab_infor: [],
    buy: [],
    minusStatus: 'display',
    inforHasMore: 1,
    inforPage: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    var that = this;
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/commodity/getCommodityType`,
      data: {

      },
      header: {
        'content-type': 'application/json'  // 默认值
      },
      async: false,
      success: function(res) {
        // console.log(res.data);
        var new_swiper_tab_infor = []
        var newswiper_tab_infor = res.data.data;
        var type_id = newswiper_tab_infor[0].type_id;
        for (var i = 0; i < newswiper_tab_infor.length; i++) {
          new_swiper_tab_infor.push(newswiper_tab_infor[i])
        }
        that.setData({
          swiper_tab_infor: new_swiper_tab_infor,
          type_id: type_id
        })
        that.onShow_a()
        that.onShow_c()
      }


    })

  },

  /**分页加载 */
  loadingMore: function() {
    var that = this;
    var current = that.data.current;
    var inforHasMore = that.data.inforHasMore;
    if (inforHasMore == 1) {
      wx.showLoading({
        title: '正在加载',
      })
      var pa_shop_lists = that.data.shop_lists;
      var inforPage = that.data.inforPage;
      console.log(inforPage, 9999);
      wx.request({
        url: `${getApp().globalData.baseUrl}/wechat/commodity/getCommodityByType`,
        data: {
          type_id: that.data.type_id,
          c_user_id: that.data.c_user_id,
          page: inforPage,
          rows: 10
        },
        header: {
          'content-type': 'application/json'  // 默认值
        },
        success: function(res) {
          wx.hideLoading();
          if (res.data.code = 200) {
            var shop_lists = [];
            var new_shop_lists = pa_shop_lists.concat(res.data.data);
            for (var i = 0; i < new_shop_lists.length; i++) {
              shop_lists.push(new_shop_lists[i])
            }
            that.setData({
              shop_lists: shop_lists
            });
            console.log(res.data.data,555);
            if (res.data.data.length <10) {
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
              shop_lists: pa_shop_lists,
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  //显示分类列表信息
  onShow: function() {
    this.onShow_a();
    this.onShow_c();
  },
  // 显示分类中信息
  onShow_a: function() {
    var that = this;
    var c_user_id = (wx.getStorageSync('c_user_id'));
    that.setData({
      c_user_id: c_user_id
    });
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/commodity/getCommodityByType`,
      data: {
        type_id: that.data.type_id,
        c_user_id: c_user_id,
        page: 1,
        rows: 10
      },
      header: {
        'content-type': 'application/json'  // 默认值
      },
      success: function(res) {
        if (res.data.code = 200) {
          
          var shop_lists = [];
          var buy = [];
          var new_shop_lists = res.data.data;
          var new_buy = res.data.data;
          for (var i = 0; i < new_shop_lists.length; i++) {
            shop_lists.push(new_shop_lists[i])
          }
          for (var i = 0; i < new_buy.length; i++) {
            buy.push(new_buy[i])
          }
          that.setData({
            shop_lists: shop_lists,
            buy: buy
          })
          if (res.data.data.length <10) {
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
  //查询购物车接口
  onShow_b: function() {
    var that = this;
    var c_user_id = (wx.getStorageSync('c_user_id'));
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/commodity/getShopCartList`,
      data: {
        c_user_id: c_user_id
      },
      header: {
        'content-type': 'application/json'  // 默认值
      },
      success: function(res) {
        var buy = [];
        var new_buy = res.data.data;
        // console.log(new_buy.cartList,88888)
        that.setData({
          buy: new_buy.cartList,
          // packing_price: new_buy.packing_price
        })
      }
    })
  },
  //购物车总量
  onShow_c: function() {
    var that = this;
    var c_user_id = (wx.getStorageSync('c_user_id'));
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/commodity/getUserShopCartSum`,
      data: {
        c_user_id: c_user_id
      },
      header: {
        'content-type': 'application/json'  // 默认值
      },
      success: function(res) {
        var new_sum = res.data.data;
        var c_shop_sum = new_sum.c_shop_sum;
        that.setData({
          sum: new_sum,
        })

      }
    })
  },
  //类型列表底色切换
  swichNav: function(e) {
    // console.log('swichNav')
    var that = this;
    var index = e.currentTarget.dataset.index;
    var type_id = e.currentTarget.dataset.id;
    if (that.data.current === e.currentTarget.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: index,
        type_id: type_id
      })
      that.onShow_a();
    }

  },

  // 进入商品详情
  store_details: function(e) {
    var aa = e.currentTarget.dataset.id
    // console.log(aa,111)
    wx.navigateTo({
      url: '../shop_details/shop_details?url=' + aa,
    })
    // wx.navigateTo({
    //   url: '../my_logs/my_logs',
    // })


  },

  // 去买单
  create_order: function() {
    wx.navigateTo({
      url: '../create_order/create_order',
    })
  },
  preventTouchMove: function(e) {

  },
  closemask: function() {
    this.setData({
      windows_out: false
    })
  },
  // 弹出层
  popup: function() {
    this.setData({
      windows_out: true
    })
    this.onShow_b();
  },
  // 购物车减商品

  sub_shop: function(e) {
    var that = this
    var index = e.currentTarget.dataset.index;
    var commodity_id = e.currentTarget.dataset.commodity_id;
    // console.log(index, '减');
    var comm_num = e.currentTarget.dataset.comm_num;
    comm_num--;
    var list = this.data.shop_lists;
    for (var i = 0; i < list.length; i++) {
      if (list[i].commodity_id == commodity_id) {
        this.data.shop_lists[i].comm_num = comm_num;
      }
    }
    //this.data.shop_lists[index].comm_num = comm_num;
    this.data.buy[index].comm_num = comm_num;
    if (comm_num < 1) {
      this.data.buy.splice(index, 1);
    }
    this.setData({
      shop_lists: this.data.shop_lists,
      buy: this.data.buy,
    });
    var sum = that.data.sum;
    console.log(sum, 999);
    var c_shop_sum = sum.c_shop_sum;
    c_shop_sum--;
    sum.c_shop_sum = c_shop_sum;
    var price = e.currentTarget.dataset.price;
    sum.c_price_sum = (parseFloat(sum.c_price_sum) - parseFloat(price)).toFixed(2);
    this.setData({
      sum: sum
    });
    var commodity_id = e.currentTarget.dataset.commodity_id;
    var c_user_id = (wx.getStorageSync('c_user_id'));
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/commodity/addCart`,
      data: {
        commodity_id: commodity_id,
        type: 0,
        c_user_id: that.data.c_user_id
      },
      success: function(res) {
        // that.onShow_c()
      }
    })


  },
  // 购物车加商品
  add_shop: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var commodity_id = e.currentTarget.dataset.commodity_id;
    var comm_num = e.currentTarget.dataset.comm_num;
    comm_num++;
    var list = this.data.shop_lists;
    for (var i = 0; i < list.length; i++) {
      if (list[i].commodity_id == commodity_id) {
        console.log(i, 6666);
        this.data.shop_lists[i].comm_num = comm_num;
      }
    }
    this.data.buy[index].comm_num = comm_num;
    this.setData({
      shop_lists: this.data.shop_lists,
      buy: this.data.buy
    });

    var sum = that.data.sum;
    console.log(sum, 999);
    var c_shop_sum = sum.c_shop_sum;
    c_shop_sum++;
    sum.c_shop_sum = c_shop_sum;
    var price = e.currentTarget.dataset.price;
    sum.c_price_sum = (parseFloat(sum.c_price_sum) + parseFloat(price)).toFixed(2);
    this.setData({
      sum: sum
    });
    var c_user_id = (wx.getStorageSync('c_user_id'));
    var commodity_id = e.currentTarget.dataset.commodity_id;
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/commodity/addCart`,
      data: {
        commodity_id: commodity_id,
        type: 1,
        c_user_id: c_user_id
      },
      success: function(res) {
        // that.onShow_c()
      }
    })
  },


  clear_shop: function() {
    var that = this
    var c_user_id = (wx.getStorageSync('c_user_id'));
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/commodity/deleteCart`,
      data: {
        c_user_id: c_user_id
      },
      success: function(res) {
        that.onShow_a()
        that.onShow_b()
        that.onShow_c()
        that.setData({
          windows_out: false
        })

      }

    })
  },

  //分类列表减商品
  reduce: function(e) {
    var that = this
    var index = e.currentTarget.dataset.index;
    console.log(index, '减');
    var comm_num = e.currentTarget.dataset.comm_num;
    comm_num--;
    this.data.shop_lists[index].comm_num = comm_num;

    var sum = that.data.sum;
    console.log(sum, 999);
    var c_shop_sum = sum.c_shop_sum;
    c_shop_sum--;
    sum.c_shop_sum = c_shop_sum;
    var price = e.currentTarget.dataset.price;
    sum.c_price_sum = (parseFloat(sum.c_price_sum) - parseFloat(price)).toFixed(2);
    this.setData({
      shop_lists: this.data.shop_lists,
      sum: sum
    });
    var commodity_id = e.currentTarget.dataset.commodity_id;
    var c_user_id = (wx.getStorageSync('c_user_id'));
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/commodity/addCart`,
      data: {
        commodity_id: commodity_id,
        type: 0,
        c_user_id: c_user_id
      },
      success: function(res) {
        //that.onShow_c()
      }
    })

  },
  //分类列表加商品
  add: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    console.log(index, '加');
    var comm_num = e.currentTarget.dataset.comm_num;
    comm_num++;
    this.data.shop_lists[index].comm_num = comm_num;

    var sum = that.data.sum;
    console.log(sum, 999);
    var c_shop_sum = sum.c_shop_sum;
    c_shop_sum++;
    sum.c_shop_sum = c_shop_sum;
    var price = e.currentTarget.dataset.price;
    sum.c_price_sum = (parseFloat(sum.c_price_sum) + parseFloat(price)).toFixed(2);
    this.setData({
      shop_lists: this.data.shop_lists,
      sum: sum
    });
    var commodity_id = e.currentTarget.dataset.commodity_id;
    var c_user_id = (wx.getStorageSync('c_user_id'));
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/commodity/addCart`,
      data: {
        commodity_id: commodity_id,
        type: 1,
        c_user_id: c_user_id
      },
      success: function(res) {
        // that.onShow_c()
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
  onUnload: function() {},

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