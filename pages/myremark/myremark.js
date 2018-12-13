var that;
Page({
  data: {
   
  },
  onLoad: function (options) {
    
  },
  onShow:function(){
    
    
  },
  formSubmit:function(e){
    var that = this;
    var value = e.detail.value;
    console.log(value.remark);
    wx.redirectTo({
      url: '../create_order/create_order?remark=' + value.remark,
    })
  }

  

})
