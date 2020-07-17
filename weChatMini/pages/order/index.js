const app = getApp()

Page({
  data: {
    commodityList:[1,2,3,4,5],
    selectedId:''
  },
  onLoad: function(option){
    var that=this
    const eventChannel = this.getOpenerEventChannel()
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', function(data) {
      that.setData({'selectedId':data.id})
    })
  }
})