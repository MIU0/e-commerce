Page({

  /**
   * 页面的初始数据
   */
  data: {
    windows_out: false, //弹出层
    message: {
      name: '',
      phone: '',
      province: '',
      details_addr: ''
    },
    arr: [],
    currentSelect: 'F',
    mySelect: '0'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {


    var that = this;
    if (options.address_id) {
      that.setData({
        address_id: options.address_id
      });
    }

    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/user/getCityInfo`,
      data: {

      },
      success: function(res) {
        console.log(res.data);
        that.setData({
          provinces: res.data.data,
          value: [0, 0, 0]
        })
        wx.request({
          url: `${getApp().globalData.baseUrl}/wechat/user/getCityInfo`,
          data: {
            id: res.data.data[0].id,
            type: 2
          },
          success: function(res) {
            console.log(res.data);
            that.setData({
              citys: res.data.data
            })
            wx.request({
              url: `${getApp().globalData.baseUrl}/wechat/user/getCityInfo`,
              data: {
                id: res.data.data[0].id,
                type: 3
              },
              success: function(res) {
                console.log(res.data);
                that.setData({
                  areas: res.data.data
                })

              }
            })

          }
        })
      }
    })

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
    if (that.data.address_id) {

      wx.request({
        url: `${getApp().globalData.baseUrl}/wechat/user/getAddressById`,
        data: {
          address_id: that.data.address_id
        },
        success: function(res) {
          console.log(res.data.data, 9999);
          var areaInfo = res.data.data.province;
          that.setData({
            info: res.data.data,
            areaInfo: areaInfo,
            currentSelect: res.data.data.sex,
            mySelect: res.data.data.label
          })

        }
      })
    }



  },
  /**弹出层 */
  closemask: function(e) {
    this.setData({
      windows_out: false
    })
  },
  pup: function(e) {
    this.setData({
      windows_out: true
    })

    //this.getCityInfo();
  },

  getCityInfo: function() {
    // var that=this;
    // wx.request({
    //   url: '${getApp().globalData.baseUrl}/wechat/user/getCityInfo',
    //   data:{

    //   },
    //   success:function(res){
    //     console.log(res.data);
    //     that.setData({
    //       provinces: res.data.data
    //     })
    //   }
    // })
  },

  cityChange: function(e) {
    var value = e.detail.value
    var provinces = this.data.provinces
    var citys = this.data.citys
    var areas = this.data.areas
    var provinceNum = value[0]
    var cityNum = value[1]
    var countyNum = value[2]
    var that = this;
    // 如果省份选择项和之前不一样，表示滑动了省份，此时市默认是省的第一组数据，
    if (this.data.value[0] != provinceNum) {
      var id = provinces[provinceNum].id
      this.setData({
        value: [provinceNum, 0, 0]
      })
      wx.request({
        url: `${getApp().globalData.baseUrl}/wechat/user/getCityInfo`,
        data: {
          id: id,
          type: 2
        },
        success: function(res) {
          console.log(res.data);
          that.setData({
            citys: res.data.data
          });

          wx.request({
            url: `${getApp().globalData.baseUrl}/wechat/user/getCityInfo`,
            data: {
              id: res.data.data[0].id,
              type: 3
            },
            success: function(res) {
              console.log(res.data);
              that.setData({
                areas: res.data.data
              });

            }
          })
        }
      })


    } else if (this.data.value[1] != cityNum) {
      // 滑动选择了第二项数据，即市，此时区显示省市对应的第一组数据
      var id = citys[cityNum].id
      wx.request({
        url: `${getApp().globalData.baseUrl}/wechat/user/getCityInfo`,
        data: {
          id: id,
          type: 3
        },
        success: function(res) {
          console.log(res.data);
          that.setData({
            areas: res.data.data
          });

        }
      })
      this.setData({
        value: [provinceNum, cityNum, 0]
        // areas: address.areas[citys[cityNum].id],
      })
    } else {
      // 滑动选择了区
      this.setData({
        value: [provinceNum, cityNum, countyNum]
      })
    }
    console.log(this.data)

  },
  //确定
  citySure: function(e) {
    var that = this
    var city = that.data.city
    var value = that.data.value
    //that.startAddressAnimation(false)
    // 将选择的城市信息显示到输入框
    var areaInfo = that.data.provinces[value[0]].name + ',' + that.data.citys[value[1]].name + ',' + that.data.areas[value[2]].name
    // console.log(areaInfo);
    that.setData({
      areaInfo: areaInfo,
      windows_out: false
    })
  },

  // 点击地区选择取消按钮
  cityCancel: function(e) {
    this.setData({
      windows_out: false
    })
  },
  // 选择性别
  // 更新data 切换选中状态
  sexman: function(e) {
    this.setData({
      currentSelect: e.currentTarget.dataset.id
    })
    console.log(this.data.currentSelect, 777777)
  },
  sexwoman: function(e) {
    this.setData({
      currentSelect: e.currentTarget.dataset.id
    })
    console.log(this.data.currentSelect, 88888)
  },
  //选择标签
  home: function(e) {
    this.setData({
      mySelect: e.currentTarget.dataset.id
    })
    console.log(this.data.mySelect, 777777)
  },
  company: function(e) {
    this.setData({
      mySelect: e.currentTarget.dataset.id
    })
    console.log(this.data.mySelect, 777777)
  },
  school: function(e) {
    this.setData({
      mySelect: e.currentTarget.dataset.id
    })
    console.log(this.data.mySelect, 777777)
  },
  //提交
  formSubmit: function(e) {
    var that = this;
    const value = e.detail.value;
    var address_id = that.data.address_id;
    var phone = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!address_id) {
      address_id = '';
    }
    if (!phone.test(value.phone)) {
      wx.showModal({
        title: '提示',
        content: '手机号格式错误',
      })
      return false;
    }
    console.log(that.data.mySelect,8888);
    if (value.name && value.phone && value.province && value.details_addr) {
      wx.request({
        url: `${getApp().globalData.baseUrl}/wechat/user/saveAddress`,
        data: {
          'name': e.detail.value.name,
          'phone': e.detail.value.phone,
          'province': e.detail.value.province,
          'details_addr': e.detail.value.details_addr,
          'address_id': address_id,
          'sex': that.data.currentSelect,
          'label': that.data.mySelect,
          'c_user_id': that.data.c_user_id
        },
        success: function(res) {
          console.log(res.data.code);
          if (res.data.code == 200) {
            wx.showModal({
              title: '提示',
              content: '提交成功',
              showCancel: false,
              success: function(res) {
                wx.navigateBack();
              }
            })
          } else {
            wx.showModal({
              title: '提示',
              content: '提交异常',
              showCancel: true,
            })
          }

        }

      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请填写完整资料',
        showCancel: false
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