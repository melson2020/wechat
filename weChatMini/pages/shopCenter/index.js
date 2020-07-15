//index.js
//获取应用实例
const app = getApp()
const http = app.myRequest()
var floatObj=require('../../utils/floatObj.js')
Page({
  data: {
    selectedProd: {},
    selectedProdTotalPrice: 0.0,
    recommendList: [],
    productionList: [],
    num: 1,
    show:false,
    adding: false,
    buttons: [{
        className: 'halfScreenButton',
        text: '1',
        value: 0
      },
      {
        className: 'halfScreenButton',
        text: '2',
        value: 1
      }
    ]
  },
  onReady: function () {
    var that = this
    that.loadRecommendList()
    that.loadProductionList()
  },
  onShow:function(){
    var that=this
    that.setData({'show':false})
  },
  loadRecommendList: function () {
    let that = this
    http.getRequest('/product/recommendList').then((res) => {
      if (res.data.resultStatus === 1) {
        that.setData({
          'recommendList': res.data.data
        })
      }
    }).catch((msg) => {
      console.log('获取推荐列表报错', msg)
    })
  },
  loadProductionList: function () {
    let that = this
    http.getRequest('/product/allProductList').then((res) => {
      if (res.data.resultStatus === 1) {
        that.setData({
          'productionList': res.data.data
        })
      }
    }).catch((msg) => {

    })
  },
  edditShoppings: function (option) {
    var that = this
    var num = that.data.num
    var selectedId = option.currentTarget.id
    var selectedProds = that.data.productionList.filter((item) => {
      return item.id == selectedId
    })
    if (selectedProds.length >= 0) {
      let totalPrice = floatObj.multiply(selectedProds[0].price, num)
      that.setData({
        'show': true,
        'selectedProd': selectedProds[0],
        'selectedProdTotalPrice': totalPrice
      })
    }
  },
  checkNum: function (res) {
    var that = this
    var num = res.detail.value
    if (num <= 0 || num == "") {
      wx.showToast({
        title: '请输入正确的数量',
        icon: 'none'
      })
      that.setData({
        num: 1,
        'selectedProdTotalPrice': that.data.selectedProd.price
      })
    }
  },
  //获取输入数量
  getInputNum: function (res) {
    var that = this
    var num = res.detail.value
    let totalPrice = floatObj.multiply(that.data.selectedProd.price, num)
    that.setData({
      num: parseInt(num),
      'selectedProdTotalPrice': totalPrice
    })
  },
  //计算数量
  countNum: function (res) {
    var that = this
    var selectedProd = that.data.selectedProd
    var type = res.currentTarget.dataset.type
    var num = that.data.num
    if (type == 1) {
      if (num > 1) {
        num -= 1
      }
    }
    if (type == 2) {
      num += 1
    }
    // let totalPrice = selectedProd.price * num
   let totalPrice= floatObj.multiply(selectedProd.price, num)
    that.setData({
      num: num,
      'selectedProdTotalPrice': totalPrice
    })
  },
  close: function () {
    var that = this
    if (!that.data.adding) {
      that.setData({
        'show': false,
        'num': 1
      })
    }
  },
  addToShoppingCart: function () {
    var that = this
    if (that.data.adding) {
      console.log('添加中，无重复操作')
      return
    }
    console.log('开始添加')
    that.setData({
      'adding': true
    })
    var selectedProd = that.data.selectedProd
    var number = that.data.num;
    var totalPrice = that.data.selectedProdTotalPrice
    var token = wx.getStorageSync('token')
    http.postRequest('/product/saveShoppingCart', {
      'token': token,
      data: {
        'product': selectedProd,
        'number': number,
        'totalPrice': totalPrice
      }
    }).then((response) => {
      that.setData({
        'adding': false
      })
      if (response.data.resultStatus === 1) {
        wx.showToast({
          title: '添加成功',
          icon: 'success'
        })
      } else {
        wx.showToast({
          title: '添加失败',
          icon: 'error'
        })
      }
      that.setData({'show':false})
    }).catch((error) => {
      that.setData({
        'adding': false
      })
      wx.showToast({
        title: '抓取到错误',
        icon: 'false'
      })
    })
  },
})