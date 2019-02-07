<template>
  <div class="center-head clear">
    <div class="menu-left" v-on:click="backto" v-show="back_icon">
      <span class="icon icon-xiangzuojiantou"></span>
    </div>
    <div class="drop-menu">
      <span>{{title}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "center_head",
  data() {
    return {

    };
  },
  props: ["title","back_icon"],
  methods: {
    backto() {
      this.$router.back();
    }
  },
  components: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.center-head {
  height: 2.5rem;
  text-align: center;
  line-height: 2.5rem;
  font-size: 1.125rem;
  color: #fff;
  position: relative;
  .menu-left {
    padding: 0 0.75rem;
    position: absolute;
    font-size: 1.5rem;
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
    }
  }
}
</style>
