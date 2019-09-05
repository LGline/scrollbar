<template>
  <div class="home" ref="container">
    <div :style="[{width, height, backgroundColor}]">
      <slot name="img"></slot>
    </div>
    <HorizonScrollbar 
      :show="scrollbar.show" 
      :scrollTimestamp="scrollbar.scrollTimestamp" 
      :config="scrollbar.config"
      @scrollable="_scrollable"
      @setLeft="_setLeft"
      @setScrollLeft="_setScrollLeft">
    </HorizonScrollbar>
  </div>
</template>

<script>
import HorizonScrollbar from './horizonScrollbar.vue'
export default {
  name: 'home',
  props: {},
  components: {HorizonScrollbar},
  data() {
    return {
      width: '3000px',
      height: '100%',
      backgroundColor: '#ff0',
      scrollbar: {
        show: true, // 滚动条显示|隐藏
        scrollTimestamp: 0, // 容器滚动时的时间戳
        upperBoundary: 100, // 鼠标离开滚动条后仍然有效移动滚动条的上边界(Y轴坐标)
        lowerBoundary: 100, // 鼠标离开滚动条后仍然有效移动滚动条的下边界(Y轴坐标)
        config: { // 滚动条配置
          totalWidth: 0, // 容器总宽度
          bodyMoveState: 0, // 鼠标离开滚动条后在 body 元素上的 move 状态
          basePoint: {x:0, y:0}, // 鼠标按下时的位置
          style: { // 滚动条样式
            container: {
              position: 'fixed',
              top: '0px',
              left: '0px',
              zIndex: 10,
              width: '100%',
              height: '20px',
              backgroundColor: 'rgba(235,235,235,0.5)',
            },
            top: {
              position: 'absolute',
              zIndex: 2,
              top: '50%',
              left: '0px',
              transform: 'translateY(-50%)',
              cursor: 'pointer',
              borderRadius: '20px',
              width: '100px',
              height: '16px',
              borderColor: '#c1c1c1',
              backgroundColor: '#c1c1c1',
            },
            bottom: {
              position: 'absolute',
              top: '0px',
              left: '0px',
              zIndex: 1,
              cursor: 'pointer',
              width: '100%',
              height: '16px',
              borderColor: '#fafafa',
            }
          }
        },
        scrollLeft: 0, // 滚动条的 scrollLeft
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setScrollBar();
      this.bodyBindMouseHandle();
      this.scrollbar.scrollTimestamp = new Date().getTime();
    });
  },
  methods: {
    // 获取样式
    _getStyle(element, cssPropertyName){
      if (window.getComputedStyle) {return window.getComputedStyle(element)[cssPropertyName];}
      else {return element.currentStyle[cssPropertyName];}
    },

    // 滚动条组件回传的可以滚动事件
    _scrollable() {
      if ((this.scrollbar.scrollLeft + parseFloat(this.scrollbar.config.style.top.width) <= parseFloat(this.scrollbar.config.style.container.width)) && this.scrollbar.scrollLeft>= 0) {
        this.scrollbar.config.style.top.left = this.scrollbar.scrollLeft + 'px';
      }
    },

    // 设置 style.top 的 left 属性值
    _setLeft(left) {this.scrollbar.config.style.top.left = left + 'px';},

    // 设置 容器滚动条 的 scrollLeft 属性值
    _setScrollLeft(scrollLeft) {
      let container = document.querySelector('.home');
      container.scrollLeft = scrollLeft;
    },

    // 当拖动表头改变了列的宽度的时候会触发该事件
    tableHeaderDragend({newWidth, oldWidth, column, event}) {
      this.relationTable.tableHeadList.forEach(head => {if (head.prop === column.prop) {head.width = newWidth;}});
      if (this.customFieldList && this.customFieldList.length) {
        this.customFieldList.forEach(field => {if (String(field.fieldId) === String(column.prop)) {this.$set(field, 'width', newWidth);}});
      }
    },

    // 自定义滚动条组件回传的可以滚动事件
    scrollable() {
      if ((this.scrollbar.scrollLeft + parseFloat(this.scrollbar.config.style.top.width) <= parseFloat(this.scrollbar.config.style.container.width)) && this.scrollbar.scrollLeft>= 0) {
        this.scrollbar.config.style.top.left = this.scrollbar.scrollLeft + 'px';
      }
    },

    // 设置自定义滚动条宽度
    setScrollBar() {
      let totalWidth = parseFloat(this.width) || 3000; // 滚动体总体宽度
      let rate = 0; // 容器宽度与滚动体实际宽度的比
      let container = this.$refs['container']; // 容器
      if (!container) {return;}
      let containerWidth = Math.floor(parseFloat(this._getStyle(container, 'width'))); // 列表容器宽度
      rate = (containerWidth / totalWidth <= 1) ? (containerWidth / totalWidth) : (totalWidth / containerWidth);
      let topWidth = Math.floor(containerWidth * rate);
      this.scrollbar.config.totalWidth = totalWidth;
      this.scrollbar.config.style.container.width = containerWidth + 'px';
      this.scrollbar.config.style.container.top = (document.body.clientHeight - parseFloat(this.scrollbar.config.style.container.height)) + 'px';
      this.scrollbar.config.style.top.width = topWidth + 'px';
      this.scrollbar.show = true;
      this.containerScroll(container, (event) => {
        let target = event.target || event.srcElement;
        this.scrollbar.scrollLeft = target.scrollLeft * (containerWidth - topWidth) / (totalWidth - containerWidth)
        this.scrollbar.scrollTimestamp = new Date().getTime();
      });
    },

    // 列表滚动
    containerScroll(element, callback) {
      if (!element) {return;}
      this.bindScrollEvent(element, (event) => {callback && callback(event)});
    },

    // 鼠标离开滚动条，但仍在有效移动区域内的鼠标移动联动自定义滚动条和原生滚动条的移动
    bodyMouseMoveScrollBar({event}) {
      let increment = event.offsetX - this.scrollbar.config.basePoint.x;
      let tLeft = parseFloat(this.scrollbar.config.style.top.left);
      let tWidth = parseFloat(this.scrollbar.config.style.top.width);
      let bWidth = parseFloat(this.scrollbar.config.style.container.width);
      if ((increment > 0) && (increment < bWidth - tWidth)) {
        this.scrollbar.config.style.top.left = increment + 'px';
        let scrollLeft = tLeft * (this.scrollbar.config.totalWidth - bWidth) / (bWidth - tWidth);
        this._setScrollLeft(scrollLeft);
      } else {
        if (increment >= bWidth - tWidth) {
          this.scrollbar.config.style.top.left = (bWidth - tWidth) + 'px';
          let scrollLeft = tLeft * (this.scrollbar.config.totalWidth - bWidth) / (bWidth - tWidth);
          this._setScrollLeft(scrollLeft);
        }
        if (increment <= 0) {
          this.scrollbar.config.style.top.left = '0px';
          let scrollLeft = tLeft * (this.scrollbar.config.totalWidth - bWidth) / (bWidth - tWidth);
          this._setScrollLeft(scrollLeft);
        }
      }
    },

    // body 元素绑定鼠标事件句柄
    bodyBindMouseHandle() {
      let body = document.querySelector('body');
      if (!body) {return;}
      this.addEvent(document.querySelector('body'), 'mouseup', (event) => {this.scrollbar.config.bodyMoveState = 0;});
      this.addEvent(document.querySelector('body'), 'mouseleave', (event) => {this.scrollbar.config.bodyMoveState = 0;});
      this.addEvent(document.querySelector('body'), 'mousemove', (event) => {
        if (this.scrollbar.config.bodyMoveState) {
          if (event.clientY >= (parseFloat(this.scrollbar.config.style.container.top) - this.scrollbar.upperBoundary) &&
              event.clientY <= (parseFloat(this.scrollbar.config.style.container.top) + parseFloat(this.scrollbar.config.style.container.height) + this.scrollbar.lowerBoundary)) {
            this.bodyMouseMoveScrollBar({event:{offsetX:event.clientX}});
          }
        }
      });
    },

    // 绑定滚动事件
    bindScrollEvent(element, callback) {
      if (!element) {return;}
      this.addEvent(element, 'scroll', (event) => {callback && callback(event);});
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .home {
    width:100%; 
    height:300px;
    position: relative;
    overflow: auto;
  }
</style>
