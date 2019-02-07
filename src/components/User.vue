<template>
  <div class="user clear">
    <div class="user-left fl">
      <div class="user-icon">
        <img src="../assets/images/user.png" alt="">
      </div>
      </div>
      <div class="user-right">
        <div class="user-info">
          <p class="name"> {{userInfo?userInfo.RealName:"请登录"}}</p>
          <p class="role">超级管理员</p>
        </div>
        <i class="icon icon-youjiantou"></i>
      </div>
    </div>
</template>

<script>
export default {
  name: "center_head",
  data() {
    return {
      pagetitle: "实况地图",
      userInfo: this.$store.state.userInfo
    };
  },
  props: ["title"],
  methods: {},
  components: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.user {
  padding: 0.5rem 1.56rem;
  .user-left {
    .user-icon {
      img {
        width: 4.5rem;
        height: 4.5rem;
        border: 2px solid #fff;
        box-shadow: darkgrey 0px 0px 2px 2px;
        border-radius: 50%;
      }
    }
  }
  .user-right {
    margin-left: 4.8rem;
    padding-left: 1.56rem;
    height: 4.5rem;
    color: #fff;
    position: relative;
    i {
      position: absolute;
      right: 0;
      top: 50%;
    }
    p {
      text-align: left;
      margin: 0;
      color: #fff;
      &.name {
        font-size: 1.5rem;
        font-weight: 600;
        height: 3rem;
        line-height: 3rem;
      }
      &.role {
        font-size: 0.875rem;
        height: 1.5rem;
      }
    }
  }
}
</style>
