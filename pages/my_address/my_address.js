Page({

  /**
   * 页面的初始数据
   */
  data: {
    address_left:[],
     windows_out: false, //弹出层
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    
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
    var c_user_id = (wx.getStorageSync('c_user_id'));
    that.setData({
      c_user_id: c_user_id
    })
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/user/getAddressList`,
      data: {
        c_user_id: c_user_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success:function(res){
        
        //var address_left = []
        var newaddress_left = res.data.data;
        //address_left.push(newaddress_left);
        //console.log(address_left, 111)
        that.setData({
          address_left: newaddress_left
        })
      }
  })
  },
  // 新增地址
  addAddress:function(){
    wx.navigateTo({
      url: '../add_address/add_address',
    })
  },
  // 修改地址
  editAddress:function(e){
    var param = e.currentTarget.dataset.address_id;
    wx.navigateTo({
      url: '../add_address/add_address?address_id=' + param,
    })
  },
  //删除地址
  delAddress:function(e){
   var that=this
    console.log(e.currentTarget.dataset.address_id,999)
    if (e.currentTarget.dataset.status==1){
wx.showModal({
  title: '提示',
  content: '该地址为默认地址，不可删除',
})
    }else{
      wx.showModal({
        title: '提示',
        content: '确认要删除吗',
        success: function (sm) {
          if (sm.confirm) {
            wx.request({
              url: `${getApp().globalData.baseUrl}/wechat/user/deleteAddress`,
              data: {
                address_id: e.currentTarget.dataset.address_id
              },
              success: function (res) {

                console.log(res.data);
                that.onShow()
              }

            })
          } else if (sm.cancel) {

          }

        }
      })
    }
 
    
   
  },
  //单选框
  setDefault:function(e){
var that=this;
    console.log(e.detail.value);
wx.request({
  url: `${getApp().globalData.baseUrl}/wechat/user/updateStatus`,
  data: {
    address_id: e.detail.value,
    c_user_id: that.data.c_user_id
  },

  success:function(res){
    that.onShow()
  }
})
   
  },
  // setDefaultStyle(list, id) {
 
  //   list.forEach((itm) => {
   
  //     if (itm) {
      
  //       itm.items.is_default = +itm.address_id === id;
      
  //       itm.items.iconType = itm.items.is_default ? 'success' : 'circle';
     
  //       itm.items.iconColor = itm.items.iconType === 'success' ? '#FF2D4B' : '';
      
  //     }
    
  //   });
  
  // },

  // setDefault(event) {
  //   const checkedId = +event.currentTarget.dataset.valueId || +event.detail.value;
  //   let setFlag = false;
  //   resource.loadingToast();
  //   resource.setDefaultAddress(checkedId).then((res) => {
  //     if (res.statusCode === 200) {  
  //       setFlag = true;       
  //       this.setDefaultStyle(this.data.address_left, checkedId);      
  //       this.setData({ address_left: this.data.address_left });      
  //     } else {      
  //       setFlag = false;      
  //     }     
  //     return setFlag;     
  //   }).then((flag) => {     
  //     if (flag) {       
  //       wx.showToast({
  //       title: '默认地址设置成功', 
  //         icon: 'success'
  //       });      
  //     } else {      
  //       // wx.failToast();      
  //     }   
  //   });  
  // },

  //弹出层
  // closemask: function () {
  //   this.setData({
  //     windows_out: false
  //   })
  // },
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