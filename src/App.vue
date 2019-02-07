<template>
  <div id="app">
    <main-nav></main-nav>
    <div id="container" v-bind:class="{'toRight':toRight}">
      <transition :name="transitionName">
        <keep-alive exclude="gis,warning,snow">
          <router-view v-if="isRouterAlive"></router-view>
        </keep-alive>
      </transition>
    </div>
  </div>
</template>

<script>
require("./assets/css/base.css");
require("./assets/scss/iconfont/icon.css");
require("./assets/css/station.css");
let qs = require("qs");
import MainNav from "./pages/Nav";
export default {
  name: "App",
  provide() {
    return {
      reload: this.reload
    };
  },
  data() {
    return {
      toRight: false,
      hostApi: this.$store.state.hostIP, //服务器地址
      transitionName: "",
      destUrl:"",
      isRouterAlive: true,
      currentVersion: "0.9.5",
      apikey: "3ce35c9dbfe34adb86669545224ecc17",
      appKey: "5485ed9fdbed3f39d8bfe930c7b69e39",
      appVersionUrl: "https://www.pgyer.com/apiv2/app/view",
      appCheckUrl: "https://www.pgyer.com/apiv2/app/check"
    };
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function() {
        this.isRouterAlive = true;
      });
    },
    checkNewVersion() {
      var that = this;
      if (window.localStorage.hasOwnProperty("appVersion") != false) {
        that.currentVersion = window.localStorage.getItem("appVersion");
      }
      that.axios
        .post(
          that.appCheckUrl,
          qs.stringify({ _api_key: that.apikey, appKey: that.appKey })
        )
        .then(function(response) {
          //如果服务器版本大于当前版本
          console.log(response);
          if (response.data.data.buildHaveNewVersion) {
            if (that.currentVersion != response.data.data.buildVersion) {
              that.$store.commit("toogleVersion", true);
              that.destUrl = response.data.data.downloadURL;
              mui.confirm(
                "发现新版本，是否下载？",
                null,
                ["取消", "好的"],
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
                  }else{
                    plus.runtime.quit();
                  }
                },
                "div"
              );
            }
          } else {
            that.$store.commit("toogleVersion", false);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  },
  computed: {
    listenIshow() {
      return this.$store.state.showNav;
    }
  },
  watch: {
    listenIshow(Val, oldVal) {
      this.toRight = Val;
    },
    $route(to, from) {
      //如果to索引大于from索引,判断为前进状态,反之则为后退状态
      // if(to.meta.index > from.meta.index){
      //   //设置动画名称
      //   this.transitionName = 'slide-left';
      // }else{
      //   this.transitionName = 'slide-right';
      // }
      //this.transitionName = "slide-left";
    }
  },
  mounted: function() {
    var that = this;
    //that.getAppVersion();
    //禁止拖动

    var appView = document.querySelector("#app");
    var xx, yy, XX, YY, swipeX, swipeY;
    appView.addEventListener("touchstart", function(event) {
      //event.preventDefault(); //阻止浏览器默认事件
      xx = event.targetTouches[0].screenX;
      yy = event.targetTouches[0].screenY;
      swipeX = true;
      swipeY = true;
    });
    appView.addEventListener("touchmove", function(event) {
      XX = event.targetTouches[0].screenX;
      YY = event.targetTouches[0].screenY;
      if (swipeX && Math.abs(XX - xx) - Math.abs(YY - yy) > 0) {
        //左右滑动
        event.preventDefault(); //阻止浏览器默认事件
        swipeY = false;
        //左右滑动
      } else if (swipeY && Math.abs(XX - xx) - Math.abs(YY - yy) < 0) {
        //上下滑动
        swipeX = false;
        //上下滑动，使用浏览器默认的上下滑动
      }
    });
    mui.init({
      keyEventBind: {
        backbutton: true, //开启back按键监听
        swipeleft: true, //开启左滑
        swiperight: true
      }
    });
    mui.plusReady(function() {
      appView.addEventListener("swipeleft", function(e) {
        that.$store.commit("slideLeft");
      });
      appView.addEventListener("swiperight", function(e) {
        that.$store.commit("slideRight");
      });
      //alert('version：' + plus.runtime.version);
      //获取当前app版本号
      plus.runtime.getProperty(plus.runtime.appid, function(wgtinfo) {
        //version属性
        window.localStorage.setItem("appVersion", wgtinfo.version);
        //alert(window.localStorage.getItem("appVersion"));
        that.checkNewVersion();
      });
      // 窗口组合动画
      function webviewAnimation(ws) {
        plus.webview.startAnimation({
          view: ws,
          styles: { fromLeft: "0", toLeft: "0" },
          action: "none"
        });
      }
      function newviewAnimation(wn) {
        plus.webview.startAnimation({
          view: wn,
          styles: { fromLeft: "100%", toLeft: "0" },
          action: "none"
        });
      }

      var first = null;
      mui.back = function() {
        that.$store.commit("slideLeft");
        //首次按键，提示 再按一次退出应用
        plus.webview.currentWebview().canBack(function(e) {
          console.log("是否可返回：" + e.canBack);
          if (e.canBack) {
            //首页返回键处理
            var ws = plus.webview.currentWebview();
            webviewAnimation(ws);
            history.go(-1);
            setTimeout(function() {
              //回退到上一页面
              var wn = plus.webview.currentWebview();
              newviewAnimation(wn);
            }, 0);
          } else {
            if (!first) {
              first = new Date().getTime(); //记录第一次按下回退键的时间
              setTimeout(function() {
                mui.toast("再按一次退出应用"); //给出提示
              }, 10);
              setTimeout(function() {
                //1s中后清除
                first = null;
              }, 1000);
            } else {
              if (new Date().getTime() - first < 1000) {
                //如果两次按下的时间小于1s，
                plus.runtime.quit(); //那么就退出app
              }
            }
          }
        });
      };
    });
  },
  updated: function() {},
  components: {
    MainNav
  }
};
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
  overflow-x: hidden;
  background: transparent;
  //background-image: linear-gradient(to left, #170198, #170466);
  a {
    -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
    -webkit-user-select: none;
    -moz-user-focus: none;
    -moz-user-select: none;
  }
}
#container {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  background: #1a03a0;
  transition: all 0.3s ease-out;
  &.toRight {
    transform: translateX(15rem);
  }
}

//重写mint-ui的相关样式
.mint-switch-core {
  height: 1.625rem;
  width: 2.6rem;
  &:before {
    height: 95%;
    width: 50%;
    top: 2%;
  }
  &:after {
    height: 95%;
    width: 50%;
    top: 2%;
  }
}
.mint-cell-wrapper {
  background-size: 120% 0px;
}
.mint-switch-input:checked + .mint-switch-core {
  border-color: #16018d;
  background-color: #16018d;
  &:after {
    transform: translateX(100%);
  }
}
.mui-toast-container {
  bottom: 50%;
}
.mui-backdrop {
  text-align: center;
  line-height: 80vh;
  color: #fff;
  .mui-icon {
    color: #fff;
    margin-right: 0.5rem;
    animation: rotate 3s linear infinite;
    @keyframes rotate {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(359deg);
      }
    }
  }
}

//路由组件的动画
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  will-change: transform;
  transition: all 300ms linear;
  position: absolute;
}
.slide-right-enter {
  opacity: 0;
  transform: translateX(-100%);
}
.slide-right-leave-active {
  opacity: 0;
  transform: translateX(100%);
}
.slide-left-enter {
  opacity: 0.5;
  transform: translateX(100%);
}
.slide-left-leave-active {
  opacity: 0;
  //transform: translateX(-100%);
}
</style>
