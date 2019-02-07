<template>
  <div class="home-head">
    <div class="menu-left" v-on:click="toggleNav">
      <span class="icon-caidan1 icon"></span>
    </div>
    <div class="drop-menu">
      <span>{{title}}</span>
    </div>
  </div>
</template>

<script>
// import Badge from 'mint-ui';
export default {
  name: "main_head",
  data() {
    return {
      pagetitle: "实况地图"
    };
  },
  props: ["title"],
  methods: {
    toggleNav() {
      this.$store.commit("toggleNav");
    }
  },
  components: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.home-head {
  text-align: center;
  height: 2.5rem;
  line-height: 2.5rem;
  font-size: 1.125rem;
  color: #fff;
  position: relative;
  .menu-left {
    padding: 0 0.75rem;
    position: absolute;
    top: 0;
    left: 0;
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
