<template>
  <div class="main">
    <div class="nav-bar">
      <ul>
        <li v-for="(item,key) in timeList" v-bind:key="key" :class="{active:key==currentTimeIndex}" @click="changeTime(key)">
          {{item.Key}}
        </li>
        <!-- <li>3h</li>
        <li>6h</li>
        <li>12h</li>
        <li>48h</li>
        <li>72h</li> -->
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
          <span class="val">{{item.value}}&nbsp;{{elementUnit}}</span>
          <span class="st-name">{{item.name}}</span>
        </p>
      </div>
    </div>
    <div class="map-box">
      <div class="svg" @click="toRainStatistics">
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
  name: "HomeMain",
  data() {
    return {
      timeList: [
        { Key: "1h", Count: 0, Percent: 0, WarningInfo: [] },
        { Key: "3h", Count: 0, Percent: 0, WarningInfo: [] },
        { Key: "6h", Count: 0, Percent: 0, WarningInfo: [] },
        { Key: "12h", Count: 0, Percent: 0, WarningInfo: [] },
        { Key: "24h", Count: 0, Percent: 0, WarningInfo: [] },
        { Key: "48h", Count: 0, Percent: 0, WarningInfo: [] },
        { Key: "72h", Count: 3, Percent: 3.1, WarningInfo: [] }
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
      title: "近1小时降水超过10mm站点数",
      station_num: "0",
      station_percent: "--%",
      activeIndex2: "1",
      activeElementIndex: this.$store.state.choosedElementIndex,
      elementApiUrl: "/Rainfall/GetRainInfo",
      hostApi: this.$store.state.hostIP,
      elementUnit: "mm",
      percentObj: {
        color: "#F8E71C",
        percent: 36.5,
        title: "超过20mm降雨量站点数"
      },
      ischeck: this.$store.state.ischecked,
      autoupdate: null
    };
  },
  methods: {
    changeTime(key) {
      this.currentTimeIndex = key;
      this.currentTimeText = this.timeList[key].Key;
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
      var timeText = this.currentTimeText;
      var valueData = "PRE_" + timeText;
      //console.log(valueData);
      data = _.filter(data, function(item) {
        return (
          item[valueData] != null &&
          item[valueData] != "null" &&
          item[valueData] != ""
        );
      });
      // data = _.sortBy(data, valueData).reverse();
      data = data.sort(_.compare(valueData, "desc"));
      var MAX = data[0];
      var MIN = data[data.length - 1];
      var AVG = "";
      var _AreaResult = this.AreaResult;
      for (var i = 0; i < _AreaResult.length; i++) {
        if (_AreaResult[i].Key === timeText) {
          AVG = _AreaResult[i];
        }
      }
      this.tongjiObj = {
        max: { value: MAX[valueData], feid: "最大值", name: MAX.StationName },
        min: { value: MIN[valueData], feid: "最小值", name: MIN.StationName },
        avg: {
          value: AVG.CountyAvgPRE,
          feid: "平均值",
          name: moment(AVG.ObservTime).format("MM-DD HH:mm")
        }
      };
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
    toRainStatistics() {
      this.$store.commit("chooseElement", { name: "降水统计", index: 0 });
      this.$router.push({ name: "rainstatistics" });
    },
    getwarning() {
      var that = this;
      var data=[
        {
          MessageTime: "2018-06-15 15:00",
          level: "level3",
          SourceCategory: "阈值告警",
          Content: "安吉国家站PM2.514:45数据较之前5分钟增加10μg/m3，请注意查看"
        },
        {
          MessageTime: "2018-06-15 15:00",
          level: "level3",
          SourceCategory: "质量控制",
          Content: "安吉国家站PM2.514:45数据较之前5分钟增加10μg/m3，请注意查看"
        },
        {
          MessageTime: "2018-06-15 15:00",
          level: "level3",
          SourceCategory: "阈值告警",
          Content: "安吉国家站PM2.514:45数据较之前5分钟增加10μg/m3，请注意查看"
        },
        {
          MessageTime: "2018-06-15 15:00",
          level: "level3",
          SourceCategory: "质量控制",
          Content: "安吉国家站PM2.514:45数据较之前5分钟增加10μg/m3，请注意查看"
        },
        {
          MessageTime: "2018-06-15 15:00",
          level: "level3",
          SourceCategory: "阈值告警",
          Content: "安吉国家站PM2.514:45数据较之前5分钟增加10μg/m3，请注意查看"
        },
        {
          MessageTime: "2018-06-15 15:00",
          level: "level3",
          SourceCategory: "阈值告警",
          Content: "安吉国家站PM2.514:45数据较之前5分钟增加10μg/m3，请注意查看"
        },
        {
          MessageTime: "2018-06-15 15:00",
          level: "level3",
          SourceCategory: "质量控制",
          Content: "安吉国家站PM2.514:45数据较之前5分钟增加10μg/m3，请注意查看"
        },
        {
          MessageTime: "2018-06-15 15:00",
          level: "level3",
          SourceCategory: "质量控制",
          Content: "安吉国家站PM2.514:45数据较之前5分钟增加10μg/m3，请注意查看"
        }
      ];
      that.$store.commit("updateWarning", data);
    },
    checkuser() {
      console.log(window.localStorage.getItem("account"));
      var that = this;
      that.Indicator.open({ spinnerType: "fading-circle" });
      if (localStorage.hasOwnProperty("user") != false) {
        that.axios
          .get(this.hostApi + `/InterfaceManage/OuterApi/CheckLogin`, {
            params: {
              username: window.localStorage.getItem("account"),
              password: that.$md5(window.localStorage.getItem("userpd"))
            }
          })
          .then(function(response) {
            var result = response.data;
            if (result.type == 1) {
              that.$store.commit("login", result.resultdata);
              that.$store.commit("checkuser");
              /*验证完毕，更新数据*/
              that.getElementData(that.elementApiUrl);
              that.getwarning();
            } else {
              mui.toast("用户名或密码错误！");
              localStorage.removeItem("user");
              localStorage.removeItem("userpd");
              that.Indicator.close();
            }
          })
          .catch(function(error) {
            mui.toast("用户验证异常,请退出重新登录");
            that.$router.replace({ name: "login" });
            that.Indicator.close();
          });
      }
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
      this.getElementData(this.elementApiUrl);
    },
    currentTimeIndex() {
      this.renderTable(this.TableInfo);
    }
  },
  mounted: function() {
    if (this.ischeck) {
      this.getElementData(this.elementApiUrl);
      this.getwarning();
    } else {
      /*app加载后要验证用户登录，设置cookie*/
      this.checkuser();
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$store.commit("chooseElement", { name: "降水", index: 0 });
    });
  },
  updated: function() {
    //更新标题
    this.title = this.timeList[this.currentTimeIndex].Title;
  },
  activated: function() {
    var that = this;
    this.autoupdate = setTimeout(function() {
      that.getElementData(that.elementApiUrl, true);
      that.getwarning();
    }, 30000);
  },
  deactivated:function(){
    clearTimeout(this.autoupdate);
  },
  components: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.main {
  background: url("../../assets/images/rain.jpg") center center no-repeat;
  background-size: cover;
}
</style>
