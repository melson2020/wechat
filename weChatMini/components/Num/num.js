Component({  
  options: {  
    multipleSlots: true // 在组件定义时的选项中启用多slot支持  
  },  
  /** 
   * 组件的属性列表 
   */  
  properties: {  
    height:{
      type: String,
      value:'80rpx'
    },
    width:{
      type: String,
      value:'80rpx'
    },
    courseCount:{
      type:Number,
      value:0
    },
    minusStatus:{
      type:Boolean,
      value:true
    },
    itemId:{
      type:Number,
      value:-1
    }
  },  
  /** 
   * 组件的初始数据 
   */  
  data: {  
    toastShow:false,
    courseCount:1,
    minusStatus:true  
  },  

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    // attached: function (option) {
    //   var that=this
    //   console.log('index',that.properties.index)
    //  },
  },
  /** 
   * 组件的方法列表 
   */  
  methods: {  
    countNum:function (option) {
       var that=this
       var type = option.currentTarget.dataset.type
       var num = that.data.courseCount
       if (type == 1) {
         if (num > 1) {
           num -= 1
         }
       }
       if (type == 2) {
         num += 1
       }
       that.setData({'courseCount':num})
       this.triggerEvent('numChangeEvent',{'number':num,'id':that.properties.itemId})
    }
  }  
})  