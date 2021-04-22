// component/sliderColorPicker.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
      color:"#FFFFFF"
  },

  /**
   * 组件的方法列表
   */
  methods: {
    hexoToString(x){
      x = x.toString(16)
     if(x.length == 1){
       return "0"+x;
     }
     return x
   },
    moveSlider(e){
      let that = this
      let x = e.touches[0].x
      let y = e.touches[0].y
      if(x>=310){
        x = 310
      }
      if(x<=10){
        x =10
      }
      // console.log(x)
      let color = this.calcuColor(x,300)
      this.setData({
        color:color
      },()=>{
        that.triggerEvent('moveSlider', color)
      })
      // console.log(color)
      this.drawImageBase(x,11,color)
    },
//FF0000 -> FFFF00 ->00FF00 -> 00FFFF-> 0000FF -> FF00FF
//色带长度 length = 290
//当前滑动距离为  sliderLength = x
//每块色带距离是 perColorLength = length / 5
//滑动到的色带次序 order = sliderLength / perColorLength 取整
//滑动到当前色带的距离 relLength = sliderLength % perColorLength 取余
// relLength_tmp = 255 - relLength 减少量
//x = 255*relLength/perColorLength  十进制数 

// order 0  FF0000 -> FFFF00
// order 1  FFFF00 ->00FF00
// order 2  00FF00 -> 00FFFF
// order 3   00FFFF-> 0000FF
// order 4   0000FF -> FF00FF
    calcuColor(cur,length){
      //255 计算一个速率  从0 - 255
      let sliderLength = cur - 10; //当前滑动距离为
      let perColorLength = parseInt(length / 5);  //每块色带距离是
      let order = parseInt(sliderLength / perColorLength); //滑动到的色带次序
      let relLength =   parseInt(sliderLength % perColorLength); //滑动到当前色带的距离
      let x = parseInt(255*relLength/perColorLength); // 十进制
      let x_tmp = 255 - x;
      let color = "#FF0000"
      switch(order){
        case 0:{
          color = "#FF0000"
          if(relLength = 0){
            return color;
          }
          color = "#FF"+ this.hexoToString(x) +"00"
          return color;
        }
        case 1:{
          color = "#FFFF00"
          if(relLength = 0){
            return color;
          }
          color = "#"+ this.hexoToString(x_tmp) +"FF00"
          return color;
        }
        case 2:{
          color = "#00FF00"
          if(relLength = 0){
            return color;
          }
          color = "#00FF"+ this.hexoToString(x)
          return color;
        }
        case 3:{
          color = "#00FFFF"
          if(relLength = 0){
            return color;
          }
          color = "#00"+ this.hexoToString(x_tmp) +"FF"
          return color;
        }
        case 4:{
          color = "#0000FF"
          if(relLength = 0){
            return color;
          }
          color = "#"+this.hexoToString(x)   +"00FF"
          return color;
        }
        default:{
          return "#FF00FF"
        }
      }
    },
    drawImageBase(x,y,color){
      //初始化方法
    const ctx = wx.createCanvasContext('slider',this);
    ctx.beginPath();
    // ctx.shadowOffsetX = 2; // 阴影Y轴偏移
    // ctx.shadowOffsetY = 2; // 阴影X轴偏移
    // ctx.shadowBlur = 2; // 模糊尺寸
    // ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'; // 颜色
    ctx.arc(x,y,8,0,2*Math.PI);
    let strokeColor =  color
    if(color == "#FFFFFF"){
      strokeColor = "grey"
      color = "grey"
    }
    ctx.fillStyle = color;//设置填充颜色
    ctx.fill();//开始填充
  
    ctx.strokeStyle= strokeColor;//将线条颜色设置为蓝色
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    // Create linear gradient
    const grd = ctx.createLinearGradient(10,10, 300, 0)
    grd.addColorStop(0, '#FF0000')
    grd.addColorStop(0.2, '#FFFF00')
    grd.addColorStop(0.4, '#00FF00')
    grd.addColorStop(0.6, '#00FFFF')
    grd.addColorStop(0.8, '#0000FF')
    grd.addColorStop(1, '#FF00FF')
    // Fill with gradient
    ctx.setFillStyle(grd);//将渐变色渲染入正方形
    ctx.fillRect(10, 10, 300, 2);//起点坐标为（20，20），长宽都为120px的正方形
    ctx.closePath();
    ctx.draw();
    }
  },
  attached(){
    //初始化方法
    this.drawImageBase(10,11,"#FF0000")
  }
 
})
