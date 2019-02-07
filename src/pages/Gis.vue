<template>
  <div class="gis-wrap">
    <main-head :title="pagehead"></main-head>
    <live-nav @changeType="changeType" :navdata="navlist"></live-nav>
    <div class="feature">
      <div class="map-box">
        <img :src="live_src" alt="">
      </div>
      <div class="elements-wrap">
        <ul>
          <li v-for="(item, index) in elements" v-bind:key="item.ID" @click="chooseElement(index,item.ID)" :class="{active:choosedElement==index}">
            <a href="javascript:;">{{item.ItemName}}</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import MainHead from "../components/MainHead.vue";
import LiveNav from "../components/WarningNav.vue";
import featuresdata from "@/assets/gis_feature.js";
export default {
  name: "gis",
  data() {
    return {
      radio: "1",
      scrollMode: "auto",
      pagehead: "实况地图",
      allLoaded: false,
      choosedFeature: 1,
      choosedElement: 0,
      firstImgId: null,
      navlist: [
        { name: "降水", ID: "2" },
        { name: "气温", ID: "1" },
        { name: "湿度", ID: "3" },
        { name: "风", ID: "4" }
      ],
      elements: [
        // { ItemName: "1小时", ID: "37", ImagePath: "" },
        // { ItemName: "3小时", ID: "38", ImagePath: "" },
        // { ItemName: "6小时", ID: "39", ImagePath: "" },
        // { ItemName: "12小时", ID: "40", ImagePath: "" },
        // { ItemName: "24小时", ID: "41", ImagePath: "" },
        // { ItemName: "48小时", ID: "43", ImagePath: "" },
        // { ItemName: "20时以来", ID: "31", ImagePath: "" },
        // { ItemName: "8时以来", ID: "32", ImagePath: "" }
      ],
      features: [],
      live_src: "/static/imgs/map-live.png",
      hostApi: this.$store.state.hostIP //服务器地址
    };
  },
  methods: {
    changeType(key, data) {
      this.choosedFeature = key;
      this.choosedElement = 0;
    },
    handleFeatureChange(features) {
      this.getContour(this.choosedFeature);
    },
    getContour(ID) {
      //获取等值线图
      var that = this;
      that.Indicator.open({ spinnerType: "fading-circle" });
      that.axios
        .get(that.hostApi + `/InterfaceManage/OuterApi/GetLiveDiagram`, {
          params: { parentId: ID + 1 }
        })
        .then(function(response) {
          that.elements = response.data;
          that.changeContour(0);
          that.Indicator.close();
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    chooseElement(index, item) {
      this.choosedElement = index;
      this.firstImgId = item;
    },
    changeContour(index) {
      this.live_src = this.elements[index].ImagePath;
    },
    loadTop() {},
    loadBottom() {}
  },
  watch: {
    choosedElement(Val, oldVal) {
      var _this = this;
      //如果选择时间发生改变，更新实况图
      _this.changeContour(Val);
    },
    choosedFeature(Val, oldVal) {
      var _this = this;
      //如果选择要素发生改变，更新时间选择
      _this.getContour(Val);
    }
  },
  beforeMount: function() {
    //初始化要素选择
    this.getContour(this.navlist[0].ID - 1);
  },
  components: {
    MainHead,
    LiveNav
  }
};
</script>
<style scoped lang="scss">
.gis-wrap {
  color: #fff;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: transparent;
}
.feature {
  border-top: 0.2rem solid;
  border-color: #1a03a0;
  background: #f3f5f6;
  height: calc(100% - 4.22rem);
  box-sizing: border-box;
  .tab-bar {
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    justify-content: space-around;
    .select-box {
      flex-grow: 1;
      width: 33%;
      text-align: center;
      i {
        margin-left: 0.5rem;
      }
    }
  }
  .time-box {
    color: #000;
    padding: 0.625rem 0;
    background: rgb(255, 255, 255);
    li {
      display: inline-block;
      margin-left: 0.2125rem;
      font-size: 0.9375rem;
    }
  }
  .elements-wrap {
    ul {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      position: absolute;
      bottom: 0;
      li {
        width: 25%;
        text-align: center;
        flex-grow: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 1rem;
        &.active {
          a {
            background: #16018d;
          }
        }
        a {
          color: #fff;
          box-sizing: border-box;
          padding: 0 0.2rem;
          border-radius: 50%;
          width: 4.0625rem;
          height: 4.0625rem;
          font-size: 0.94rem;
          display: -webkit-box;
          -webkit-box-pack: center;
          -webkit-box-align: center;
          // box-align: center;
          // box-pack: center;
          background: #a9a7b4;
        }
      }
    }
  }
}
.map-box {
  background: #fff;
  padding: 0.5rem;
  background: transparent;
  img {
    width: 100%;
  }
}
</style>
