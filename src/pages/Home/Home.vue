<template>
  <div class="home">
    <home-head @changeHomeRouter="routGoto" :warningshow="bellIsShow" :currentIndex="activeElementIndex"></home-head>
    <div id="homeMain">
      <router-view/>
    </div>
  </div>
</template>

<script>
import HomeHead from "@/components/Head.vue";
export default {
  name: "Home",
  data() {
    return {
      radio: "1",
      bellIsShow: true,
      activeElementIndex: this.$store.state.choosedElementIndex,
    };
  },
  methods: {
    handleSelect(key, keyPath) {},
    routGoto(element, index) {
      switch (element) {
        case "高温":
          this.$router.replace({ name: "temmain", query: { type: "htem" } });
          break;
        case "低温":
          this.$router.replace({ name: "temmain", query: { type: "ltem" } });
          break;
        case "台风":
          this.$router.push({ name: "typhoon" });
          break;
        case "干旱":
          this.$router.replace({ name: "drymain" });
          break;
        case "积雪":
          this.$router.replace({ name: "snowmain" });
          break;
        default:
          this.$router.replace({ name: "rainmain" });
          break;
      }
    }
  },
  beforeMount:function(){

  },
  watch: {
    listenActive(Val, oldVal) {
      this.activeElementIndex = Val;
    }
  },
  computed: {
    listenActive() {
      return this.$store.state.choosedElementIndex;
    }
  },
  beforeDestroy() {
    //this.$store.commit("reset");
  },
  components: {
    HomeHead
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.home {
  color: #fff;
  height: 100%;
  overflow: hidden;
}
#homeMain {
  height: calc(100% - 2.5rem);
}
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
