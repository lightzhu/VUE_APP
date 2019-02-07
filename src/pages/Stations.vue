<template>
  <div class="stations" style="height:100%">
    <main-head :title="pagetitle"></main-head>
    <warning-nav :navdata="navlist" @changeType="changeStation"></warning-nav>
    <div class="main">
      <!-- v-for="(item,key) in warningList" :key="key" -->
      <div class="main-item" v-for="(item,key) in stationInfo[elementIndex].list" :key="key" :class="{expend:key==unfoldIndex}">
        <h4 class="clear" v-on:click="toogleStation(key)">
          <span class="station fl">
            <i class="icon icon-yuandianda"></i>
            <span>{{item.stationtype}}</span>
          </span>
          <span class="num fr">
            <span>{{item.data.length}}个</span>
            <i class="icon icon-xiala1"></i>
          </span>
        </h4>
        <p class="station-box">
          <ul>
            <li v-for="(val,key) in item.data" :key="key">
              <span class="name">{{val.StationName}}</span>
              <span class="station-id">{{val.StationId}}</span>
              <span class="fr street">{{val.Address}}</span>
            </li>
          </ul>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import MainHead from "../components/MainHead.vue";
import WarningNav from "../components/WarningNav.vue";

export default {
  name: "Home",
  data() {
    return {
      navlist: [
        { name: "气象", ID: "1" },
        { name: "水利", ID: "2" },
        { name: "环保", ID: "3" },
        { name: "国土", ID: "4" }
      ],
      pagetitle: "站点信息",
      unfoldIndex: "0",
      elementIndex: "0",
      hostApi: this.$store.state.hostIP, //服务器地址
      stationInfo: [
        {
          name: "气象",
          list: [
            {
              stationtype: "气象国家站",
              data: [
                { StationName: "安吉", StationId: "58446", Address: "昌硕街道" }
              ]
            },
            {
              stationtype: "气象区域站",
              data: [
                { StationName: "杭垓", StationId: "K5030", Address: "杭垓镇" },
                { StationName: "皈山", StationId: "K5052", Address: "皈山乡" },
                {
                  StationName: "梅村边",
                  StationId: "K5129",
                  Address: "梅村边"
                },
                {
                  StationName: "章村",
                  StationId: "K83745",
                  Address: "天子湖镇"
                },
                { StationName: "姚村", StationId: "K5118", Address: "杭垓镇" },
                {
                  StationName: "溪龙",
                  StationId: "K98763",
                  Address: "递铺街道"
                },
                { StationName: "鄣吴", StationId: "K5044", Address: "鄣吴镇" },
                { StationName: "杭垓", StationId: "K5030", Address: "杭垓镇" }
              ]
            }
          ]
        },
        {
          name: "水利",
          list: [
            {
              stationtype: "标准雨量站",
              data: [
                { StationName: "安吉", StationId: "58446", Address: "递铺街道" }
              ]
            },
            {
              stationtype: "河道站",
              data: [
                { StationName: "杭垓", StationId: "K5030", Address: "杭垓镇" }
              ]
            },
            {
              stationtype: "水库站",
              data: [
                { StationName: "杭垓", StationId: "K5030", Address: "杭垓镇" }
              ]
            },
            // {
            //   stationtype: "其他水利站",
            //   data: [
            //     { StationName: "杭垓", StationId: "K5030", Address: "杭垓镇" }
            //   ]
            // }
          ]
        },
        {
          name: "环保",
          list: [
            {
              stationtype: "环保站",
              data: [
                { StationName: "罗村", StationId: "K98763", Address: "上墅乡" }
              ]
            },
            {
              stationtype: "环保国家站",
              data: [
                { StationName: "杭垓", StationId: "K5030", Address: "杭垓镇" }
              ]
            }
          ]
        },
        {
          name: "国土",
          list: [
            {
              stationtype: "国土国家站",
              data: [
                {
                  StationName: "溪龙",
                  StationId: "K98763",
                  Address: "递铺街道"
                }
              ]
            },
            {
              stationtype: "国土区域站",
              data: [
                { StationName: "杭垓", StationId: "K5030", Address: "杭垓镇" }
              ]
            }
          ]
        }
      ]
    };
  },
  methods: {
    toogleStation(key) {
      this.unfoldIndex = key;
    },
    changeStation(index, item) {
      this.elementIndex = index;
    },
    dealWeatherData(list) {
      var _this = this;
      var stationType = _this.stationInfo[0];
      stationType.list[0].data.splice(0);
      stationType.list[1].data.splice(0);
      list.forEach(item => {
        if (item.StationId.match(/^5/)) {
          stationType.list[0].data.push(item);
        } else {
          stationType.list[1].data.push(item);
        }
      });
    },
    dealWaterData(list) {
      var _this = this;
      var stationType = _this.stationInfo[1];
      for (var i = 0; i < stationType.list.length; i++) {
        stationType.list[i].data.splice(0);
      }
      // stationType.list.splice(0);
      list.forEach(item => {
        if (item.StationModel.indexOf("雨量") != -1) {
          stationType.list[0].data.push(item);
        } else if (item.StationModel.indexOf("河道") != -1) {
          stationType.list[1].data.push(item);
        } else if (item.StationModel.indexOf("水库") != -1) {
          stationType.list[2].data.push(item);
        } else {
          stationType.list[1].data.push(item);
        }
      });
    },
    dealEnvironmentData(list) {
      var _this = this;
      var stationType = _this.stationInfo[2];
      for (var i = 0; i < stationType.list.length; i++) {
        stationType.list[i].data.splice(0);
      }
      list.forEach(item => {
        stationType.list[0].data.push(item);
      });
    },
    dealGeographyData(list) {
      var _this = this;
      var stationType = _this.stationInfo[3];
      for (var i = 0; i < stationType.list.length; i++) {
        stationType.list[i].data.splice(0);
      }
      list.forEach(item => {
        stationType.list[0].data.push(item);
      });
    },
    getStationInfo() {
      var that = this;
      that.Indicator.open({spinnerType: 'fading-circle'});
      that.axios
        .get(that.hostApi + `/StationManage/Station/GetStationInfo`)
        .then(function(response) {
          var result = response.data;
          if (result && result instanceof Object) {
            for (var item of result) {
              switch (item.Key) {
                case "自动气象站":
                  that.dealWeatherData(item.DataList);
                  break;
                case "水利站":
                  that.dealWaterData(item.DataList);
                  break;
                case "环保站":
                  that.dealEnvironmentData(item.DataList);
                  break;
                case "国土站":
                  that.dealGeographyData(item.DataList);
                  break;
                default:
                  console.log("没有找到站点类型");
                  break;
              }
            }
          }
          that.Indicator.close();
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  },
  beforeMount: function() {
    this.getStationInfo(); //初始化页面数据
  },
  components: {
    "main-head": MainHead,
    "warning-nav": WarningNav
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.stations{
  background: transparent;
}
.main {
  border-top: 0.2rem solid;
  border-color: #1a03a0;
  background: #f3f5f6;
  padding-bottom: 0.625rem;
  height: calc(100% - 4.22rem);
  padding-top: 0.6875rem;
  overflow: auto;

  .main-item {
    margin: 0 auto 0.625rem;
    background: #fff;
    width: 22.18rem;
    border-radius: 0.3rem;
    box-shadow: 0 0 5px 0 rgba(213, 213, 213, 0.52);
    &.expend {
      h4 {
        .icon-xiala1 {
          transform: rotate(180deg);
        }
      }
      p.station-box {
        height: auto;
        opacity: 1;
      }
    }
    h4 {
      padding: 0 0.9rem;
      height: 2.82rem;
      line-height: 2.82rem;
      font-size: 1rem;
      font-weight: 500;
      color: #130909;
      .station {
        i {
          color: #16018d;
          font-size: 0.9rem;
        }
      }
      .num {
        span {
          color: #16018d;
          font-size: 1.25rem;
          line-height: 2.5rem;
        }
        i {
          display: inline-block;
          height: 1.125rem;
          width: 1.125rem;
          line-height: 1.125rem;
          background: #d8d8d8;
          color: #fff;
          border-radius: 50%;
        }
      }
      .icon-xiala1 {
        transition: all 1s ease;
        transform: rotate(0deg);
      }
    }
    p.station-box {
      border-top: 1px solid rgba(47, 59, 85, 0.3);
      // margin: 0 0.8rem;
      padding: 0 1.125rem;
      text-align: left;
      font-size: 0.875rem;
      color: #4a4a4a;
      height: 0;
      opacity: 0;
      overflow: hidden;
      transition: all 1s ease;
      background: rgba(243, 245, 246, 0.3);
      li {
        height: 2.5rem;
        line-height: 2.5rem;
        border-top: 1px solid #ebeef2;
        padding: 0 0.5rem;
        &:first-child {
          border: none;
        }
        .name {
          display: inline-block;
          min-width: 30%;
          font-weight: 600;
          color:#4a4a4a;
        }
        .station-id {
          font-size: 0.75rem;
          color: #9b9b9b;
        }
        .street{
          color:#4a4a4a;
        }
      }
    }
  }
}
</style>
