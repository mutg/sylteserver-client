<template>
  <canvas height="200" ref="canvas" />
</template>

<script>
/* eslint-disable */
import { EventBus } from '@/event-bus'

function hexToRgbA(hex){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]]
        }
        c= '0x'+c.join('');
        return new RGBA((c>>16)&255, (c>>8)&255, c&255, 1)
    }
    throw new Error('Bad Hex')
}


function interpolateRGBA(startRGB, endRGB, a, e) {
  var rgb = {
    r: Math.round((endRGB.r - startRGB.r) * a / e + startRGB.r),
    g: Math.round((endRGB.g - startRGB.g) * a / e + startRGB.g),
    b: Math.round((endRGB.b - startRGB.b) * a / e + startRGB.b),
    alpha: Math.round((endRGB.a - startRGB.a) * a / e + startRGB.a)
  }
  
  return new RGBA(rgb.r, rgb.g, rgb.b, rgb.alpha)
}

function RGBA(r, g, b, a) {
  this.r = r || 0
  this.g = g || 0
  this.b = b || 0
  this.a = a || 0
}

var grey = new RGBA(140,140,140, 1)

function changealpha(color, alpha) {
  color.a = alpha
  return color
}

var mouseX
var bar_width = 1
var bar_gap = 0

RGBA.prototype.toString = function() {
  return 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + this.a+ ')'
}

export default {
  data () {
    return {
      canvas: null,
      ctx: null,
      animate: true,
      hover: false,
      rgbColor: new RGBA(255,69,0, 1),
    }
  },
  watch: {
    active (isActive) {
      if (isActive) {
        this.updateLoop()
      }
    }
  },
  props: ['track','active','interactive', 'audio', 'color'],
  methods: {
    drawWave () {
      // clear!
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.0)'
      this.ctx.clearRect(0, 0,  this.canvas.width, this.canvas.height);
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      var middle = this.canvas.height * 0.7
      for (var i = 0; i < this.$_interpolated.length; i++) {
        //var y = this.$_interpolated[Math.round((i / bar_n) * this.$_interpolated.length)]
        var y = this.$_interpolated[i]

        let position = 1
        if (this.audio && this.active) {
          position = this.audio.currentTime / this.track.duration
        }
        
        var positionBarFloat = position * this.$_interpolated.length
        var positionBarIndex = Math.ceil(position * this.$_interpolated.length)
        var mouseBarIndex = Math.ceil((mouseX / this.canvas.width) * this.$_interpolated.length)
        var barStrength = positionBarFloat % 1
        const xbar = i * (bar_gap + bar_width)
        // this.ctx.fillStyle = 'rgb('+ 255 * barStrength + ', ' + 162 * barStrength + ', ' + 127 * barStrength + ')'

        var interpolatedColor = interpolateRGBA(changealpha(grey, 1), changealpha(this.rgbColor, 1), 1, 1)

        if (positionBarIndex > i) {
          this.ctx.fillStyle = changealpha(this.rgbColor, 1)
        } else {
          this.ctx.fillStyle = changealpha(grey, 1)      
        }

        if (this.active && positionBarIndex === i) {
          this.ctx.fillStyle = interpolatedColor
        }

        
        if (this.hover && mouseBarIndex === i) {
            this.ctx.fillStyle = 'yellow'
        }
   
        this.ctx.fillRect(xbar, middle, bar_width, -y * middle)          


        if (positionBarIndex > i) {
          this.ctx.fillStyle = changealpha(this.rgbColor, 0.3)
        } else {
          this.ctx.fillStyle = changealpha(grey, 0.3)
        }

        interpolatedColor.a = 0.3

        if (this.active && positionBarIndex === i) {
          this.ctx.fillStyle = interpolatedColor
        }

        this.ctx.fillRect(xbar, middle + 1, bar_width, y * (this.canvas.height - middle))
      }
    },
    updateLoop () {
      this.drawWave()
      if (this.animate && this.active) {
        requestAnimationFrame(this.updateLoop)
      }
    },
    generate () {
      this.canvas.width = this.canvas.parentNode.clientWidth      
      function interpolateArray(data, fitCount) { 

        var linearInterpolate = function(before, after, atPoint) {
          return before + (after - before) * atPoint;
        };

        var newData = new Array();
        var springFactor = new Number((data.length - 1) / (fitCount - 1));
        newData[0] = data[0]; // for new allocation
        for (var i = 1; i < fitCount - 1; i++) {
          var tmp = i * springFactor;
          var before = new Number(Math.floor(tmp)).toFixed();
          var after = new Number(Math.ceil(tmp)).toFixed();
          var atPoint = tmp - before;
          newData[i] = linearInterpolate(data[before], data[after], atPoint);
        }
        newData[fitCount - 1] = data[data.length - 1]; // for new allocation
        return newData;
      };
      
      this.$_interpolated = interpolateArray(this.track.data.waveformjs, Math.ceil(this.canvas.width / (bar_width + bar_gap)))
    },
    onMouseMove (e) {
      if (!this.interactive) return
      this.hover = true
      var rect = e.target.getBoundingClientRect(),
          x = e.clientX - rect.left,
          y = e.clientY - rect.top
      mouseX = x

    },
    onMouseClick (e) {
      if (!this.interactive) return
      var rect = e.target.getBoundingClientRect(),
          x = e.clientX - rect.left

      if (this.active) {
        EventBus.$emit('setPosition', x / this.canvas.width)
      }
    },
    onMouseOut (e) {
      if (!this.interactive) return
      this.hover = false
    }
  },
  mounted () {
    this.canvas = this.$refs.canvas
    this.canvas.addEventListener('mousemove', this.onMouseMove)
    this.canvas.addEventListener('mouseout', this.onMouseOut)
    this.canvas.addEventListener('click', this.onMouseClick)
    this.ctx = this.canvas.getContext('2d')

    this.generate()
    if (!this.active) {
      this.drawWave()
    } else {
      this.updateLoop()
    }
  },
  beforeDestroy () {
    this.animate = false
  }, 
  created () {
    this.$_interpolated = []
    try {
      this.rgbColor = hexToRgbA(this.color)
    } catch (error) {
      console.log(error)
    }
  }
}
</script>

<style>
canvas {
  width: 100%;
  height: 200px;
}
</style>
