<template>
  <div class="nav swiper-container slide-nav">
    <div class="swiper-wrapper">
      <div class="swiper-slide" v-for="(item, index) in timeList" v-bind:key="item.Key" @click="chooseTime(index,item.Key)" :class="{active:choosed==index}">
        <a href="javascript:;">{{item.text}}</a>
      </div>
    </div>
  </div>
</template>

<script>
import Swiper from "swiper/dist/js/swiper.min.js";
export default {
  name: "StatisticsNav",
  props: ["secnavlist","perViewNum"],
  data() {
    return {
      choosed: 0,
      mySwiper: null,
      timeList: [
        { text: "近1小时", Key: "1h" },
        { text: "近3小时", Key: "3h" },
        { text: "近6小时", Key: "6h" },
        { text: "近12小时", Key: "12h" },
        { text: "近24小时", Key: "24h" }
      ]
    };
  },
  watch: {
    secnavlist: function(newValue, oldValue) {
      this.timeList = this.secnavlist;
    }
  },
  methods: {
    chooseTime(index, key) {
      this.choosed = index;
      this.$emit("changeTimeSlider", key,index);
    }
  },
  beforeMount: function() {
    if (this.secnavlist.length > 0) {
      this.timeList = this.secnavlist;
    }
  },
  mounted: function() {
    this.mySwiper = new Swiper(".swiper-container", {
      slidesPerView: this.perViewNum,
      autoplay: false, //可选选项，自动滑动
      paginationClickable: true
    });
  },
  updated: function() {
    if (this.mySwiper) {
      this.mySwiper.update();
    }
  }
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
  .swiper-wrapper {
    height:1.75rem;
    .swiper-slide {
      text-align: center;
      a {
        display: inline-block;
        line-height: 1.55rem;
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
}
</style>
