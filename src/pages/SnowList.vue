<template>
  <div class="stations" style="height:100%">
    <snow-head :title="pagetitle" :back_icon="true"></snow-head>
    <div class="main">
      <!-- v-for="(item,key) in warningList" :key="key" -->
      <div class="main-item">
        <div class="list-head">
          <span class="max">最大</span>
          <span class="avg">平均</span>
          <span class="time">上报时间</span>
        </div>
        <ul class="list-box">
          <li v-for="(item,key) in snowList" :key="key">
            <span class="max">{{item.Max_Snow_Depth}}<i>cm</i></span>
            <span class="avg">{{item.Avg_Snow_Depth}}<i>cm</i></span>
            <span class="time">{{item.ObservTime}}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import SnowHead from "../components/CenterHead.vue";

export default {
  name: "Home",
  data() {
    return {
      pagetitle: "历史上报",
      hostApi: this.$store.state.hostIP, //服务器地址
      snowList: [
        {
          Avg_Snow_Depth: "20",
          Max_Snow_Depth: "20",
          ObservTime: "2018-09-26 12:00:00"
        }
      ]
    };
  },
  methods: {
    getSnowList() {
      var that = this;
      that.Indicator.open({spinnerType: 'fading-circle'});
      that.axios
        .get(
          that.hostApi +
            `/InterfaceManage/OuterApi/GetHistorySnowData`
        )
        .then(function(response) {
          var result = response.data;
          that.snowList = result.resultdata;
          that.Indicator.close();
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  },
  beforeMount: function() {
    this.getSnowList(); //初始化页面数据
  },
  components: {
    "snow-head": SnowHead
  },
  activated: function() {
   this.getSnowList();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.stations {
  background: transparent;
}
.main {
  border-top: 0.2rem solid;
  border-color: #1a03a0;
  background: #f3f5f6;
  padding-bottom: 0.625rem;
  height: calc(100% - 2.5rem);
  padding-top: 0.6875rem;
  overflow: auto;
  .main-item {
    margin: 0.625rem;
    border-radius: 5px;
    padding:0.8rem 1.25rem;
    background-color: #ffffff;
    box-shadow: 0 0 5px 0 rgba(213, 213, 213, 0.52);
    color: #4a4a4a;
    .max{
      display: inline-block;
      width: 25%;
      font-size:1.1875rem;
      i{
        font-style: normal;
        color: #9b9b9b;
        font-size:0.75rem;
      }
    }
    .avg{
      display: inline-block;
      width: 25%;
      font-size:1.1875rem;
      i{
        font-style: normal;
        color: #9b9b9b;
        font-size:0.75rem;
      }
    }
    .time{
      display: inline-block;
      width: 45%;
      font-size:0.875rem;
    }
  }
  .list-head{
    height:2.5rem;
    line-height: 2.5rem;
    font-size:1rem;
    color:#4a4a4a;
    .avg,.max,.time{
      font-size:1rem;
    }
  }
  .list-box{
    li{
      height:2.375rem;
      line-height:2.375rem;
      border-bottom:1px solid #ebeef2;
    }
  }
}
</style>
