<template>
  <div class="rain">
    <!-- <statistics-nav :secnavlist="timeList" @changeTimeSlider="handerTimeSliderClick" :perViewNum="perViewNum"></statistics-nav> -->
    <div class="rain-main">
      <div class="main-item">
        <h4>
          <span class="val" style="width:24%">站点</span>
          <span class="val">1小时积雪</span>
          <span class="val">3小时积雪</span>
          <span class="val">时间</span>
        </h4>
        <div class="chart-list" v-for="(item,key) in warningStations" v-bind:key="key">
          <div class="station-title">
            <p class="station-name">
              <span class="station-name">{{item.StationName}}</span>
            </p>
            <p class="station-val">
              <span class="val">{{item.OneHourSnowDepth}}</span>{{temUnit}}
            </p>
            <p class="station-val">
              <span class="val">{{item.ThreeHourSnowDepth}}</span>{{temUnit}}
            </p>
            <p class="street">{{item.Time}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import _ from "underscore";
import moment from "moment";
import mydata from "@/assets/temdata.js";

export default {
  name: "snowstatistics",
  data() {
    return {
      isShow: false, //预警是否显示
      perViewNum: 4,
      currentIndex: 0,
      timeList: [],
      currentTimeIndex: 0,
      elementType: this.$route.query.element,
      temUnit: "cm",
      activeEleIndex: this.$store.state.statisticsIndex,
      hostApi: this.$store.state.hostIP, //服务器地址
      elementApiUrl: [
        "/Rainfall/GetRainInfo",
        "/Temp/GetTempInfo?type=HighTemp",
        "/Temp/GetTempInfo?type=LowTemp",
        "/Drought/GetNoRainInfoByMonth",
        "/Snows/GetSnowsDepthInfo"
      ],
      warningStations: [
        {
          StationName: "安吉",
          StationType: "气象",
          OneHourSnowDepth: "--",
          ThreeHourSnowDepth:"--",
          Address: "----",
          StationId: "Z0001"
        }
      ]
    };
  },
  methods: {
    dealStationList(data) {
      this.warningStations = data.map(function(item) {
        if (_.isEmpty(item.OneHourSnowDepth)) {
          item.OneHourSnowDepth = "--";
        }
        if (_.isEmpty(item.ThreeHourSnowDepth)) {
          item.ThreeHourSnowDepth = "--";
        }
        item.Time = moment(item.ObservTime).format("MM/DD HH:mm");
        return item;
      });
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
          console.log(response);
          var result = response.data.resultdata;
          if (result && result instanceof Object) {
            if (result.TableInfo.length > 0) {
              that.dealStationList(result.TableInfo);
            }
          }
          that.Indicator.close();
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
      this.elementType = this.$route.query.element;
      this.getElementData(this.elementApiUrl[this.elementIndex], false);
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
    } else if (this.$route.query.element === "Drought") {
      this.$store.commit("chooseElement", { name: "干旱统计", index: 3 });
    } else {
      this.$store.commit("chooseElement", { name: "积雪统计", index: 4 });
    }
  },
  mounted() {
    this.getElementData(this.elementApiUrl[this.elementIndex], false); //初始化页面数据
  },
  updated: function() {},
  components: {}
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
  height:100%;
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
    padding:0;
    margin: 0 0.56rem;
    font-size:0.85rem;
    .val {
      font-weight: 600;
      color: #4a4a4a;
      display: inline-block;
      width: 24%;
      padding-left:0.5rem;
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
        width: 25%;
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
          width: 25%;
          text-align: center;
          .val {
            color: #e74c3c;
            margin-right:0.5rem;
          }
        }
        &.street {
          width: 25%;
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