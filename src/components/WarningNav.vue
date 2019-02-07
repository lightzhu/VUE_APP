<template>
  <div class="nav slide-nav">
    <div class="type-slide" v-for="(item, index) in navdata" v-bind:key="item.ID" @click="chooseTime(item.ID,item.name,index)" :class="{active:choosed==index}">
      <a href="javascript:;">{{item.name}}</a>
    </div>
  </div>
</template>

<script>
export default {
  name: "StatisticsNav",
  data() {
    return {
      choosed: 0,
      timeList: []
    };
  },
  props: ["navdata"],
  methods: {
    chooseTime(index, item, num) {
      this.choosed = num;
      this.$emit("changeType", index - 1, item);
    }
  },
  mounted: function() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin-left: 1.4rem;
}
.nav {
  display: flex;
  height: 1.75rem;
  box-sizing: border-box;
  .type-slide {
    flex-grow: 1;
    text-align: center;
    a {
      display: inline-block;
      line-height: 1.55rem;
      padding: 0 0.25rem;
      color: #8a80c6;
      font-size: 0.875rem;
      font-weight: 400;
    }
    &.active {
      a {
        color: #fff;
        border-bottom: 2px solid #fff;
      }
    }
  }
}
</style>
