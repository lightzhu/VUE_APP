<template>
  <div class="home-head">
    <div class="menu-left" v-on:click="toggleNav">
      <span class="icon-caidan1 icon"></span>
    </div>
    <div class="drop-menu" v-on:click="toggleMenu">
      <span>{{elements[currentIndex]}}</span>
      <i class="icon-plus-select-down icon"></i>
      <transition-group name="menu">
        <div class="menu" v-show="isshow" :key="1" transiton="menu">
          <ul>
            <li v-for="(item,key) in elements" v-bind:key="key" v-bind:class="{choosed:key==currentIndex}" 
                v-on:click="changeEle(key,item)">
              <span class="fl">{{item}}</span>
              <i class="fr icon icon-right"></i>
            </li>
          </ul>
        </div>
      </transition-group>
    </div>
    <div class="warning-tip" v-show="warningshow" @click="gotoWarning"> 
      <span class="icon-qunfengxiaoxitishilingdang icon">
        <i class="badge" v-show="warningList.length>0">{{warningList.length}}</i>
      </span>
    </div>
  </div>
</template>

<script>
// import Badge from 'mint-ui';
export default {
  name: "home_head",
  data() {
    return {
      isshow: false, //下拉菜单显示
      ischoosed: "choosed", //选中要素
      elements: ["降水", "高温", "低温", "台风", "干旱", "积雪"]
    };
  },
  props: ['warningshow','navlist','currentIndex'],
  methods: {
    toggleMenu() {
      this.isshow = !this.isshow;
    },
    toggleNav() {
      this.$store.commit('toggleNav');
    },
    changeEle(key,item) {
      this.$emit('changeHomeRouter', item,key);
      this.$store.commit('chooseElement',{name:item,index:key});
    },
    gotoWarning(){
      this.$router.push({ name: "warning"});
    },
    handleSelect(key, keyPath) {}
  },
  computed: {
    warningList() {
      return this.$store.state.warningMsg;
    }
  },
  mounted: function() {
    if(this.navlist){//如果是指定的要素选择
      this.elements = this.navlist;
    }
  },
  components: {}
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.home-head {
  height: 2.5rem;
  line-height: 2.5rem;
  text-align: center;
  font-size: 1.125rem;
  color: #fff;
  position: relative;
  // background: linear-gradient(to left, #170198, #170466);
  .menu-left,.warning-tip{
    padding:0 0.875rem;
    position: absolute;
    top:0;
  }

  .menu-left{
    left:0;
  }
  .warning-tip{
    right:0;
    span{
      position: relative;
      .badge{
        position: absolute;
        display: block;
        width: 0.875rem;
        height:0.875rem;
        font-style: normal;
        font-size:12px;
        background: rgba(235,77,61,0.8);
        line-height:0.875rem;
        text-align: center;
        right:-0.8rem;
        top:-0.3rem;
        border-radius: 50%;
      }
    }
  }
  .drop-menu {
    display: inline-block;
    margin: 0 auto;
    .menu {
      width: 9.375rem;
      background-color: #ffffff;
      border-radius: 0.635rem;
      box-shadow: 0 2px 15px 0 rgba(0, 0, 0, 0.5);
      position: relative;
      z-index: 10;
      li {
        height: 2.8125rem;
        line-height: 2.8125rem;
        padding: 0 1.687rem;
        color: #4a4a4a;
        &:first-child {
          border-radius: 0.635rem 0.635rem 0 0;
        }
        &:last-child {
          border-radius: 0 0 0.635rem 0.635rem;
        }
        & + li {
          border-top: 1px solid #ebeef2;
        }
        &.choosed {
          background: #f3f5f6;
          i {
            display: inline-block;
          }
        }
        i {
          line-height: 2.8125rem;
          color: #16018d;
          font-weight: 600;
          display: none;
        }
      }
    }
    .menu-enter-active,
    .menu-leave-active {
      transition: opacity 0.4s;
    }
    .menu-enter,
    .menu-leave-active {
      opacity: 0;
    }
  }
}
</style>
