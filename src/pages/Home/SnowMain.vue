<template>
  <div class="main">
    <div class="nav-bar">
      <ul>
        <li v-for="(item,key) in timeList" v-bind:key="key" ref="temtext" :class="{active:key==currentTimeIndex}" @click="changeTime(key)">
          <template v-if="item.Type=='999'">
            >20cm
          </template>
          <template v-else>
            {{item.Type}}cm
          </template>
        </li>
      </ul>
    </div>
    <div class="meter">
      <h3>{{title}}</h3>
      <div class="meter-box">
        <div class="circle">
          <canvas id="circle"></canvas>
        </div>
        <div class="station-val">
          <p class="num">{{station_num}}</p>
          <p class="percent">{{station_percent}}</p>
        </div>
      </div>
      <div class="sim-counter clear">
        <p>
          共
          <span>{{timeList[currentTimeIndex].Count}}</span>个{{title}}， 最高积雪
          <span>{{tongjiObj.max.value}}</span>cm（{{tongjiObj.max.name}}）， 最小积雪
          <span>{{tongjiObj.min.value}}</span>cm（{{tongjiObj.min.name}}）。
        </p>
      </div>
    </div>
    <div class="map-box">
      <div class="svg" @click="toDryStatistics">
        <i v-for="(item,index) in warningInfo" v-bind:key="index" :id="'s'+ item" class="home-station"></i>
      </div>
    </div>
  </div>
</template>

<script>
require("@/assets/css/home.scss");
import _ from "underscore";
import moment from "moment";
import renderPercent from "../../circle-percent";

function renderSVG(list) {}
export default {
  name: "TemMain",
  data() {
    return {
      timeList: [
        { Type: 0, Count: 0, Percent: 0, WarningInfo: [] },
        { Type: 0, Count: 10, Percent: 10, WarningInfo: [] },
        { Type: 0, Count: 20, Percent: 20, WarningInfo: [] },
        { Type: 0, Count: 30, Percent: 30, WarningInfo: [] },
        { Type: 0, Count: 40, Percent: 40, WarningInfo: [] }
      ],
      tongjiObj: {
        max: { value: "--", feid: "最大值", name: "---" },
        min: { value: "--", feid: "最小值", name: "---" }
      },
      warningInfo: ["K5053"],
      TableInfo: [], //所有站信息，用于排序
      AreaResult: [], //统计信息，用于统计
      currentTimeIndex: "0",
      currentTimeText: "1h",
      title: "累计降雪--cm以上站点数",
      station_num: "0",
      station_percent: "00%",
      activeIndex2: "1",
      activeElementIndex: this.$store.state.choosedElementIndex,
      hostApi: this.$store.state.hostIP, //服务器地址
      elementApiUrl: [
        "/Rainfall/GetRainInfo",
        "/Temp/GetTempInfo?type=HighTemp",
        "/Temp/GetTempInfo?type=LowTemp",
        "台风",
        "/Drought/GetNoRainInfoByMonth",
        "/Snows/GetSnowsDepthInfo"
      ],
      elementType: "高于",
      elementUnit: ["mm", "℃", "℃", "m/s", "d", "cm"],
      percentObj: {
        color: "#F8E71C",
        percent: 0,
        title: "累计降雪1cm以上站点数"
      }
    };
  },
  methods: {
    changeTime(key) {
      this.currentTimeIndex = key;
      this.dealCountData(this.timeList);
    },
    dealCountData(data) {
      var timeIndex = this.currentTimeIndex;
      this.warningInfo = data[timeIndex].WarningInfo;
      this.station_num = data[timeIndex].Count;
      this.station_percent = data[timeIndex].Percent + "%";
      this.percentObj.percent = data[timeIndex].Percent;
      renderPercent(this.percentObj);
    },
    renderTable(data) {
      data = _.filter(data, function(item) {
        return (
          item.OneHourSnowDepth != null &&
          item.OneHourSnowDepth != "null" &&
          item.OneHourSnowDepth != ""
        );
      });
      if (data.length > 0) {
        //data = _.sortBy(data, "OneHourSnowDepth").reverse();
        data = data.sort(_.compare("OneHourSnowDepth", "desc"));
        var MAX = data[0];
        var MIN = data[data.length - 1];
        console.log(MAX, MIN);
        this.tongjiObj = {
          max: { value: MAX.OneHourSnowDepth, feid: "最大值", name: MAX.StationName },
          min: { value: MIN.OneHourSnowDepth, feid: "最小值", name: MIN.StationName }
        };
      }
    },
    getElementData(apiUrl) {
      //根据选择的要素获取对应的数据
      var that = this;
      that.Indicator.open({ spinnerType: "fading-circle" });
      that.axios
        .get(that.hostApi + `/InterfaceManage` + apiUrl)
        .then(function(response) {
          console.log(response);
          var result = response.data.resultdata;
          if (result && result instanceof Object) {
            if (result.CountResult.length > 0) {
              that.timeList = result.CountResult;
              that.dealCountData(result.CountResult);
            }
            if (result.AreaResult.length > 0) {
              that.AreaResult = result.AreaResult;
            }
            if (result.TableInfo.length > 0) {
              that.TableInfo = result.TableInfo;
              that.renderTable(result.TableInfo);
            }
          }
          that.Indicator.close();
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    toDryStatistics() {
      this.$store.commit("chooseElement", { name: "积雪", index: 5 });
      this.$router.push({
        name: "snowstatistics",
      });
    }
  },
  computed: {
    elementIndex() {
      return this.$store.state.choosedElementIndex;
    }
  },
  watch: {
    elementIndex(Val, oldVal) {
      this.activeElementIndex = Val;
      this.getElementData(this.elementApiUrl[this.activeElementIndex]);
    },
    activeElementIndex() {
      console.log(this.activeElementIndex);
    }
  },
  mounted: function() {
    this.getElementData(this.elementApiUrl[this.activeElementIndex]); //初始化页面数据
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$store.commit("chooseElement", { name: "积雪", index: 5 });
    });
  },
  updated: function() {
    if (this.activeElementIndex == "4") {
      this.title =
        "近一个月" +
        this.$refs.temtext[this.currentTimeIndex].innerText +
        "无降水站点数";
    } else if (this.activeElementIndex == "5") {
      this.title =
        "累计降雪达" +
        this.$refs.temtext[this.currentTimeIndex].innerText +
        "站点数";
    }
  },
  components: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.main {
  background: url("../../assets/images/snow.jpg") center center no-repeat;
  background-size: cover;
  .meter {
    .sim-counter {
      padding: 1rem;
      p {
        width: 100%;
        text-align: left;
        font-size: 15px;
        line-height: 1.6;
        span {
          color: #f8e71c;
          font-size: 1rem;
          display: inline;
        }
      }
    }
  }
}
</style>
