<template>
  <canvas height="200" ref="canvas" />
</template>

<script>
/* eslint-disable */
var resizeTimer;

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

var colored = new RGBA(255,69,0, 1)
var grey = new RGBA(140,140,140, 1)

function barColored(alpha) {
  colored.a = alpha
  return colored
}

function barGrey(alpha) {
  grey.a = alpha
  return grey
}


RGBA.prototype.toString = function() {
  return 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + this.a+ ')'
}

export default {
  data () {
    return {
      waveform: null,
      canvas: null,
      ctx: null,
      color: null,
      position: 0.0,
      interpolated: [],
      animate: true,
      hover: false,
      mouseX: 0.0
    }
  },
  props: ['points'],
  methods: {
    drawWave () {
      // clear!
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.0)'
      this.ctx.clearRect(0, 0,  this.canvas.width, this.canvas.height);
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      var middle = this.canvas.height * 0.6
      var bar_width = 3
      var bar_gap = 1
      var bar_n = Math.floor(this.canvas.width / (bar_width + bar_gap))

      for (var i = 0; i < bar_n; i++) {
        var y = this.interpolated[Math.floor((i / bar_n) * this.interpolated.length)]
        y = y

        var positionBarFloat = this.position * bar_n
        var positionBarIndex = Math.floor(this.position * bar_n)
        var mouseBarIndex = Math.floor((this.mouseX / this.canvas.width) * bar_n)
        var barStrength = positionBarFloat % 1
        const xbar = i * (bar_gap + bar_width)
        // this.ctx.fillStyle = 'rgb('+ 255 * barStrength + ', ' + 162 * barStrength + ', ' + 127 * barStrength + ')'

        var interpolatedColor = interpolateRGBA(barGrey(1), barColored(1), barStrength, 1)

        if (positionBarIndex > i) {
          this.ctx.fillStyle = barColored(1)
        } else {
          this.ctx.fillStyle = barGrey(1)      
        }

        if (positionBarIndex === i) {
          this.ctx.fillStyle = interpolatedColor
        }

        if (this.hover && mouseBarIndex === i) {
            this.ctx.fillStyle = 'yellow'
        }
   
        this.ctx.fillRect(xbar, middle, bar_width, -y * middle)          


        if (positionBarIndex > i) {
          this.ctx.fillStyle = barColored(0.3)
        } else {
          this.ctx.fillStyle = barGrey(0.3)
        }

        interpolatedColor.a = 0.3

        if (positionBarIndex === i) {
          this.ctx.fillStyle = interpolatedColor
        }

        this.ctx.fillRect(xbar, middle + 1, bar_width, y * (this.canvas.height - middle))
      }

      if (this.animate) {
        requestAnimationFrame(this.drawWave)
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

      this.interpolated = interpolateArray(this.points, this.canvas.width)
    },
    onResize (e) {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        this.generate()
        console.log('rei')
      }, 250)
    },
    onMouseMove (e) {
      this.hover = true
      var rect = e.target.getBoundingClientRect(),
          x = e.clientX - rect.left,
          y = e.clientY - rect.top

      this.mouseX = x

    },
    onMouseClick (e) {
      var rect = e.target.getBoundingClientRect(),
          x = e.clientX - rect.left

      this.position = x / this.canvas.width
    },
    onMouseOut (e) {
      this.hover = false
    }
  },
  mounted () {
    this.canvas = this.$refs.canvas
    this.canvas.addEventListener('mousemove', this.onMouseMove)
    this.canvas.addEventListener('mouseout', this.onMouseOut)
    this.canvas.addEventListener('click', this.onMouseClick)
    this.ctx = this.canvas.getContext('2d')
    window.addEventListener('resize', this.onResize)

    this.generate()
    this.drawWave()    
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onResize)
    this.animate = false
  }
}
</script>

<style>
canvas {
  width: 100%;
  height: 200px;
}
</style>
