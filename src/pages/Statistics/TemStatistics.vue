<template>
  <div class="rain">
    <statistics-nav :secnavlist="timeList" @changeTimeSlider="handerTimeSliderClick" :perViewNum="perViewNum"></statistics-nav>
    <div class="rain-main">
      <div class="main-item">
        <h4>
          <i class="icon icon-yuandianzhong"></i>
          <span class="val">{{stListTitle}}</span>
          <span class="num fr">{{warningStations.length}}个</span>
        </h4>
        <div class="chart-list" v-for="(item,key) in warningStations" v-bind:key="key">
          <div class="station-title" v-on:click="changeStation(key,item.StationId)">
            <p class="station-name">
              <span class="type">{{item.StationType}}</span>
              <span class="station-name">{{item.StationName}}</span>
            </p>
            <p class="station-val" v-if="item.DayTemp">
              <span class="val">{{item.DayTemp}}</span>{{temUnit}}
            </p>
            <p class="station-val" v-else>
              <span class="val">{{item.Days}}</span>{{temUnit}}
            </p>
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
import mydata from "@/assets/temdata.js";
import echarts from "echarts";
export default {
  name: "rainstat",
  data() {
    return {
      isShow: false, //预警是否显示
      perViewNum: 4,
      currentIndex: 0,
      timeList: [],
      currentTimeIndex: 0,
      elementType: this.$route.query.element,
      initTimeKey: ["35", "38", "40", "999"],
      temType: "高于",
      temUnit: "℃",
      chartUnit: "℃",
      chartFormat: "HH",
      activeEleIndex: this.$store.state.statisticsIndex,
      hostApi: this.$store.state.hostIP, //服务器地址
      elementApiUrl: [
        "/Rainfall/GetRainInfo",
        "/Temp/GetTempInfo?type=HighTemp",
        "/Temp/GetTempInfo?type=LowTemp",
        "/Drought/GetNoRainInfoByMonth",
        ""
      ],
      staionsObj: null,
      staionsList: [],
      stListTitle: "温度高于35℃站点数",
      warningStations: [
        {
          StationName: "溪龙",
          StationType: "气象",
          DayTemp: "22",
          Address: "递铺街道",
          StationId: "Z0001"
        }
      ],
      chart: null,
      chartOpt: {
        color: ["#ffc107"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow"
          },
          formatter: "{a}<br />{b0}时: {c0}℃"
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
            name: "24小时温度",
            type: "line",
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
      this.initTimeKey.splice(0);
      data.forEach((element, key) => {
        this.initTimeKey.push(element.Type);
        var obj = {};
        if (element.Type == "999") {
          this.timeList.push({
            text: "创历史",
            Key: element.Type
          });
        } else {
          this.timeList.push({
            text: this.temType + parseInt(element.Type) + this.temUnit,
            Key: element.Type
          });
        }
      });
    },
    dealStationList(data) {
      var arr = [];
      console.log(data);
      this.staionsObj.forEach((val, index) => {
        if (val.Type === this.initTimeKey[this.currentTimeIndex]) {
          this.stListTitle = val.Title;
          for (var i = 0; i < val.WarningInfo.length; i++) {
            var fitItem = _.where(data, { StationId: val.WarningInfo[i] })[0];
            arr.push(fitItem);
          }
        }
      });
      this.warningStations = arr;
      if (this.warningStations.length > 0) {
        console.log(this.warningStations);
        var hasPre = false;
        if(this.warningStations[this.currentIndex]){
          /*如果存在之前的站*/
          hasPre=true;
        }
        if(hasPre){
          this.getStaionData(this.warningStations[this.currentIndex].StationId);
        }else{
          this.currentIndex = 0;
          this.getStaionData(this.warningStations[0].StationId);
        }
      }
    },
    getElementData(apiUrl) {
      //根据选择的要素获取对应的数据
      var that = this;
      that.axios
        .get(that.hostApi + `/InterfaceManage` + apiUrl)
        .then(function(response) {
          console.log(response);
          var result = response.data;
          //var result = mydata; //这个是模拟数据
          if (result && result instanceof Object) {
            that.staionsObj = result.CountResult;
            if (result.CountResult.length > 0) {
              that.dealCountData(result.CountResult);
            }
            if (result.TableInfo.length > 0) {
              that.staionsList = result.TableInfo;
              that.dealStationList(result.TableInfo);
            }
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    handerTimeSliderClick(msg, index) {
      this.initTimeRef = "PRE_" + msg;
      this.currentTimeIndex = index;
      this.dealStationList(this.staionsList);
    },
    getStaionData(ID) {
      console.log(ID);
      var that = this;
      that.Indicator.open({spinnerType: 'fading-circle'});
      that.axios
        .get(that.hostApi + `/InterfaceManage/OuterApi/GetLatestHourInfo`, {
          params: { stationId: ID, element: that.elementType }
        })
        .then(function(response) {
          console.log(response);
          var result = response.data;
          if (result && result.DataList.length > 0) {
            that.chartOpt.xAxis[0].data = [];
            that.chartOpt.series[0].data = [];
            var seriesData = [];
            for (var i = 0; i < result.DataList.length; i++) {
              that.chartOpt.xAxis[0].data.push(
                moment(result.DataList[i].ObservTime).format(that.chartFormat)
              );
              that.chartOpt.series[0].data.push(result.DataList[i].ValueData);
            }
            that.initChart();
          }
          that.Indicator.close();
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    initPageData() {
      //初始化页面不同查询要素对应的具体数据
      this.temUnit = "℃";
      this.chartFormat = "HH";
      this.chartOpt.tooltip.formatter = "{a}<br />{b0}时: {c0}℃";
      this.chartOpt.series[0].name = "24小时温度";
      this.chartOpt.series[0].type = "line";
      if (this.$route.query.element === "HighTemp") {
        this.temType = "高于";
      } else if (this.$route.query.element === "LowTemp") {
        this.temType = "低于";
      } else {
        this.temType = "";
        this.temUnit = "天";
        this.chartFormat = "DD日";
        this.chartOpt.series[0].name = "日降水";
        this.chartOpt.series[0].type = "bar";
        this.chartOpt.tooltip.formatter = "{a}<br />{b0}: {c0}mm";
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
      this.elementType = this.$route.query.element;
      this.initPageData();
      this.getElementData(this.elementApiUrl[this.elementIndex]);
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
    if (this.$route.query.element === "HighTemp") {
      this.$store.commit("chooseElement", { name: "高温统计", index: 1 });
    } else if (this.$route.query.element === "LowTemp") {
      this.$store.commit("chooseElement", { name: "低温统计", index: 2 });
    } else if(this.$route.query.element === "Drought") {
      this.$store.commit("chooseElement", { name: "干旱统计", index: 3 });
    }else {
      this.$store.commit("chooseElement", { name: "积雪统计", index: 4 });
    }
    this.initPageData();
  },
  mounted() {
    this.getElementData(this.elementApiUrl[this.elementIndex]); //初始化页面数据
  },
  updated: function() {},
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
  height: calc(100% - 1.75rem);
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
        color:#9b9b9b;
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
            color:#4a4a4a;
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
          color:#4a4a4a;
        }
      }
    }
    .chart-box {
      height: 8.375rem;
    }
  }
}
</style>