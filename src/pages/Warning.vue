<template>
  <div class="warning">
    <main-head :title="pageTitle"></main-head>
    <warning-nav @changeType="changeType" :navdata="navlist"></warning-nav>
    <div class="main">
      <div class="msg-head">
        <p class="legend">
          <i class="icon icon-yuandianda"></i>
          <span>阈值规则</span>
          <i class="icon icon-yuandianda"></i>
          <span>质量控制</span>
          <!-- <i class="icon icon-yuandianda"></i>
          <span>运行异常</span>-->
        </p>
        <p class="all-read">
          <button @click="markMsgAllRead">全部已读</button>
        </p>
      </div>

      <div
        class="main-item"
        v-for="(item,key) in warningList"
        :key="key"
        @click="toogleTools(item.SendId)"
      >
        <h4 class="clear">
          <span class="time fl">{{item.MessageTime}}</span>
          <span class="warning-type fr" v-if="item.SourceCategory.indexOf('阈值')!=-1">
            <span class="level3">{{item.SourceCategory}}</span>
            <!-- <i class="icon icon-xiala-yuan"></i> -->
          </span>
          <span class="warning-type fr" v-else-if="item.SourceCategory.indexOf('质控')!=-1">
            <span class="level2">{{item.SourceCategory}}</span>
            <!-- <i class="icon icon-xiala-yuan"></i> -->
          </span>
        </h4>
        <p class="warning-content">{{item.Content}}</p>
      </div>
    </div>
    <mt-popup v-model="popupVisible" popup-transition="popup-fade">
      <p class="popup-box">
        <button @click="markMsgIngnore">忽略</button>
        <button @click="markMsgRead">已读</button>
      </p>
    </mt-popup>
  </div>
</template>
<script>
import MainHead from "../components/MainHead.vue";
import WarningNav from "../components/WarningNav.vue";
import { Popup } from "mint-ui";
import _ from "underscore";
export default {
  name: "warning",
  data() {
    return {
      isShow: false, //预警是否显示
      currentIndex: 0,
      popupVisible: false,
      singleMsgId: null,
      pageTitle: "告警提醒",
      hostApi: this.$store.state.hostIP, //服务器地址
      navlist: [
        { name: "全部", ID: "1" },
        { name: "阈值告警", ID: "2" },
        { name: "数据异常", ID: "3" }
      ],
      allList: [
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
      ],
      warningList: []
    };
  },
  methods: {
    changeType(key, data) {
      console.log(data);
      //var keyword = data.slice(0,2);
      if (data == "全部") {
        this.warningList = this.allList;
      } else if (data.indexOf("阈值") != -1) {
        this.warningList = this.allList.filter(function(Value) {
          return Value.SourceCategory.indexOf("阈值") != -1;
        });
      } else {
        this.warningList = this.allList.filter(function(Value) {
          return Value.SourceCategory.indexOf("质量") != -1;
        });
      }
    },
    getMessage() {
      //获取预警消息
      var that = this;
      that.Indicator.open({ spinnerType: "fading-circle" });
      that.warningList = that.allList;
      setTimeout(() => {
        that.Indicator.close();
      }, 2000);
    },
    markMsgAllRead() {
      //标记消息全部已读
      var that = this;
      that.allList = [];
    },
    markMsgIngnore() {
      var that = this;
      setTimeout(() => {
        that.popupVisible = false;
      }, 1000);
    },
    markMsgRead() {
      var that = this;
      setTimeout(() => {
        that.popupVisible = false;
      }, 1000);
    },
    toogleTools(ID) {
      //单个预警弹出操作工具
      this.popupVisible = !this.popupVisible;
      this.singleMsgId = ID;
    }
  },
  mounted() {
    // this.list = this.warningList;
    this.getMessage();
  },
  updated: function() {},
  beforeDestroy() {},
  components: {
    "main-head": MainHead,
    "warning-nav": WarningNav,
    "mt-popup": Popup
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.warning {
  height: 100%;
  background: #1a03a0;
}
.main {
  border-top: 0.2rem solid;
  border-color: #1a03a0;
  background: #f3f5f6;
  padding-bottom: 0.625rem;
  height: calc(100% - 4.22rem);
  padding-top: 0.6875rem;
  overflow: auto;
  .msg-head {
    text-align: left;
    p {
      display: inline-block;
      &.all-read {
        width: 33%;
        text-align: right;
        button {
          height: 1.56rem;
          font-size: 0.8rem;
          color: #fff;
          background-color: #a9a7b4;
          border-radius: 0.75rem;
          line-height: 1;
          padding: 0 0.5rem;
          border: none;
        }
      }
    }
  }
  .legend {
    font-size: 0.7rem;
    color: #9b9b9b;
    margin-bottom: 0.5rem;
    text-align: center;
    width: 60%;
    i {
      margin: 0.3rem;
      &:first-child {
        color: #eb4d3d;
      }
      &:nth-child(3) {
        color: #f5a623;
      }
      &:nth-child(5) {
        color: #ddd;
      }
    }
  }
  .main-item {
    margin: 0 auto 0.625rem;
    background: #fff;
    width: 22.18rem;
    border-radius: 0.3rem;
    box-shadow: 0 0 5px 0 rgba(213, 213, 213, 0.52);
    h4 {
      padding: 0 0.8125rem;
      height: 1.94rem;
      line-height: 1.94rem;
      font-size: 0.75rem;

      .time {
        color: #9b9b9b;
      }
      .warning-type {
        span {
          display: inline-block;
          height: 1.18rem;
          padding: 0 0.5rem;
          line-height: 1.18rem;
          border-radius: 0.4rem;
          color: #fff;
          font-weight: 300;
          margin-right: 0.5rem;
          background: green;
          &.level1 {
            background: #ddd;
          }
          &.level2 {
            background: #f5a623;
          }
          &.level3 {
            background: #eb4d3d;
          }
        }
        i {
          display: inline-block;
          position: relative;
          top: 0.2rem;
          font-size: 1rem;
          color: #a8a5a5;
        }
      }
    }
    p.warning-content {
      border-top: 1px solid #ebeef2;
      margin: 0 0.8rem;
      padding: 0.5rem 0;
      text-indent: 2em;
      text-align: left;
      font-size: 0.9rem;
      color: #4a4a4a;
      line-height: 1.5;
    }
  }
}
.warning >>> .mint-popup {
  padding: 1rem 0;
  width: 80%;
  border-radius: 0.4rem;
  .popup-box {
    height: 5rem;
    padding: 1.2rem 0;
    text-align: center;
    button {
      width: 5rem;
      height: 2.2rem;
      border-radius: 5px;
      background-color: #10b2ff;
      color: #fff;
      margin: 0 1.5rem;
      box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.33);
    }
  }
}
</style>