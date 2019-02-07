<template>
  <div class="modify">
    <div class="head clear">
      <span class="fl" @click="goback">取消</span>
      <h3 class="fl">个人信息修改</h3>
      <span class="fr">完成</span>
    </div>
    <div class="cbody">
      <div class="set">
        <div class="set-box">
          <li class="mui-table-view-cell">
            <a class="mui-navigate-right">
              <span>头像</span>
              <span><img src="../assets/images/user.png" width="40" height="40"></span>
            </a>
          </li>
          <li class="mui-table-view-cell">
            <a class="mui-navigate-right">
              <span>账号</span>
              <span>{{(userInfo&&userInfo.Account)?userInfo.Account:"无"}}</span>
            </a>
          </li>
          <li class="mui-table-view-cell">
            <a class="mui-navigate-right">
              <span>昵称</span>
              <span>{{(userInfo&&userInfo.RealName)?userInfo.RealName:"用户名"}}</span>
            </a>
          </li>
          <li class="mui-table-view-cell">
            <a class="mui-navigate-right">
              <span>手机号</span>
              <span>{{(userInfo&&userInfo.Mobile)?userInfo.Mobile:"无"}}</span>
            </a>
          </li>
          <li class="mui-table-view-cell">
            <a class="mui-navigate-right">
              <span>所在单位</span>
              <span>{{(userInfo&&userInfo.Department)?userInfo.Department:"无"}}</span>
            </a>
          </li>
          <li class="mui-table-view-cell">
            <a class="mui-navigate-right">
              <span>安全邮箱</span>
              <span>{{(userInfo&&userInfo.Email)?userInfo.Email:"无"}}</span>
            </a>
          </li>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { Cell, Mswitch, Button } from "mint-ui";
export default {
  data() {
    return {
      value: false,
      pagetitle: "个人中心",
      userInfo:this.$store.state.userInfo 
    };
  },
  methods: {
    goback() {
      this.$router.back(-1);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.modify {
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
.cbody {
  padding: 0.3rem 0.625rem;
  background: #f3f5f6;
  height: calc(100% - 2.5rem);

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
      li {
        &:first-child{
          line-height: 40px;
        }
        span{
          color:#4a4a4a;
          font-size:0.95rem;
        }
        span:last-child {
          float: right;
          margin-right:1.6rem;
          color:#9b9b9b;
          font-size:0.875rem;
        }
      }
    }
  }
}
</style>
