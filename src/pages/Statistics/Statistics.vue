<template>
  <div class="statistics">
    <home-head :warningshow="isShow" :navlist="navList" @changeHomeRouter="routGoto" :currentIndex="activeEleIndex"></home-head>
    <div id="tongji">
      <router-view/>
    </div>
  </div>
</template>
<script>
import HomeHead from "@/components/Head.vue";
export default {
  name: "statistics",
  data() {
    return {
      isShow: false, //预警是否显示
      currentIndex: 0,
      navList: ["降水统计", "高温统计", "低温统计", "干旱统计", "积雪统计"],
      activeEleIndex: this.$store.state.statisticsIndex
    };
  },
  methods: {
    routGoto(element, index) {
      switch (element) {
        case "高温统计":
          this.$router.replace({
            name: "temstatistics",
            query: { element: "HighTemp" }
          });
          break;
        case "低温统计":
          this.$router.replace({
            name: "temstatistics",
            query: { element: "LowTemp" }
          });
          break;
        case "干旱统计":
          this.$router.replace({
            name: "temstatistics",
            query: { element: "Drought" }
          });
          break;
        case "积雪统计":
          this.$router.replace({
            name: "snowstatistics"
          });
          break;
        default:
          this.$router.replace({ name: "rainstatistics" });
          break;
      }
    }
  },
  computed: {
    elementIndex() {
      return this.$store.state.statisticsIndex;
    }
  },
  watch: {
    elementIndex(Val, oldVal) {
      this.activeEleIndex = Val;
    }
  },
  beforeMount: function() {},
  mounted() {},
  updated: function() {
    //this.initChart();
  },
  beforeDestroy() {
    //this.$store.commit("reset");
  },
  components: {
    "home-head": HomeHead
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.statistics {
  height: 100%;
  overflow: hidden;
}
#tongji {
  height: calc(100% - 2.5rem);
  background: transparent;
}
</style>