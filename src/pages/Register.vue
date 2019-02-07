<template>
  <div class="reg-wrap">
    <div class="head">
      <center-head :title="pagetitle"></center-head>
    </div>
    <div class="pbody">
      <div class="set">
        <h5>手机号</h5>
        <div class="set-box">
          <div class="mui-input-row zhuce">
            <input class="mui-input-clear" placeholder="请输入注册手机号" type="tel" v-model="phoneNum">
            <span :class="{'sentma':true, 'active':active}" @click="sendma(phoneNum)">{{simpleMa}}</span>
          </div>
          <div class="mui-input-row">
            <input class="mui-input-clear" placeholder="请输入验证码" type="number" v-model="authcode">
          </div>
          <div class="mui-input-row">
            <input class="mui-input-clear" placeholder="请输入密码" type="password" v-model="password">
          </div>
          <!-- <mt-field placeholder="请输入注册手机号" type="tel" v-model="phoneNum">
            <span :class="{'sentma':true, 'active':active}" @click="sendma(phoneNum)">{{simpleMa}}</span>
          </mt-field> -->
        </div>
      </div>
      <mt-button type="default" size="large">注册</mt-button>
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
      pagetitle: "注册",
      simpleMa: "发送验证码",
      active: false,
      phoneNum: "",
      authcode: null,
      password: null,
      repassword: null
    };
  },
  methods: {
    goback() {
      this.$router.back(-1);
    },
    sendma(tel) {
      if (this.active) {
        this.simpleMa = "已发送";
      } else {
        return false;
      }
    }
  },
  watch: {
    phoneNum: {
      handler: function(Val, oldVal) {
        if (Val) {
          this.active = true;
        } else {
          this.active = false;
        }
      }
    }
  },
  components: {
    CenterHead,
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.reg-wrap {
  height: 100%;
}
.head {
  color: #fff;
  h3 {
    width: 70%;
    text-align: center;
    margin: 0 auto;
    font-size: 1.125rem;
    line-height: 2.5rem;
  }
  span {
    display: inline-block;
    width: 15%;
    text-align: center;
    line-height: 2.5rem;
  }
}
.pbody {
  padding: 2rem 0.625rem;
  background: #f3f5f6;
  height: calc(100% - 2.5rem);
  .set {
    h5 {
      color: #9b9b9b;
      font-size: 1rem;
      text-align: left;
      padding-left: 0.3rem;
      margin: 0.375rem 0;
    }
    .mui-input-row {
      position: relative;
      input {
        border: none;
        border-bottom: 1px solid rgba(0, 0, 0, 0.2);
        border-radius: 0;
        padding: 0.3rem 0.9rem;
        height: 2.75rem;
        font-size: 0.94rem;
        color: #c2c4ca;
      }
    }
    .sentma {
      color: #fff;
      width: 4.94rem;
      height: 1.5625rem;
      line-height: 1.5625rem;
      font-size: 0.75rem;
      text-align: center;
      border-radius: 1rem;
      background: #d8d8d8;
      display: inline-block;
      position: absolute;
      top: 1.3rem;
      margin-top: -0.8rem;
      right: 1rem;
      &.active {
        background: #4caf50;
      }
    }
    .set-box {
      padding: 0.1rem 1rem;
      background: #fff;
      margin: 0.1rem;
      border-radius: 0.625rem;
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
}
.mint-cell {
  border-bottom: 1px solid #ebeef2;
  min-height: 2.6875rem;
  &:first-child {
    min-height: 4rem;
  }
  .mint-switch {
    height: 1.625rem;
    width: 2.6rem;
  }
  &:last-child {
    border: none;
    background-size: 100% 0px;
  }
}
.mint-button {
  margin-top: 5rem;
  border-radius: 1.5rem;
  background: #19c399;
  box-shadow: 0 0 1px #e0e2e4;
  color: #fff;
}
</style>
