//index.js
//获取应用实例
const app = getApp()
const http = app.myRequest()
// const base64=require("../../images/base64");
var floatObj=require('../../utils/floatObj.js')
Page({
   data: {
      shoppingCartList: [],
      hasItems: true,
      slideButtons: [{
         text: '删除',
         src: '/images/icons/delete.svg', // icon的路径 请写根目录下的绝对路径 由于应用组件 相对路径会有问题
       }],
      sumedPrice:0.0,
      checkedAll:false
   },

   onLoad:function () {
   //    this.setData({
   //       icon: base64.icon20
   //   });
   },

   onShow: function (options) {
      var that = this
      var token = wx.getStorageSync('token')
      http.postRequest('/shoppingCart/shoppingCartList', {
         token: token
      }).then((response => {
         if (response.data.resultStatus === 1) {
            let list = response.data.data;
            var hasItems=list.length>0
            if (list.length> 0) {
               that.setData({
                  'shoppingCartList': list,
               })
            } 
            that.setData({'hasItems':hasItems})
         that.SumCheckedTotalPrice()
         that.setCheckAll()
         }else{
            that.setData({'hasItems':false})
         }
      })).catch((msg) => {
         that.setData({'hasItems':false})
      })
   },

   goShopping: function () {
      wx.switchTab({
         url: '../shopCenter/index',
         success: (res) => {
            console.log('转跳至商店', res)
         }
      })
   },
   checkBoxClick:function (option) {
      var that=this
      var index=option.currentTarget.dataset.index
      let temp = 'shoppingCartList[' + index +'].checked'  // 获取shoppingCartList[index]
      that.setData({[temp]:!that.data.shoppingCartList[index].checked})
      that.setCheckAll()
      that.SumCheckedTotalPrice()
   },

   //设置全选按钮是否勾选
   setCheckAll:function () {
      var that=this
      let checkedAll=that.data.checkedAll
      let ischeckedAll=that.data.shoppingCartList.filter((item)=>{return item.checked===false}).length<=0
      if(!ischeckedAll===checkedAll){
         that.setData({'checkedAll':ischeckedAll})
      }
   },

   //计算所有已选项的总价
   SumCheckedTotalPrice:function name(params) {
      var that=this
      let checkedlist=that.data.shoppingCartList.filter((item)=>{
         return item.checked===true
      })
      var totalPrice=0.0;
      if(checkedlist.length>0){
         for(var i=0;i<checkedlist.length;i++){
            totalPrice=floatObj.add(totalPrice,checkedlist[i].priceTotal)
          }
      }
      that.setData({'sumedPrice':totalPrice})
   },

   numChanged:function(params) {
      var that=this
      var id=params.detail.id;
      var number=params.detail.number;
      let newlist=that.data.shoppingCartList.filter((item)=>{
         if(item.id===id){
            item.priceTotal=floatObj.multiply(item.price, number)
            item.number=number
            return item
         }    
      })
      let index=params.currentTarget.dataset.index
      let temp = 'shoppingCartList[' + index +']'  // 获取shoppingCartList[index]
      that.setData({[temp]:newlist[0]})
      that.SumCheckedTotalPrice()
   },
   checkAllChanged:function(option) {
       var that=this
       var checked=!that.data.checkedAll
       that.setData({'checkedAll':checked})
       var newlist=that.data.shoppingCartList.filter((item)=>{
          item.checked=checked
          return item
       })
       that.setData({'shoppingCartList':newlist})
       that.SumCheckedTotalPrice()
   },
   slideButtonTap:function(option) {
      console.log('删除',option.currentTarget)
      var that=this
      var token=wx.getStorageSync('token')
      http.postRequest('/shoppingCart/deleteShoppingCart',{'token':token,data:{id:option.currentTarget.id}}).then((response)=>{
         if(response.data.resultStatus===1){
            var index=option.currentTarget.dataset.index
            var list=that.data.shoppingCartList
            list.splice(index,1)
            var hasItems=list.length>0
            that.setData({'shoppingCartList':list,'hasItems':hasItems})
            that.SumCheckedTotalPrice()
         }else{
            console.log('出来报错',response.data.message)
         }
      }).catch((msg)=>{
         console.log('error',msg)
      })
   }
})