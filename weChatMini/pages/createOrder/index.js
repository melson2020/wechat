const app = getApp()
var floatObj=require('../../utils/floatObj.js')
Page({
  data: {
    checkedShoppingCartList:[],
    totalPrice:0.0
  },
  onLoad: function(option){
    var that=this
    const eventChannel = this.getOpenerEventChannel()
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', function(data) {
      let list=data.list
      let totalPrice=that.SumTotalPrice(list)
      that.setData({'checkedShoppingCartList':list,'totalPrice':totalPrice})
    })
  },
  SumTotalPrice:function name(list) {
    let totalPrice=0.0
    for(let i=0;i<list.length;i++){
      totalPrice=floatObj.add(list[i].priceTotal,totalPrice)
    }
    return totalPrice
  }
})