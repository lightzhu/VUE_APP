<template>
  <div class="center">
    <div class="head">
      <center-head :title="pagetitle" :back_icon="true"></center-head>
    </div>
    <div @click="gotoModify">
      <user></user>
    </div>
    <div class="cbody">
      <div class="set">
        <h5>通用设置</h5>
        <div class="set-box">
          <li class="mui-table-view-cell" @click="passwordmodify">
            <a class="mui-navigate-right">密码修改</a>
          </li>
          <li class="mui-table-view-cell">消息提醒
            <div class="mui-switch mui-switch-mini">
              <div class="mui-switch-handle"></div>
            </div>
          </li>
        </div>
      </div>
      <div class="set">
        <h5>帮助与反馈</h5>
        <div class="set-box">
          <li class="mui-table-view-cell">
            <a class="mui-navigate-right">联系我们</a>
          </li>
          <li class="mui-table-view-cell">
            <a class="mui-navigate-right">关于我们</a>
          </li>
          <li class="mui-table-view-cell">
            <a class="mui-navigate-right">意见反馈</a>
          </li>
          <li class="mui-table-view-cell">
            <a class="mui-navigate-right">常见问题</a>
          </li>
        </div>
      </div>
      <div class="set">
        <h5>版本与更新</h5>
        <div class="set-box">
          <li class="mui-table-view-cell">
            <a class="mui-navigate-right">检测更新</a>
          </li>
          <li class="mui-table-view-cell">
            当前版本
            <span class="mui-badge">V1.5.0</span>
          </li>
        </div>
      </div>
      <button type="button" class="loginout mui-btn mui-btn-outlined" @click="logout">退出登录</button>
    </div>
  </div>
</template>

<script>
import CenterHead from "../components/CenterHead.vue";
import User from "../components/User.vue";
export default {
  data() {
    return {
      value: false,
      pagetitle: "个人中心"
    };
  },
  methods: {
    gotoModify() {
      this.$router.push({ path: "/usermodify", query: { username: "stage" } });
    },
    passwordmodify() {
      this.$router.push({
        path: "/passwordmodify",
        query: { username: "stage" }
      });
    },
    logout() {
      var that = this;
      mui.confirm(
        "您确定要退出吗？",
        null,
        ["取消", "退出"],
        function(e) {
          if (e.index == 1) {
            that.$store.commit("logout");
            localStorage.removeItem("user");
            that.$router.replace({
              path: "/login"
            });
          }
        },
        "div"
      );
    }
  },
  mounted: function() {
    //初始化开关
    mui(".mui-switch")["switch"]();
  },
  components: {
    CenterHead,
    User
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.center {
  height: 100%;
}
.head {
  .center-head {
    margin: 0;
  }
}
.user-head {
  float: left;
  padding: 10px 0;
  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 2px solid skyblue;
  }
}
.user-info {
  float: left;
  color: #fff;
  .uname {
    font-size: 0.5rem;
    margin: 0.2rem;
  }
  .umsg {
    span {
      display: inline-block;
      border-radius: 5px;
      margin: 0 10px;
      padding: 5px;
      border: 1px solid #ccc;
    }
  }
}
.cbody {
  padding: 0.3rem 0.625rem;
  background: #f3f5f6;
  height: calc(100% - 8rem);
  .set {
    h5 {
      color: #9b9b9b;
      font-size: 0.6875rem;
      text-align: left;
      padding-left: 0.3rem;
      margin: 0.375rem 0;
    }
    .set-box {
      padding: 0.1rem 1rem;
      background: #fff;
      margin: 0.1rem;
      border-radius: 0.625rem;
      .mui-switch {
        &.mui-active {
          background-color: #16018d;
          border-color: #16018d;
        }
        &.mui-switch-mini {
          width: 40px;
          height: 24px;
        }
        .mui-switch-handle {
          width: 22px;
          height: 22px;
          left: 0;
        }
      }
      li {
        font-size: 1rem;
      }
    }
    .mui-badge {
      background-color: none;
      font-size: 0.85rem;
    }
  }
  button {
    padding: 0;
    border: none;
    font-size: 1.125rem;
  }
}
button.loginout {
  margin-top: 1.5rem;
  border-radius: 0.3125rem;
  background: #fff;
  box-shadow: 0 0 1px #e0e2e4;
  color: #e9707f;
  width: 100%;
  height: 2.5rem;
}
</style>
