// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import store from './store'
import App from './App'
import $ from 'webpack-zepto'
import VueRouter from 'vue-router'
import router from './router'
import Mint from 'mint-ui'
import { Indicator } from 'mint-ui'
import axios from 'axios'
import qs from 'qs'
import Mui from 'mui'
import md5 from 'js-md5'
require('mui/plugin/picker/js/mui.picker.js');
require('mui/plugin/picker/js/mui.dtpicker.js');
import 'mint-ui/lib/style.min.css'
import 'mui/dist/css/mui.css'
import 'mui/plugin/picker/css/mui.picker.css'
import 'mui/plugin/picker/css/mui.dtpicker.css'
import 'swiper/dist/css/swiper.min.css'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
Vue.prototype.axios = axios
Vue.prototype.$md5 = md5
Vue.prototype.Indicator = Indicator
Vue.config.productionTip = false
Vue.use(VueRouter)

Vue.use($)
Vue.use(Mint)
Vue.use(Mui)
/* eslint-disable no-new */
new Vue({
  // el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
}).$mount('#app')