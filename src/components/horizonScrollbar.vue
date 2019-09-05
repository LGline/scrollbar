<template>
	<div v-if="show" id="HorizonScrollbar" ref="HorizonScrollbar" class="horizon-scrollbar">
		<!-- 模拟水平滚动条部分 =========== start ========== -->
    <div class="horizon-scrollbar" ref="horizon-scrollbar" :style="[config.style.container]">
      <div class="scroll-bar-top" ref="scroll-bar-top" :style="[config.style.top]"></div>
      <div class="scroll-bar-bottom" ref="scroll-bar-bottomm" :style="[config.style.bottom]"></div>
    </div>
  <!-- 模拟水平滚动条部分 =========== end ========== -->
	</div>
</template>
<script type="text/ecmascript-6">
	export default {
		name: 'HorizonScrollbar',
		props: {
			show: {type:Boolean, default:false},
			scrollTimestamp: {type:Number, default:0},
			config: {type:Object, default:{}}
		},
		components: {},
		computed: {},
		mounted() {},
		data() {
      return {
      	moveState: 0, // 自定义滚动条滚动状态
		    scrollLeft: 0, // 
      }
    },
    watch: {
    	'scrollTimestamp': function(newValue) {
    		if (!this.moveState) {this.$emit('scrollable');}
    		this._mousemoveScrollBar();
    	}
    },
    methods: {
			// 鼠标移动自定义滚动条模拟原生滚动条滚动
			_mousemoveScrollBar() {
			  let scrollBar = this.$refs['HorizonScrollbar'];
			  if (!scrollBar) {return;}
			  if (!scrollBar.eventList || !scrollBar.eventList.mousedown) {
			    this.addEvent(scrollBar, 'mousedown', (event) => {
			      if (event.button == 2) {return;}
			      event.preventDefault();
			      let target = event.target || event.srcElement;
			      this.moveState = 1;
			      this.config.bodyMoveState = 0;
			      if (!target.className.includes('scroll-bar-top')) {this.__scrollBarClickMove(event);}
			      this.config.basePoint.x = event.offsetX;
			    });
			  }
			  if (!scrollBar.eventList || !scrollBar.eventList.mouseup) {
			    this.addEvent(scrollBar, 'mouseup', (event) => {
			      event.preventDefault();
			      this.moveState = 0;
			      this.config.bodyMoveState = 0;
			    });
			  }
			  if (!scrollBar.eventList || !scrollBar.eventList.mouseleave) {
			    this.addEvent(scrollBar, 'mouseleave', (event) => {
			      event.preventDefault();
			      if (this.moveState) {
			        this.moveState = 0;
			        this.config.bodyMoveState = 1;
			      }
			    });
			  }
			  if (!scrollBar.eventList || !scrollBar.eventList.mousemove) {
			    this.addEvent(scrollBar, 'mousemove', (event) => {
			      event.preventDefault();
			      let target = event.target || event.srcElement;
			      if (this.moveState) {
			        if (target.className.includes('scroll-bar-top')) {
			          this.__scrollBarDragMove(event);
			        }
			      }
			    });
			  }
			},
			// 自定义滚动条被点击时的移动
			__scrollBarClickMove(event) {
			  if (event.offsetX - parseFloat(this.config.style.top.width) > 0) {
			  	this.$emit('setLeft', event.offsetX - parseFloat(this.config.style.top.width)); // 设置 left
			    this.scrollLeft = parseFloat(this.config.style.top.left) * (this.config.totalWidth - parseFloat(this.config.style.container.width)) / (parseFloat(this.config.style.container.width) - parseFloat(this.config.style.top.width));
			    this.$emit('setScrollLeft', this.scrollLeft); // 设置 scrollLeft
			  } else {
			    this.$emit('setLeft', event.offsetX); // 设置 left
			    this.scrollLeft = parseFloat(this.config.style.top.left) * (this.config.totalWidth - parseFloat(this.config.style.container.width)) / (parseFloat(this.config.style.container.width) - parseFloat(this.config.style.top.width));
			    this.$emit('setScrollLeft', this.scrollLeft); // 设置 scrollLeft
			  }
			},
			// 自定义滚动条被拖动时的移动
			__scrollBarDragMove(event) {
			  let increment = event.offsetX - this.config.basePoint.x;
			  let tLeft = parseFloat(this.config.style.top.left);
			  let tWidth = parseFloat(this.config.style.top.width);
			  let bWidth = parseFloat(this.config.style.container.width);
			  if ((increment + tLeft > 0) && (increment + tLeft < bWidth - tWidth)) {
			    this.$emit('setLeft', tLeft + increment); // 设置 left
			    this.scrollLeft = tLeft * (this.config.totalWidth - bWidth) / (bWidth - tWidth);
			    this.$emit('setScrollLeft', this.scrollLeft); // 设置 scrollLeft
			  } else {
			    if (increment + tLeft >= bWidth - tWidth) {
			      this.$emit('setLeft', bWidth - tWidth); // 设置 left
			      this.scrollLeft = tLeft * (this.config.totalWidth - bWidth) / (bWidth - tWidth);
			      this.$emit('setScrollLeft', this.scrollLeft); // 设置 scrollLeft
			    }
			    if (increment + tLeft <= 0) {
			      this.$emit('setLeft', 0); // 设置 left
			      this.scrollLeft = tLeft * (this.config.totalWidth - bWidth) / (bWidth - tWidth);
			      this.$emit('setScrollLeft', this.scrollLeft); // 设置 scrollLeft
			    }
			  }
			},
			// 绑定事件
      addEvent(dom, eName, fun, useCapture) {
        if (!dom || !eName) {return false;}
        if (dom.addEventListener) {
          dom.removeEventListener(eName, fun);
          dom.addEventListener(eName, fun, useCapture);
        } else if (dom.attachEvent) {
          dom.detachEvent('on'+eName, fun);
          dom.attachEvent('on'+eName, fun);
        }
        if (!dom.eventList) {dom.eventList = {};}
        dom.eventList[eName] = true;
      },
    }
	}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>   
	
</style>