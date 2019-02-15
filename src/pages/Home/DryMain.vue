<template>
  <div class="main">
    <div class="nav-bar">
      <ul>
        <li v-for="(item,key) in timeList" v-bind:key="key" ref="temtext" :class="{active:key==currentTimeIndex}" @click="changeTime(key)">
          {{item.Type}}天
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
          <span>{{timeList[currentTimeIndex].Count}}</span>个{{title}}， 累计最高
          <span>{{tongjiObj.max.value}}</span>天（{{tongjiObj.max.name}}）， 累计最小
          <span>{{tongjiObj.min.value}}</span>天（{{tongjiObj.min.name}}）。
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
      title: "近一个月----无降水站点数",
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
        "积雪"
      ],
      elementType: "高于",
      elementUnit: ["mm", "℃", "℃", "m/s", "d", "cm"],
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
    renderTable(dt) {
      dt = _.filter(dt, function(item) {
        return item.Days != null && item.Days != "null" && item.Days != "";
      });
      // var data = (_.sortBy(dt, "Days")).reverse();
      var data = dt.sort(_.compare("Days", "desc"));
      var MAX = data[0];
      var MIN = data[data.length - 1];
      var _AreaResult = this.AreaResult;
      var totalVal = 0;
      for (var i = 0; i < _AreaResult.length; i++) {
        totalVal += parseFloat(_AreaResult[i].AvgDay);
      }
      this.tongjiObj = {
        max: { value: MAX.Days, feid: "最大值", name: MAX.StationName },
        min: { value: MIN.Days, feid: "最小值", name: MIN.StationName },
        avg: {
          value: parseFloat(totalVal / _AreaResult.length).toFixed(1),
          feid: "平均值",
          name: moment(_AreaResult[0].ObservTime).format("MM-DD HH:mm")
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
          var result = response.data;
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
      this.$store.commit("chooseElement", { name: "干旱", index: 4 });
      this.$router.push({
        name: "temstatistics",
        query: { element: "Drought" }
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
      vm.$store.commit("chooseElement", { name: "干旱", index: 4 });
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
        "累计降雪" +
        this.$refs.temtext[this.currentTimeIndex].innerText +
        "cm以上站点数";
    }
  },
  components: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.main {
  background: url("../../assets/images/dry.jpg") center center no-repeat;
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
