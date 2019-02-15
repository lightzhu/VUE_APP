import Vue from "vue";
import store from '../store'
import VueRouter from "vue-router";
import Home from "@/pages/Home/Home";
import RainMain from "@/pages/Home/RainMain";
import TemMain from "@/pages/Home/TemMain";
import DryMain from "@/pages/Home/DryMain";
import SnowMain from "@/pages/Home/SnowMain";
import TyphoonMain from "@/pages/Home/TyphoonMain";
import Gis from "@/pages/Gis";
import Statistics from "@/pages/Statistics/Statistics";
import RainStatistics from "@/pages/Statistics/RainStatistics";
import TemStatistics from "@/pages/Statistics/TemStatistics";
import SnowStatistics from "@/pages/Statistics/SnowStatistics";
import Warning from "@/pages/Warning";
import Stations from "@/pages/Stations";
import Snow from "@/pages/Snow";
import SnowList from "@/pages/SnowList";
import Center from "@/pages/Center";
import Login from "@/pages/Login";
import InfoUpdate from "@/components/InfoUpdate";
import PassWordMod from "@/components/PassWordMod";
import Register from "@/pages/Register";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/home"
  },
  {
    path: "/home",
    name: "home",
    component: Home,
    meta: { index: 1, requireAuth: true },
    children: [
      {
        path: "/rainmain",
        name: "rainmain",
        meta: { index: 2 },
        component: RainMain
      },
      {
        path: "/temmain",
        name: "temmain",
        meta: { index: 2 },
        component: TemMain
      },
      {
        path: "/drymain",
        name: "drymain",
        meta: { index: 2 },
        component: DryMain
      },
      {
        path: "/snowmain",
        name: "snowmain",
        meta: { index: 2 },
        component: SnowMain
      },
      {
        path: "/typhoon",
        name: "typhoon",
        meta: { index: 3 },
        component: TyphoonMain
      }
    ],
    redirect: "/rainmain"
  },
  {
    path: "/gis",
    name: "gis",
    meta: { index: 4, requireAuth: true },
    component: Gis
  },
  {
    path: "/statistics",
    name: "statistics",
    meta: { index: 5, requireAuth: true },
    component: Statistics,
    children: [
      {
        path: "/rainstatistics",
        name: "rainstatistics",
        component: RainStatistics
      },
      {
        path: "/temstatistics",
        name: "temstatistics",
        component: TemStatistics
      },
      {
        path: "/snowstatistics",
        name: "snowstatistics",
        component: SnowStatistics
      }
    ],
    redirect: "/rainstatistics"
  },
  {
    path: "/warning",
    name: "warning",
    meta: { index: 6, requireAuth: true },
    component: Warning
  },
  {
    path: "/stations",
    name: "stations",
    meta: { index: 7, requireAuth: true },
    component: Stations
  },
  {
    path: "/snow",
    name: "snow",
    meta: { index: 8, requireAuth: true },
    component: Snow
  },
  {
    path: "/snowlist",
    name: "snowlist",
    meta: { index: 8, requireAuth: true },
    component: SnowList
  },
  {
    path: "/center",
    name: "center",
    meta: { index: 8, requireAuth: true },
    component: Center
  },
  {
    path: "/register",
    name: "register",
    meta: { index: 9 },
    component: Register
  },
  {
    path: "/login",
    name: "login",
    meta: { index: 10 },
    component: Login,
    beforeEnter: (to, from, next) => {
      localStorage.setItem("canSlide",false);//这个时候取消侧滑
      next();
    }
  },
  {
    path: "/usermodify",
    name: "usermodify",
    meta: { index: 11, requireAuth: true },
    component: InfoUpdate
  },
  {
    path: "/passwordmodify",
    name: "passwordmodify",
    meta: { index: 12},
    component: PassWordMod
  }
];
// 页面刷新时，重新赋值用户信息
if (window.localStorage.getItem('user')) {
  store.commit('login', JSON.parse(window.localStorage.getItem('user')));
}
const router = new VueRouter({
  routes
});
router.beforeEach((to, from, next) => {
  if (to.matched.some(r => r.meta.requireAuth)) {
    if (localStorage.hasOwnProperty("user") != false) {
      next();
      localStorage.setItem("canSlide",true);//这个时候支持侧滑
    } else {
      next({
        path: "/login",
        query: { redirect: to.fullPath }
      });
    }
  } else {
    next();
  }
});
export default router;
