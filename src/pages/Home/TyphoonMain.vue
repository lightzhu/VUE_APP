<template>
  <div class="main">
     <div id="taifeng">
        <iframe src="http://zt.zjmb.gov.cn/tfzt/db/typhoon_wx/zjtfweb.html" id="taifeng-box" frameborder="0"></iframe>
    </div>
  </div>
</template>

<script>
export default {
  name: "TyphoonMain",
  data() {
    return {
      title: "台风路径",
    };
  },
  components: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.main{
  text-align: center;
  height:100%;
}
#taifeng-box, #taifeng{
  width: 100%;
  height: 100%;
}
</style>
