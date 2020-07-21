const app = getApp()
const http = app.myRequest()
var floatObj=require('../../utils/floatObj.js')
Page({
  data: {
    checkedShoppingCartList:[],
    totalPrice:0.0,
    deliveryInfo:{},
    hasdeliveryInfo:false,
    toptip: {},
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
  onShow:function() {
     let token=wx.getStorageSync('token')
     let that=this
     console.log('配送数据onshow')
     http.postRequest('/user/delivery',{'token':token}).then((response)=>{
      if(response.data.resultStatus===1){
         let info=response.data.data
         that.setData({'deliveryInfo':info,'hasdeliveryInfo':true})
      }
     }).catch((msg)=>{
      
     })
  },
  SumTotalPrice:function name(list) {
    let totalPrice=0.0
    for(let i=0;i<list.length;i++){
      totalPrice=floatObj.add(list[i].priceTotal,totalPrice)
    }
    return totalPrice
  },
  goLogin:function () {
    wx.switchTab({
      url: '../userCenter/index',
      success: (res) => {
         console.log('转跳至用户页面', res)
      }
   })
  },
  sumbit:function () {
    let that=this
    let toptip = {
      msg: '结算成功',
      type: 'info',
      show: true
   }
   that.setData({
      'toptip': toptip
   })
  }
})