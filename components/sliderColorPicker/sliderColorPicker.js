// component/sliderColorPicker.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
  // 此处为页面传值进来的数据存储位置
  //彩色线条长度
    lineLength:{
        type:Number, //此处可以规定值的类型
        value: '300' //此处可以设置默认值,如果不传值则为默认值
      },
      sliderBtn:{
        type:Number, //此处可以规定值的类型
        value: '8' //此处可以设置默认值,如果不传值则为默认值
      }
  },

  /**
   * 组件的初始数据
   */
  data: {
      color:"#FFFFFF",
      headX:12
  },

  /**
   * 组件的方法列表
   */
  methods: {
    hexoToString(x){
      x = x.toString(16).toUpperCase()
     if(x.length == 1){
       return "0"+x;
     }
     return x
   },
    moveSlider(e){
      let that = this
      let x = e.touches[0].x
      let y = e.touches[0].y
      
      if(x>=this.data.lineLength + this.data.headX ){
        x = this.data.lineLength + this.data.headX
      }
      if(x<=this.data.headX){
        x =this.data.headX
      }
      // console.log(x)
      let color = this.calcuColor(x,this.data.lineLength)
      this.setData({
        color:color
      },()=>{
        that.triggerEvent('moveSlider', color)
      })
      // console.log(color)
      this.drawImageBase(x,this.data.headY,color)
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
      let sliderLength = cur - this.data.headX; //当前滑动距离为
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
      ctx.arc(x,y,this.data.sliderBtn,0,2*Math.PI);
      let strokeColor =  color

      ctx.fillStyle = color;//设置填充颜色
      ctx.fill();//开始填充
    
      ctx.strokeStyle= strokeColor;//将线条颜色设置为蓝色
      ctx.stroke();
      ctx.closePath();
      ctx.beginPath();
      // Create linear gradient
      const grd = ctx.createLinearGradient(this.data.headX,this.data.headY, this.data.lineLength,10)
      grd.addColorStop(0, '#FF0000')
      grd.addColorStop(0.2, '#FFFF00')
      grd.addColorStop(0.4, '#00FF00')
      grd.addColorStop(0.6, '#00FFFF')
      grd.addColorStop(0.8, '#0000FF')
      grd.addColorStop(1, '#FF00FF')
      // Fill with gradient
      ctx.setFillStyle(grd);//将渐变色渲染入正方形
      ctx.fillRect(this.data.headX, this.data.headY, this.data.lineLength, 2);//起点坐标为（20，20），长宽都为120px的正方形
      ctx.closePath();
      ctx.draw();
    }
  },
  attached(){
    //初始化方法
    this.setData({
      headY : this.data.sliderBtn + 2,
      headX: this.data.sliderBtn + 2
    },()=>{
      this.drawImageBase(this.data.headX,this.data.headY,"#FF0000")
    })
  }
 
})
