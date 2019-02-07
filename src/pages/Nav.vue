<template>
  <div class="slide">
    <div v-bind:class="{'show':ishow,'slide-nav':true}">
      <header v-on:click="toggleNav">
        <router-link :to="{'name':'center'}">
          <div class="user-icon">
            <img src="../assets/images/user.png" alt>
          </div>
          <div class="user-name">{{userInfo?userInfo.RealName:"请登录"}}</div>
        </router-link>
      </header>
      <section class="list-ul">
        <ul>
          <li v-on:click="toggleNav">
            <router-link :to="{'name':'home'}" replace>
              <i class="icon icon-yidiandiantubiao04 item"></i>
              <span>首页</span>
            </router-link>
          </li>
          <li v-on:click="toggleNav">
            <router-link :to="{'name':'gis'}" replace>
              <i class="icon-dingwei icon item"></i>
              <span>实况地图</span>
            </router-link>
          </li>
          <li v-on:click="toggleNav">
            <router-link :to="{'name':'statistics'}" replace>
              <i class="icon-tongji icon item"></i>
              <span>分级统计</span>
            </router-link>
          </li>
          <li v-on:click="toggleNav">
            <router-link :to="{'name':'warning'}" replace>
              <i class="icon-baojingxiaoxi icon item"></i>
              <span>告警提醒</span>
            </router-link>
          </li>
          <li v-on:click="toggleNav">
            <router-link :to="{'name':'stations'}" replace>
              <i class="icon-wendangzhongxin icon item"></i>
              <span>站点信息</span>
            </router-link>
          </li>
          <li v-on:click="toggleNav">
            <router-link :to="{'name':'snow'}" replace>
              <i class="icon-shangbao icon item"></i>
              <span>积雪上报</span>
            </router-link>
          </li>
          <li v-on:click="checkNewVersion">
            <a>
              <i class="mui-icon mui-icon-loop"></i>
              <span>检测更新</span>
              <em class="icon icon-yuandianzhong" v-show="hasNewVersion"></em>
            </a>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>
<script>
let qs = require("qs");
export default {
  name: "slide-nav",
  data() {
    return {
      ishow: this.$store.state.showNav,
      popupVisible: false,
      popupUpdata: false,
      destUrl: "",
      apikey: "3ce35c9dbfe34adb86669545224ecc17",
      appKey: "5485ed9fdbed3f39d8bfe930c7b69e39",
      ukey: "0a42a0c044828fd1ef4dd8e47a8e3392",
      appCheckUrl: "https://www.pgyer.com/apiv2/app/check"
    };
  },
  methods: {
    doShare() {
      this.popupVisible = !this.popupVisible;
    },
    toggleNav() {
      this.$store.commit("toggleNav");
    },
    toLoginOut() {
      var that = this;
      // mui.confirm(
      //   "您确定要退出吗？",
      //   null,
      //   ["取消", "退出"],
      //   function(e) {
      //     if (e.index == 1) {
      //       that.logout();
      //     }
      //   },
      //   "div"
      // );
    },
    logout() {
      this.$store.commit("logout");
      this.$store.commit("toggleNav");
      localStorage.removeItem("user");
      localStorage.removeItem("appVersion");
      this.$router.replace({
        path: "/login"
      });
      this.popupVisible = false;
    },
    checkNewVersion() {
      var that = this;
      that.axios
        .post(
          that.appCheckUrl,
          qs.stringify({ _api_key: that.apikey, appKey: that.appKey })
        )
        .then(function(response) {
          if (response.data.data.buildHaveNewVersion) {
            if (that.currentVersion != response.data.data.buildVersion) {
              that.$store.commit("toogleVersion", true);
              that.destUrl = response.data.data.downloadURL;
              mui.confirm(
                "发现新版本，是否下载？",
                null,
                ["不下", "下载"],
                function(e) {
                  if (e.index == 1) {
                    var dtask = plus.downloader.createDownload(
                      that.destUrl,
                      {},
                      function(d, status) {
                        if (status == 200) {
                          // 下载成功
                          var path = d.filename;
                          plus.runtime.install(path);
                        } else {
                          //下载失败
                          alert("下载失败: " + status);
                        }
                      }
                    );
                    dtask.start();
                  }
                },
                "div"
              );
            } else {
              mui.toast("当前已经是最新版本");
              that.$store.commit("toogleVersion", false);
            }
          } else {
            mui.toast("当前已经是最新版本");
            that.$store.commit("toogleVersion", false);
          }
          // mui.toast("提交成功");
          // mui(".mui-btn").button("reset");
          // that.reload();
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  },
  computed: {
    listenIshow() {
      return this.$store.state.showNav;
    },
    userInfo() {
      return this.$store.state.userInfo;
    },
    hasNewVersion() {
      return this.$store.state.hasNewVersion;
    },
    currentVersion() {
      return window.localStorage.getItem("appVersion");
    }
  },
  watch: {
    listenIshow(Val, oldVal) {
      this.ishow = Val;
    }
  },
  mounted() {
    console.log(this.hasNewVersion);
    // setTimeout(() => {
    //   this.ishow = true;
    // }, 2000);
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.slide-nav {
  height: 100%;
  background: #f3f5f6;
  width: 15rem;
  position: fixed;
  padding-top: 2rem;
  top: 0;
  bottom: 0;
  left: -15rem;
  color: #313131;
  transition: all 0.3s ease-out;
  z-index: 99;
  &.show {
    transform: translateX(15rem);
  }
  header {
    .user-icon {
      text-align: center;
      img {
        width: 4.68rem;
        height: 4.68rem;
        border: 2px solid #fff;
        box-shadow: darkgrey 0px 0px 2px 2px;
        border-radius: 50%;
      }
    }
    .user-name {
      margin-top: 0.5rem;
      font-size: 14px;
      font-weight: 600;
      text-align: center;
      color: #4a4a4a;
    }
  }
  .list-ul {
    width: 14.375rem;
    border-radius: 0.3125rem;
    background-color: #ffffff;
    box-shadow: 0 0 5px 0 rgba(213, 213, 213, 0.52);
    margin: 0 auto;
    margin-top: 2.2rem;
    li {
      height: 2.75rem;
      line-height: 2.75rem;
      border-bottom: 1px solid #ebeef2;
      text-align: left;
      padding-left: 0.9rem;
      a {
        color: #4a4a4a;
        display: inline-block;
        width: 100%;
      }
      i {
        display: inline-block;
        width: 1.25rem;
        height: 1.25rem;
        border-radius: 50%;
        background: #f3f3f3;
        color: #9b9b9b;
        line-height: 1.25rem;
      }
      &:last-child {
        a {
          i {
            font-size: 1.2rem;
          }
          em {
            color: red;
          }
        }
      }
    }
  }
}
.slide >>> .mint-popup {
  padding: 1rem 0;
  width: 80%;
  border-radius: 0.4rem;
  .popup-box {
    height: 5rem;
    padding: 1.2rem 0;
    text-align: center;
    span {
      display: block;
      font-size: 1.2rem;
      margin-bottom: 0.8rem;
    }
    button {
      width: 5rem;
      font-size: 0.875rem;
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
