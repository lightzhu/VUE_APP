<template>
  <div class="snow">
    <div class="snow-head">
      <div class="menu-left" v-on:click="toggleNav">
        <span class="icon-caidan1 icon"></span>
      </div>
      <div class="drop-menu">
        <span>{{this.pagetitle}}</span>
      </div>
      <div class="menu-right" v-on:click="toSnowList">
        历史上报
      </div>
    </div>
    <div class="snowbody">
      <ul class="snow-info">
        <li class="mui-table-view-cell">
          <a class="mui-navigate-right">
            平均积雪厚度
            <span>
              <input type="number" ref="snowDeep" placeholder="请输入" v-model.number="snowDeep" onfocus="this.placeholder=''" @blur="inputBlur(snowDeep,'snowDeep')">cm
            </span>
          </a>
        </li>
        <li class="mui-table-view-cell">
          <a class="mui-navigate-right">
            最大积雪厚度
            <span>
              <input type="number" ref="snowDeepMax" placeholder="请输入" v-model.number="snowDeepMax" onfocus="this.placeholder=''" @blur="inputBlur(snowDeepMax,'snowDeepMax')">cm
            </span>
          </a>
        </li>
      </ul>
      <ul class="user-info">
        <li class="mui-table-view-cell">
          上报所在地
          <span>{{Address}}</span>
        </li>
        <li class="mui-table-view-cell">
          <a class="mui-navigate-right" @click="pickDate">
            上报时间
            <span>{{time}}</span>
          </a>
        </li>
        <li class="mui-table-view-cell">
          上报人
          <span>{{name}}</span>
        </li>
      </ul>
      <div class="confirm" @click="tosubmit">
        <button type="button" data-loading-text="提交中" class="mui-btn mui-btn-warning">确认上报</button>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import _ from "underscore";
let qs = require("qs");
export default {
  name: "snow",
  inject: ["reload"],
  data() {
    return {
      pagetitle: "积雪上报",
      snowDeep: null,
      snowDeepMax: null,
      localTime: moment(new Date()).format("YYYY-MM-DD HH:mm"),
      time: moment(new Date()).format("YYYY年MM月DD日 HH:mm"),
      name: this.$store.state.userInfo.RealName,
      Address: this.$store.state.userInfo.Address,
      ID: this.$store.state.userInfo.UserId,
      localUser: this.$store.state.userInfo,
      hostApi: this.$store.state.hostIP //服务器地址
    };
  },
  methods: {
    toggleNav() {
      this.$store.commit("toggleNav");
    },
    toSnowList() {
      this.$router.push({
        path: "/snowlist"
      });
    },
    
    inputBlur(val, thisref) {
      var that = this;
      if (_.isNull(val)) {
        mui.alert("积雪厚度不允许为空");
        // mui.toast('积雪厚度不允许为空')
        that.$refs[thisref].focus();
        return false;
      }
    },
    pickDate() {
      var that = this;
      var dtPicker = new mui.DtPicker({
        type: "datetime", //设置日历初始视图模式
        endDate: new Date() //设置结束日期
      });
      dtPicker.show(function(selectItems) {
        that.localTime = selectItems.text;
        that.time = moment(selectItems.text).format("YYYY年MM月DD日 HH:mm");
      });
    },
    tosubmit() {
      var that = this;
      if(!that.$store.state.userInfo.Address||that.$store.state.userInfo.Address=='null'){
        mui.toast("上报地点不能为空，请联系管理员！");
        return false;
      }

      if (that.snowDeep == "" || that.snowDeepMax == "") {
        mui.toast("积雪厚度不允许为空");
        return false;
      } else {
        mui(".mui-btn").button("loading");
        that.axios
          .post(
            that.hostApi + `/InterfaceManage/OuterApi/SaveForms`,
            qs.stringify({
              Avg_Snow_Depth: that.snowDeep,
              Max_Snow_Depth: that.snowDeepMax,
              ObservTime: that.localTime,
              UserId: that.ID,
              Address: that.Address
            })
          )
          .then(function(response) {
            mui.toast("提交成功");
            mui(".mui-btn").button("reset");
            that.reload();
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    }
  },
  watch: {},
  mounted: function() {
    // var that = this;
    // mui(document.body).on("tap", ".mui-btn", function(e) {
    //   that.submit();
    // });
  },
  components: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.snow {
  height: 100%;
}
.snow-head {
  text-align: center;
  height: 2.5rem;
  line-height: 2.5rem;
  font-size: 1.125rem;
  color: #fff;
  position: relative;
  .menu-left {
    padding: 0 0.75rem;
    position: absolute;
    top: 0;
    left: 0;
  }
  .menu-right {
    position: absolute;
    padding: 0 0.75rem;
    font-size: 1rem;
    color: #ccc;
    right: 0;
    top: 0;
  }
  .drop-menu {
    display: inline-block;
    margin: 0 auto;
  }
}
.snow .snowbody {
  height: calc(100% - 2.5rem);
  background: #f3f5f6;
  padding-top: 0.625rem;
  .snow-info,
  .user-info {
    margin: 0.625rem;
    border-radius: 5px;
    background-color: #ffffff;
    box-shadow: 0 0 5px 0 rgba(213, 213, 213, 0.52);
  }
  ul {
    li span {
      float: right;
      color: #9b9b9b;
      text-align: right;
      font-size: 0.875rem;
      margin-right: 1.5rem;
      width: 50%;
      input {
        margin: 0;
        padding: 0;
        border: none;
        height: auto;
        width: 88%;
        padding-right: 1rem;
        text-align: right;
        color: #9b9b9b;
        font-size: 0.875rem;
      }
    }
    li a {
      color: #4a4a4a;
    }
  }
  .confirm {
    position: absolute;
    bottom: 1rem;
    padding: 0.625rem;
    width: 100%;
    .mui-btn {
      height: 2.5rem;
      background-color: #f5a623;
      border-color: #f5a623;
      color: #fff;
      font-size: 1.125rem;
      width: 100%;
    }
  }
}
</style>
