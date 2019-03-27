import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    showNav: false,
    userInfo: null,
    choosedElementIndex: 0,
    statisticsIndex: 0,
    warningMsg: [],
    hasNewVersion:false,
    ischecked:false,
    hostIP: "http://appdemo-light.1d35.starter-us-east-1.openshiftapps.com", //线上环境
    //hostIP: "/api" //开发环境
  },
  mutations: {
    toggleNav(state) {
      state.showNav = !state.showNav;
      //console.log(state.showNav);
    },
    slideLeft(state) {
      if (localStorage.getItem("canSlide")==="true") {
        if (state.showNav) {
          state.showNav = !state.showNav; //左滑时导航向左
        }
      }
    },
    slideRight(state) {
      console.log(localStorage.getItem("canSlide"));
      if (localStorage.getItem("canSlide")==="true") {
        if (!state.showNav) {
          state.showNav = !state.showNav; //左滑时导航向左
        }
      }
    },
    chooseElement(state, obj) {
      if (obj.name.indexOf("统计") != -1) {
        state.statisticsIndex = obj.index;
      } else {
        state.choosedElementIndex = obj.index;
      }
    },
    updateWarning(state, msg) {
      state.warningMsg = msg;
    },
    reset(state) {
      //重置首页及统计页面的选择要素，默认进入这个模块总是显示第一个
      state.statisticsIndex = 0;
      state.choosedElementIndex = 0;
    },
    login(state, info) {
      state.userInfo = info;
    },
    logout(state) {
      state.userInfo = null;
      state.ischecked = false;
    },
    checkuser(state) {
      state.ischecked = true;
    },
    toogleVersion(state,msg) {
      console.log(msg);
      state.hasNewVersion = msg;
    }
  }
});
