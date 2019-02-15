<template>
  <div class="main" :class="{hmain:ishtem,lmain:!ishtem}">
    <div class="nav-bar">
      <ul>
        <li v-for="(item,key) in timeList" v-bind:key="key" ref="temtext" :class="{active:key==currentTimeIndex}" @click="changeTime(key)">
          <template v-if="item.Type=='999'">
            创历史
          </template>
          <template v-else>
            {{item.Type}}℃
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
        <p v-for="(item,key) in tongjiObj" v-bind:key="key" :class="key">
          <span>{{item.feid}}</span>
          <span class="val">{{item.value}}&nbsp;{{elementUnit[activeElementIndex]}}</span>
          <span class="st-name">{{item.name}}</span>
        </p>
      </div>
    </div>
    <div class="map-box">
      <div class="svg" @click="toTemStatistics">
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
        { Type: 0, Count: 0, Percent: 0, WarningInfo: [] },
        { Type: 0, Count: 0, Percent: 0, WarningInfo: [] },
        { Type: 0, Count: 0, Percent: 0, WarningInfo: [] },
        { Type: 0, Count: 0, Percent: 0, WarningInfo: [] }
      ],
      tongjiObj: {
        max: { value: "--", feid: "最大值", name: "---" },
        min: { value: "--", feid: "最小值", name: "---" },
        avg: { value: "--", feid: "平均值", name: "---" }
      },
      warningInfo: ["K5053"],
      TableInfo: [], //所有站信息，用于排序
      AreaResult: [], //统计信息，用于统计
      currentTimeIndex: "0",
      currentTimeText: "1h",
      title: "温度----的站点数",
      station_num: "0",
      station_percent: "00%",
      activeIndex2: "1",
      activeElementIndex: this.$store.state.choosedElementIndex,
      elementApiUrl: [
        "/Rainfall/GetRainInfo",
        "/Temp/GetTempInfo?type=HighTemp",
        "/Temp/GetTempInfo?type=LowTemp",
        "台风",
        "干旱",
        "/Snows/GetSnowsDepthInfo"
      ],
      elementType: "高于",
      elementRouter: "HighTemp",
      ishtem:true,
      elementUnit: ["mm", "℃", "℃", "m/s", "d", "cm"],
      hostApi: this.$store.state.hostIP,
      percentObj: {
        color: "#F8E71C",
        percent: 0,
        title: "超过20mm降雨量站点数"
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
      this.warningInfo = this.timeList[timeIndex].WarningInfo;
      this.station_num = this.timeList[timeIndex].Count;
      this.station_percent = this.timeList[timeIndex].Percent + "%";
      this.percentObj.percent = this.timeList[timeIndex].Percent;
      renderPercent(this.percentObj);
    },
    renderTable(data) {
      data = _.filter(data, function(item) {
        return (
          item.DayTemp != null && item.DayTemp != "null" && item.DayTemp != ""
        );
      });
      //data = _.sortBy(data, "DayTemp").reverse();
      data = data.sort(_.compare("DayTemp", "desc"));
      var MAX = data[0];
      var MIN = data[data.length - 1];
      var _AreaResult = this.AreaResult;
      // var totalVal = 0;
      // for (var i = 0; i < _AreaResult.length; i++) {
      //   totalVal += parseFloat(_AreaResult[i].AverageValue);
      // }
      this.tongjiObj = {
        max: { value: MAX.DayTemp, feid: "最大值", name: MAX.StationName },
        min: { value: MIN.DayTemp, feid: "最小值", name: MIN.StationName },
        avg: {
          value: _AreaResult.AvgTemp,
          feid: "平均值",
          name: moment(_AreaResult.ObservTime).format("MM-DD HH:mm")
        }
      };
    },
    getElementData(apiUrl) {
      //根据选择的要素获取对应的数据
      var that = this;
      that.Indicator.open({spinnerType: 'fading-circle'});
      that.axios
        .get(that.hostApi + `/InterfaceManage` + apiUrl)
        .then(function(response) {
          // console.log(response);
          var result = response.data;
          if (result && result instanceof Object) {
            if (result.CountResult.length > 0) {
              that.timeList = result.CountResult;
              that.dealCountData(result.CountResult);
            }
            if (result.AreaResult) {
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
    toTemStatistics() {
      this.$store.commit("chooseElement", {
        name: this.elementRouter + "统计",
        index: this.activeElementIndex
      });
      this.$router.push({
        name: "temstatistics",
        query: { element: this.elementRouter }
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
    },
    activeElementIndex() {
      this.getElementData(this.elementApiUrl[this.activeElementIndex]);
    }
  },
  beforeMount() {
    if (this.$route.query.type === "htem") {
      this.ishtem=true;
      this.$store.commit("chooseElement", { name: "高温", index: 1 });
    } else if(this.$route.query.type === "ltem"){
      this.ishtem=false;
      this.$store.commit("chooseElement", { name: "低温", index: 2 });
    }
  },
  mounted: function() {
    this.getElementData(this.elementApiUrl[this.elementIndex]);
  },
  updated: function() {
    this.elementType = "高于";
    this.elementRouter = "HighTemp";
    if (this.activeElementIndex == "2") {
      this.elementType = "低于";
      this.elementRouter = "LowTemp";
    }
    if(this.activeElementIndex == "1"&&this.currentTimeIndex=="4"){
      this.currentTimeIndex--;
    }
    this.title =
      "温度" +
      this.elementType +
      this.$refs.temtext[this.currentTimeIndex].innerText +
      "的站点数";
  },
  components: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.hmain {
  background: url("../../assets/images/hight-tem.jpg") center center no-repeat;
  background-size: cover;
}
.lmain {
  background: url("../../assets/images/low-tem.jpg") center center no-repeat;
  background-size: cover;
}
</style>
