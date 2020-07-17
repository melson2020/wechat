//index.js
//获取应用实例
const app = getApp()
const http = app.myRequest()
Page({
  data: {
    picRealPixel: {},
    pageA: '',
    pageB: '',
    pageC: '',
    pageD: '',
    pageE: '',
    pageF: '',
    canvas: {},
    canvasInited: false,
    ctx: {},
    boxModule: {
      length: 320,
      width: 180,
      height: 160
    }, //单位rpx
    boxModulePhixel: {},
    baseArea: 700, //单位rpx
    piclist: [],
    hasLogin: false
  },

  onShow: function () {
    var that = this
    let login = that.checkLoginStatus()
    console.log(login)
    if (login) {
      that.initCanvas()
      if (that.data.piclist.length <= 0) {
        var token = wx.getStorageSync('token')
        http.postRequest('/diy/picList', {
          token: token,
        }).then((res) => {
          if (res.data.resultStatus === 1) {
            var restunList = res.data.data
            var newPic = that.filterPicList(restunList);
            if (newPic) {
              restunList.push(newPic)
            }
            that.setData({
              'piclist': restunList
            })
          }
        }).catch((exception) => {
          console.log('获取图片列表exception', exception)
        })
      }
    }
  },

  goLogin:function name(params) {
    wx.switchTab({
       url: '../userCenter/index',
       success: (res) => {
          console.log('转跳至用户页面', res)
       }
    })
 },

  checkLoginStatus: function () {
    let that = this;
    let userInfo = app.globalData.userInfo
    let token=wx.getStorageSync('token')
    let res=token&&userInfo
    that.setData({
      'hasLogin': res
    })
    return res
  },

  filterPicList: function (piclist) {
    if (piclist.length < 6) {
      var newPic = {
        'isNew': true,
        'id': '0'
      }
      return newPic;
    }
    return undefined;
  },

  initCanvas: function () {
    //获取canvas 对象
    var that = this;
    if (!that.data.canvasInited) {
      //初始化底层canvas 并且画出第一张图
      that.initCanvasImage()
      that.initCanvasLayer()
      that.setData({'canvasInited':true})
    }
  },

  initCanvasImage: function () {
    var that = this;
    const query = wx.createSelectorQuery()
    //初始化canvas
    query.select('#cutImg').fields({
        node: true,
        size: true
      })
      .exec((res) => {
        const canvas = res[0].node
        const ctx = canvas.getContext('2d')
        //设置canvas 的实际像素值
        canvas.width = res[0].node._width;
        canvas.height = res[0].node._height;
        this.setData({
          'picRealPixel': {
            width: res[0].node._width,
            height: res[0].node._height
          }
        })
        //设置canvas context的图片缩放比
        ctx.scale(1, 1)
        that.setData({
          canvas,
          ctx
        })
        //设置canvas 结束，开始计算剪切模型实际像素值
        that.computeModulePhixel()
        var firstpic = that.data.piclist.length >= 2 ? that.data.piclist[0] : undefined
        console.log(firstpic)
        if (firstpic) {
          console.log('画出第一张图')
          that.drawPic(firstpic.host + firstpic.path)
        }
      })
  },
  initCanvasLayer: function () {
    var that = this
    const query = wx.createSelectorQuery()
    //初始化canvas
    query.select('#layer').fields({
        node: true,
        size: true
      })
      .exec((res) => {
        const canvas = res[0].node
        const ctx = canvas.getContext('2d')
        //设置canvas 的实际像素值
        canvas.width = res[0].node._width;
        canvas.height = res[0].node._height;
        //设置canvas context的图片缩放比
        ctx.scale(1, 1)
        that.drawCutModule(ctx)
      })
  },

  loadPicToDesgin: function (option) {
    var that = this;
    var imageId = option.currentTarget.id;
    var imageSrc = that.data.piclist.filter((item) => {
      return item.id == imageId
    })
    console.log('click edit button', imageSrc[0].host + imageSrc[0].path)
    that.drawPic(imageSrc[0].host + imageSrc[0].path)
  },
  addPicture: function () {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        wx.getStorage({
          key: 'token',
          success: (token) => {
            wx.uploadFile({
              url: 'http://192.168.43.209:8080/wechatMini/upload/picture',
              filePath: tempFilePaths[0],
              name: 'file',
              formData: {
                'user': token.data
              },
              success(res) {
                const data = JSON.parse(res.data)
                console.log('上传成功', data)
                if (data.resultStatus === 1) {
                  var newp = data.data
                  var picList = that.data.piclist;
                  var length = picList.length;
                  var realLength = length - 1
                  if (realLength >= 5) {
                    picList.splice(realLength, 1, newp)
                  } else {
                    picList.splice(realLength, 0, newp)
                  }
                  that.setData({
                    'piclist': picList
                  })
                }
              }
            })
          }
        })
      }
    })
  },

  deletePic: function (option) {
    var that = this
    var itemId = option.currentTarget.id;
    var item = that.data.piclist.filter((item) => {
      return item.id === itemId
    })[0]
    var token = wx.getStorageSync('token')
    http.postRequest('/upload/deletePic', {
      'token': token,
      data: item
    }).then((res) => {
      if (res.data.resultStatus === 1) {
        var piclist = that.data.piclist;
        var index = piclist.indexOf(item)
        piclist.splice(index, 1)
        if (piclist.length < 6 && (piclist.filter((item) => {
            return item.isNew
          })).length <= 0) {
          piclist.push({
            'isNew': true,
            'id': '0'
          })
        }
        that.setData({
          'piclist': piclist
        })
      }
    }).catch((error) => {
      console.log('抓取到错误', error)
    })
  },

  //同一个canvas 连续画出图片和模型
  draw: function (path) {
    var that = this
    that.drawPic(path).then(function () {
      that.drawCutModule()
    }).catch((msg) => {
      console.log('画图失败', msg)
    })
  },

  drawPic: function (path) {
    var that = this
    var canvas = that.data.canvas
    var ctx = that.data.ctx
    console.log('drawPic 的canvas 对象', canvas)
    return new Promise(function (resolve, reject) {
      wx.getImageInfo({
        src: path,
        success: (res) => {
          let image = canvas.createImage(); // 创建一个图片对象
          image.src = path // 图片对象地址赋值
          image.onload = () => {
            //将图片填充满canvas 图片实际长宽为 res.width res.height  drawImage的长宽和图片不一致时，会自动缩放
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
            resolve()
          }
        },
        fail: (msg) => {
          reject(msg)
        }
      })
    })
  },

  //计算出模型的像素尺寸，并且存至缓冲区
  computeModulePhixel: function () {
    var that = this;
    var marginLeftAndRight = (that.data.baseArea - that.data.boxModule.height * 2 - that.data.boxModule.length) / 2;
    var marginTopAndBottom = (that.data.baseArea - that.data.boxModule.height * 2 - that.data.boxModule.width * 2) / 2
    console.log('左右边距：：：', marginLeftAndRight)
    console.log('上下边距：：：', marginTopAndBottom)
    let img_w = that.data.picRealPixel.width,
      img_h = that.data.picRealPixel.height;
    console.log('canvas 像素尺寸', img_w, img_h)
    let rateHeight = (1 / that.data.baseArea) * img_h,
      rateWidth = (1 / that.data.baseArea) * img_w;
    var boxModulePhixel = {
      length: that.data.boxModule.length * rateWidth,
      width: that.data.boxModule.width * rateHeight,
      height: that.data.boxModule.height * rateHeight,
      marginLeftAndRight: marginLeftAndRight * rateWidth,
      marginTopAndBottom: marginTopAndBottom * rateHeight
    }
    that.setData({
      'boxModulePhixel': boxModulePhixel
    })
    console.log('模型的像素尺寸为', boxModulePhixel)
  },

  drawCutModule: function (context) {
    var that = this;
    // var context = that.data.ctx;
    var modulePhixel = that.data.boxModulePhixel;
    //设置画笔粗细
    context.lineWidth = 0.8
    context.strokeStyle = "#ff0000";
    context.fillStyle = "rgba(238,86,16,0.15)";
    context.setLineDash([2, 3])
    var pointStart1 = {
      x: modulePhixel.marginLeftAndRight + modulePhixel.height,
      y: modulePhixel.marginTopAndBottom
    }
    var pointStart2 = {
      x: modulePhixel.marginLeftAndRight,
      y: modulePhixel.marginTopAndBottom + modulePhixel.height
    }
    console.log('起始点', pointStart1)
    //画出长方形及其边框
    context.strokeRect(pointStart1.x, pointStart1.y, modulePhixel.length, modulePhixel.height * 2 + modulePhixel.width * 2)
    context.fillRect(pointStart1.x, pointStart1.y, modulePhixel.length, modulePhixel.height * 2 + modulePhixel.width * 2)
    context.strokeRect(pointStart2.x, pointStart2.y, modulePhixel.length + modulePhixel.height * 2, modulePhixel.width)
    context.fillRect(pointStart2.x, pointStart2.y, modulePhixel.height, modulePhixel.width)
    context.fillRect(pointStart2.x + modulePhixel.length + modulePhixel.height, pointStart2.y, modulePhixel.height, modulePhixel.width)
    context.moveTo(pointStart1.x, pointStart1.y + modulePhixel.height * 2 + modulePhixel.width)
    context.lineTo(pointStart1.x + modulePhixel.length, pointStart1.y + modulePhixel.height * 2 + modulePhixel.width)
    context.stroke();
  },

  cutPic: function () { // 通过button点击事件触发后面的函数
    var that = this;
    //旋转3D 模型至原点
    that.selectComponent('#swipertd').setModuleToOrigin();
    that.cutPage();
  },

  cutPage: function (value) {
    var that = this;
    var marginLeftAndRight = (that.data.baseArea - that.data.boxModule.height * 2 - that.data.boxModule.length) / 2;
    var marginTopAndBottom = (that.data.baseArea - that.data.boxModule.height * 2 - that.data.boxModule.width * 2) / 2
    console.log('左右边距：：：', marginLeftAndRight)
    let img_w = that.data.picRealPixel.width,
      img_h = that.data.picRealPixel.height;
    let rateHeight = (1 / that.data.baseArea) * img_h,
      rateWidth = (1 / that.data.baseArea) * img_w;
    var ponitA = {
      x: (that.data.boxModule.height + marginLeftAndRight) * rateWidth,
      y: marginTopAndBottom * rateHeight
    }
    var boxModulePhixel = {
      length: that.data.boxModule.length * rateWidth,
      width: that.data.boxModule.width * rateHeight,
      height: that.data.boxModule.height * rateHeight
    }
    //裁剪pageA
    //canvasToTempFilePath 为异步操作， 写在同步操作中，调用会有问题，此程序在canvasToTempFilePath 成功后再次调用
    wx.canvasToTempFilePath({
      x: ponitA.x,
      y: ponitA.y,
      width: boxModulePhixel.length,
      height: boxModulePhixel.height,
      destWidth: boxModulePhixel.length,
      destHeight: boxModulePhixel.height,
      canvas: that.data.canvas,
      success: function (res) {
        console.log('pageA', res.tempFilePath)
        that.setData({
          pageA: res.tempFilePath
        })
        //裁剪pageA成功裁剪PageB
        var ponitB = {
          x: ponitA.x - boxModulePhixel.height,
          y: ponitA.y + boxModulePhixel.height
        }
        wx.canvasToTempFilePath({
          x: ponitB.x,
          y: ponitB.y,
          width: boxModulePhixel.height,
          height: boxModulePhixel.width,
          destWidth: boxModulePhixel.height,
          destHeight: boxModulePhixel.width,
          canvas: that.data.canvas,
          success: function (res) {
            console.log('pageB', res.tempFilePath)
            that.setData({
              pageB: res.tempFilePath
            })
            //裁剪pageB 成功 裁剪pageE
            var pointE = {
              x: ponitA.x,
              y: ponitB.y
            }
            wx.canvasToTempFilePath({
              x: pointE.x,
              y: pointE.y,
              width: boxModulePhixel.length,
              height: boxModulePhixel.width,
              destWidth: boxModulePhixel.length,
              destHeight: boxModulePhixel.width,
              canvas: that.data.canvas,
              success: function (res) {
                console.log('pageE', res.tempFilePath)
                that.setData({
                  pageE: res.tempFilePath
                })
                //裁剪pageE 成功 裁剪pageD
                var pointD = {
                  x: pointE.x + boxModulePhixel.length,
                  y: pointE.y
                }
                wx.canvasToTempFilePath({
                  x: pointD.x,
                  y: pointD.y,
                  width: boxModulePhixel.height,
                  height: boxModulePhixel.width,
                  destWidth: boxModulePhixel.height,
                  destHeight: boxModulePhixel.width,
                  canvas: that.data.canvas,
                  success: function (res) {
                    console.log('pageD', res.tempFilePath)
                    that.setData({
                      pageD: res.tempFilePath
                    })
                    //裁剪pageD 成功 裁剪pageC
                    var pointC = {
                      x: pointE.x,
                      y: pointE.y + boxModulePhixel.width
                    }
                    wx.canvasToTempFilePath({
                      x: pointC.x,
                      y: pointC.y,
                      width: boxModulePhixel.length,
                      height: boxModulePhixel.height,
                      destWidth: boxModulePhixel.length,
                      destHeight: boxModulePhixel.height,
                      canvas: that.data.canvas,
                      success: function (res) {
                        console.log('pageC', res.tempFilePath)
                        that.setData({
                          pageC: res.tempFilePath
                        })
                        //裁剪pageC 成功 裁剪pageF
                        var pointF = {
                          x: pointC.x,
                          y: pointC.y + boxModulePhixel.height
                        }
                        wx.canvasToTempFilePath({
                          x: pointF.x,
                          y: pointF.y,
                          width: boxModulePhixel.length,
                          height: boxModulePhixel.width,
                          destWidth: boxModulePhixel.length,
                          destHeight: boxModulePhixel.width,
                          canvas: that.data.canvas,
                          success: function (res) {
                            console.log('pageF', res.tempFilePath)
                            that.setData({
                              pageF: res.tempFilePath
                            })

                          },
                          fail: function (res) {
                            console.log("导出失败 pageF", res)
                          }
                        })
                      },
                      fail: function (res) {
                        console.log("导出失败 pageC", res)
                      }
                    })
                  },
                  fail: function (res) {
                    console.log("导出失败 pageD", res)
                  }
                })
              },
              fail: function (res) {
                console.log("导出失败 pageE", res)
              }
            })
          },
          fail: function (res) {
            console.log("导出失败 pageB", res)
          }
        })
      },
      fail: function (res) {
        console.log("导出失败 pageA", res)
      }
    })
  }

})