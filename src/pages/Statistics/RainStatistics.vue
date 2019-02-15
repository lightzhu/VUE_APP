<template>
  <div class="rain">
    <statistics-nav :secnavlist="timeList" @changeTimeSlider="handerTimeSliderClick" :perViewNum="perViewNum"></statistics-nav>
    <div class="rain-main">
      <div class="main-item">
        <h4>
          <i class="icon icon-yuandianzhong"></i>
          <span class="val">{{stListTitle[initTimeKey[currentTimeIndex]]}}</span>
          <span class="num fr">{{warningStations.length}}个</span>
        </h4>
        <div class="chart-list" v-for="(item,key) in warningStations" v-bind:key="key">
          <div class="station-title" v-on:click="changeStation(key,item.StationId)">
            <p class="station-name">
              <span class="type">{{item.StationType}}</span>
              <span class="station-name">{{item.StationName}}</span>
            </p>
            <p class="station-val">
              <span class="val">{{item[initTimeRef]}}</span>mm</p>
            <p class="street">{{item.Address}}</p>
          </div>
          <p class="chart-box" :ref="item.StationId" v-show="key==currentIndex">

          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import StatisticsNav from "@/components/StatisticsNav.vue";
import _ from "underscore";
import moment from "moment";
// import mydata from "@/assets/data.js";
import echarts from "echarts";
export default {
  name: "rainstat",
  data() {
    return {
      isShow: false, //预警是否显示
      perViewNum: 5, //时间slider默认显示个数
      currentIndex: 0,
      timeList: [],
      currentTimeIndex: 0,
      initTimeKey: ["1h", "3h", "6h", "12h", "24h", "48h", "72h"],
      initTimeRef: "PRE_1h",
      activeEleIndex: this.$store.state.statisticsIndex,
      hostApi: this.$store.state.hostIP, //服务器地址
      elementApiUrl: [
        "/Rainfall/GetRainInfo",
        "/Temp/GetTempInfo?type=HighTemp",
        "/Temp/GetTempInfo?type=LowTemp",
        "/Drought/GetNoRainInfoByMonth",
        "积雪"
      ],
      staionsObj: null,
      staionsList: [],
      stListTitle: {
        "1h": "超过10mm站点",
        "3h": "超过15mm站点",
        "6h": "超过20mm站点",
        "12h": "超过30mm站点",
        "24h": "超过35mm站点",
        "48h": "超过40mm站点",
        "72h": "超过45mm站点"
      },
      warningStations: [
        {
          StationName: "溪龙",
          StationType: "气象",
          PRE_1h: "22",
          Address: "递铺街道",
          StationId: "Z0001"
        }
      ],
      chart: null,
      autoupdate:null,
      chartOpt: {
        color: ["#16018d"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow"
          },
          formatter: "{a}<br />{b0}时: {c0}mm"
        },
        grid: {
          left: "3%",
          right: "3%",
          bottom: "3%",
          top: "6%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: [],
            axisTick: {
              alignWithLabel: true
            },
            splitLine: {
              show: true,
              interval: 0,
              lineStyle: {
                color: "#eeeeee"
              }
            },
            axisLine: {
              lineStyle: {
                color: "#adadad"
              }
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            axisLabel: {
              textStyle: {
                color: "#949494"
              }
            },
            axisLine: {
              lineStyle: {
                color: "#eeeeee"
              }
            }
          }
        ],
        series: [
          {
            name: "降雨量",
            type: "bar",
            barWidth: "50%",
            data: []
          }
        ]
      }
    };
  },
  methods: {
    ievent(data) {
      this.isShow = data;
    },
    changeStation(index, item) {
      this.currentIndex = index;
      console.log(index, item);
      this.getStaionData(item);
    },
    resetChart() {
      if (!this.chart) {
        return;
      }
      this.chart.dispose();
      this.chart = null;
    },
    initChart() {
      this.resetChart();
      var thisref = this.warningStations[this.currentIndex].StationId;
      this.chart = echarts.init(this.$refs[thisref][0]);
      // 把配置和数据放这里
      this.chart.setOption(this.chartOpt);
    },
    dealCountData(data) {
      var timeIndex = this.currentTimeIndex;
      this.timeList = [];
      data.forEach((element, key) => {
        this.timeList.push({
          text: "近" + parseInt(element.Key) + "小时",
          Key: element.Key
        });
      });
      console.log(this.staionsObj);
    },
    dealStationList(data) {
      var arr = [];
      this.staionsObj.forEach((val, index) => {
        if (val.Key === this.initTimeKey[this.currentTimeIndex]) {
          for (var i = 0; i < val.WarningInfo.length; i++) {
            var fitItem = _.where(data, { StationId: val.WarningInfo[i] })[0];
            arr.push(fitItem);
          }
        }
      });
      this.warningStations = arr;
      if (this.warningStations.length > 0) {
        this.getStaionData(this.warningStations[0].StationId);
      }
    },
    getElementData(apiUrl, load) {
      //根据选择的要素获取对应的数据
      var that = this;
      if (!load) {
        that.Indicator.open({ spinnerType: "fading-circle" });
      }
      that.axios
        .get(that.hostApi + `/InterfaceManage` + apiUrl)
        .then(function(response) {
          var result = response.data; //这个是模拟数据
          if (result && result instanceof Object) {
            that.staionsObj = result.CountResult;
            if (result.CountResult.length > 0) {
              // that.timeList = result.CountResult;
              that.dealCountData(result.CountResult);
            }
            if (result.TableInfo.length > 0) {
              that.staionsList = result.TableInfo;
              that.dealStationList(result.TableInfo);
            }
          }
          that.Indicator.close();
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    handerTimeSliderClick(msg, index) {
      this.initTimeRef = "PRE_" + msg;
      this.currentTimeIndex = index;
      this.dealStationList(this.staionsList);
      console.log(index);
    },
    getStaionData(ID) {
      var that = this;
      that.axios
        .get(that.hostApi + `/InterfaceManage/OuterApi/GetLatestHourInfo`, {
          params: { stationId: ID, element: "Rain" }
        })
        .then(function(response) {
          console.log(response);
          var result = response.data;
          // var result = mydata;
          if (result && result.DataList.length > 0) {
            that.chartOpt.xAxis[0].data = [];
            that.chartOpt.series[0].data = [];
            var seriesData = [];
            for (var i = 0; i < result.DataList.length; i++) {
              that.chartOpt.xAxis[0].data.push(
                moment(result.DataList[i].ObservTime).format("HH")
              );
              that.chartOpt.series[0].data.push(result.DataList[i].ValueData);
            }
            that.initChart();
          }
        })
        .catch(function(error) {
          console.log(error);
        });
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
    },
    chartOpt: {
      handler: function(newVal, oldVal) {
        if (newVal) {
          console.log("changed ");
          //this.chart.setOption(newVal);
        } else {
          console.log("没变 ");
          //this.chart.setOption(oldVal);
        }
      },
      deep: true
    }
  },
  beforeMount: function() {
    this.$store.commit("chooseElement", { name: "降水统计", index: 0 });
    this.getElementData(this.elementApiUrl[this.elementIndex]); //初始化页面数据
  },
  mounted() {
    this.initChart();
  },
  activated: function() {
    this.$store.commit("chooseElement", { name: "降水统计", index: 0 });
    var that = this;
    this.autoupdate = setTimeout(function() {
      console.log("自动更新");
      that.getElementData(that.elementApiUrl[that.elementIndex], true); //初始化页面数据
    }, 30000);
  },
  deactivated:function(){
    clearTimeout(this.autoupdate);
    console.log("离开组件");
  },
  beforeDestroy() {
    this.resetChart();
  },
  components: {
    // "home-head": HomeHead,
    "statistics-nav": StatisticsNav
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.rain {
  height: 100%;
}
.rain-main {
  border-top: 0.2rem solid;
  border-color: #1a03a0;
  padding-top: 0.6875rem;
  background: #f3f5f6;
  height: calc(100% - 1.4rem);
  overflow: auto;
}
.main-item {
  margin: 0 auto;
  background: #fff;
  width: 22.18rem;
  border-radius: 0.3rem;
  box-shadow: 0 0 5px 0 rgba(213, 213, 213, 0.52);
  h4 {
    height: 3.125rem;
    line-height: 3.125rem;
    text-align: left;
    padding: 0 1rem;
    i {
      color: #16018d;
    }
    .val {
      margin-left: 0.5rem;
      font-weight: 600;
      color: #4a4a4a;
    }
    .num {
      color: #16018d;
      font-size: 1.25rem;
      font-weight: 500;
    }
  }
  .chart-list {
    padding: 0 0.56rem;
    .station-title {
      display: flex;
      height: 2.5rem;
      border-top: 1px solid #d3d5db;
      p {
        flex-grow: 1;
        line-height: 2.5rem;
        width: 43%;
        color: #9b9b9b;
        &.station-name {
          text-align: left;
          .type {
            display: inline-block;
            width: 2rem;
            background: #ebeef2;
            font-size: 0.7rem;
            color: #d0d0d0;
            line-height: 1.118rem;
            text-align: center;
            border-radius: 0.3rem;
            height: 1.118rem;
          }
          .station-name {
            margin-left: 0.5rem;
            color: #4a4a4a;
            font-weight: 600;
          }
        }
        &.station-val {
          width: 23%;
          .val {
            color: #e74c3c;
          }
        }
        &.street {
          width: 33%;
          color: #4a4a4a;
        }
      }
    }
    .chart-box {
      height: 8.375rem;
    }
  }
}
</style>