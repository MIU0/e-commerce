Page({

  /**
   * 页面的初始数据
   */
  data: {
    windows_out:false,   //弹出层
    shop_details_img:[
      '../../images/store/order1.png',
      '../../images/store/order1.png',
      '../../images/store/order1.png'
    ],
    indicatorDots: true,
    autoplay: false,
    interval: 3000,
    duration: 1000,
    shop_details:[],
    shop_content_details:[],
    windows_out: false, //弹出层
    buy: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.setData({
      commodity_id: options.url
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
    var c_user_id = (wx.getStorageSync('c_user_id'));
    this.setData({
      c_user_id: c_user_id
    })
    var that = this;   
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/commodity/getCommodityById`,
      data:{
        commodity_id: that.data.commodity_id,
        c_user_id: that.data.c_user_id
      },
      header:{
        'content-type': 'application/json'
      },
      success: function (res){
        var shop_details=[]
        var shop_content_details=[]
        var new_shop_details = res.data.data
         shop_details.push(new_shop_details);
        console.log(shop_details,9999)
        var photoList = new_shop_details.photoList;
        var headList=[];
        var textList=[];
        if(photoList){
          for(var i=0,len=photoList.length;i<len;i++){
            if (photoList[i].img_type=='0'){
              headList.push(photoList[i]);
            }else{
              textList.push(photoList[i]);
            }
          }
        }
        // console.log(headList,2212);
        // console.log(textList, 3333);
        that.setData({
          shop_details: shop_details,
          shop_details_img: headList,
          shop_content_details: textList
        })
        that.onShow_c()      
      }
    })
  },
  //查询购物车接口
  onShow_b: function () {
    var that = this;

    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/commodity/getShopCartList`,
      data: {
        c_user_id: that.data.c_user_id
      },
      header: {
        'content-type': 'application/json'  // 默认值
      },
      success: function (res) {
        var buy = [];
        var new_buy = res.data.data;
        // console.log(new_buy.cartList,88888)
        that.setData({
          buy: new_buy.cartList,
        })
      }
    })
  },
  //购物车总量
  onShow_c: function () {
    var that = this;
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/commodity/getUserShopCartSum`,
      data: {
        c_user_id: that.data.c_user_id
      },
      header: {
        'content-type': 'application/json'  // 默认值
      },
      success: function (res) {
        var new_sum = res.data.data;
        var c_shop_sum = new_sum.c_shop_sum;
        that.setData({
          sum: new_sum,
        })

      }
    })
  },
  // 购物车减商品

  sub_shop: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index;
    var commodity_id = e.currentTarget.dataset.commodity_id;
    // console.log(index, '减');
    var comm_num = e.currentTarget.dataset.comm_num;
    comm_num--;
    var list = this.data.shop_details;
    for (var i = 0; i < list.length; i++) {
      if (list[i].commodity_id == commodity_id) {
        this.data.shop_details[i].comm_num = comm_num;
      }
    }
    //this.data.shop_lists[index].comm_num = comm_num;
    this.data.buy[index].comm_num = comm_num;
    if (comm_num < 1) {
      this.data.buy.splice(index, 1);
    }
    this.setData({
      shop_details: this.data.shop_details,
      buy: this.data.buy,
    });
    var commodity_id = e.currentTarget.dataset.commodity_id;
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/commodity/addCart`,
      data: {
        commodity_id: commodity_id,
        type: 0,
        c_user_id: that.data.c_user_id
      },
      success: function (res) {
        that.onShow_c(),
        that.onShow()
      }
    })


  },
  // 购物车加商品
  add_shop: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var commodity_id = e.currentTarget.dataset.commodity_id;
    // console.log(index,'加');    
    //var comm_num=e.currentTarget.dataset.comm_num;
    var comm_num = e.currentTarget.dataset.comm_num;
    //comm_num++;
    comm_num++;
    var list = this.data.shop_details;
    for (var i = 0; i < list.length; i++) {
      if (list[i].commodity_id == commodity_id) {
        console.log(i, 6666);
        this.data.shop_details[i].comm_num = comm_num;
      }
    }
    //this.data.shop_lists[index].comm_num = comm_num;
    this.data.buy[index].comm_num = comm_num;
    //console.log(count);
    this.setData({
      shop_details: this.data.shop_details,
      buy: this.data.buy
    });
    var commodity_id = e.currentTarget.dataset.commodity_id;
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/commodity/addCart`,
      data: {
        commodity_id: commodity_id,
        type: 1,
        c_user_id: that.data.c_user_id
      },
      success: function (res) {
        that.onShow_c(),
          that.onShow()
      }
    })
  },
  clear_shop: function () {
    var that = this
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/commodity/deleteCart`,
      data: {
        c_user_id: that.data.c_user_id
      },
      success: function (res) {
        that.onShow_b()
        that.onShow_c()
        that.setData({
          windows_out: false
        })

      }

    })
  },

  // 去买单
  create_order:function(){
    wx.navigateTo({
      url: '../create_order/create_order',
    })
  },
  preventTouchMove: function () {
    
  },
  closemask:function(){
    this.setData({
      windows_out: false
    })
  },
  // 弹出层
  popup: function () {
    this.setData({
      windows_out: true
    })
    this.onShow_b();
  },
  //分类列表减商品
  reduce: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index;
    console.log(index, '减');
    var cart_num = e.currentTarget.dataset.cart_num;
    cart_num--;
    this.data.shop_details[index].cart_num = cart_num;
    this.setData({
      shop_details: this.data.shop_details,
    });
    var commodity_id = e.currentTarget.dataset.commodity_id;
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/commodity/addCart`,
      data: {
        commodity_id: commodity_id,
        type: 0,
        c_user_id: that.data.c_user_id
      },
      success: function (res) {
        that.onShow_c()
          //that.onShow()
      }

    })

  },
  add: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    console.log(index, '加');
    var cart_num = e.currentTarget.dataset.cart_num;
    console.log(cart_num);
    cart_num++;
    this.data.shop_details[index].cart_num = cart_num;
    this.setData({
      shop_details: this.data.shop_details,
    });
    var commodity_id = e.currentTarget.dataset.commodity_id;

    wx.request({

      url: `${getApp().globalData.baseUrl}/wechat/commodity/addCart`,
      data: {
        commodity_id: commodity_id,
        type: 1,
        c_user_id: that.data.c_user_id
      },
      success: function (res) {
        that.onShow_c()
        //that.onShow()
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