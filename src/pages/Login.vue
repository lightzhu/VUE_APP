<template>
  <div class="center">
    <div class="head">
      <center-head :title="pagetitle" :back_icon="false"></center-head>
    </div>
    <div class="pbody">
      <div class="login">
        <label for="">用户名:</label>
        <input id="user" class="mui-input-clear" placeholder="请输入用户名" type="text" v-model="username">
        <label for="psword">密码:</label>
        <input id="psword" class="mui-input-clear" placeholder="请输入密码" type="password" v-model="password">
      </div>
        <div class="register">
          <!-- <router-link :to="{'name':'register',query:{tab:'all'}}">
            <span>注册</span>
          </router-link> -->
          <router-link :to="{'name':'passwordmodify'}">
            <span>忘记密码</span>
          </router-link>
        </div>
        <button type="button" class="mui-btn mui-btn-outlined" @click="userLogin">登录</button>
        <p class="declaration">登录即代表您已经阅读并同意
          <a>服务条款</a>和
          <a>隐私政策</a>
        </p>
      </div>
    </div>
</template>

<script>
import CenterHead from "../components/CenterHead.vue";
export default {
  data() {
    return {
      value: false,
      pagetitle: "登录",
      hostApi: this.$store.state.hostIP, //服务器地址
      username: "",
      password: ""
    };
  },
  methods: {
    removeMask() {
      document.querySelector(".mui-backdrop").remove();
    },
    userLogin() {
      var that = this;
      var loadmask = mui.createMask(function(e){
        return false;
      });
      loadmask.show(); //显示遮罩
      var $mask = document.querySelector(".mui-backdrop");
      $mask.innerHTML =
        '<span class="mui-icon mui-icon-spinner-cycle mui-spin"></span>登陆中...';
      that.axios
        .get(that.hostApi + `/InterfaceManage/OuterApi/CheckLogin`, {
          params: {
            username: that.username,
            password: that.$md5(that.password)
          }
        })
        .then(function(response) {
          var result = response.data;
          if (result.type == 1) {
            that.removeMask();
            that.$store.commit("login", result.resultdata);
            localStorage.user = JSON.stringify(result.resultdata);
            localStorage.account = that.username;
            localStorage.userpd = that.password;
            let redirect = decodeURIComponent(
              that.$route.query.redirect || "/"
            );
            that.$router.replace({
              path: redirect
            });
          } else {
            that.removeMask();
            mui.toast("用户名或密码错误！");
            localStorage.removeItem("user");
          }
        })
        .catch(function(error) {
          that.removeMask();
          mui.toast("登陆异常");
          console.log(error);
        });
    }
  },
  components: {
    CenterHead
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.center {
  height: 100%;
}
.pbody {
  padding: 3rem 2rem;
  background: #f3f5f6;
  padding-bottom: 58px;
  height: calc(100% - 2.5rem);
  label {
    line-height: 2.5rem;
  }
  .register {
    margin-top: 1rem;
    text-align: right;
    a {
      width: 49%;
      display: inline-block;
      text-align: right;
      color: #c0c0c0;
      &:first-child {
        text-align: right;
      }
    }
  }
  .declaration {
    position: absolute;
    bottom: 1rem;
    left: 0;
    width: 100%;
    font-size: 0.6875rem;
    color: #9b9b9b;
    text-align: center;
    line-height: 2rem;
    a {
      margin: 0 0.3rem;
      border-bottom: 1px solid #a09797;
    }
  }
  input {
    border: none;
  }
}
.mui-btn {
  margin-top: 5rem;
  border-radius: 1.5rem;
  background: #19c399;
  box-shadow: 0 0 1px #e0e2e4;
  color: #fff;
  width: 100%;
  height: 2.5rem;
  font-size: 1.2rem;
}
</style>
