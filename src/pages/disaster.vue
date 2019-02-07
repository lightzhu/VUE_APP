<template>
  <div class="hello">
    <address-bar></address-bar>
    <ul>
      <li
      v-for="(item, index) in products"
        v-bind:todo="item"
        v-bind:key="index"
        @click="chooseProduct(index)"
        :class="{on:choosedList[index].choosed}">
        <div class="goods selected">
          <i class="icon_select"><img src="/static/images/select.png" alt=""></i>
          <img class="image" :src="item.img">
          <div class="content">
            <div class="name">
              <span class="proNameJs">{{item.name}}</span>
            </div>
            <p class="sku" @click.stop="changeProductPros" attr-weight="14300">{{item.paras}}<i class="fa fa-angle-down"></i></p>
          </div>
          <div class="goods_line">
            <p class="price"><span class="priceJs" goodprice="1999.00">¥ <em class="int">{{item.price}}</em>.00</span></p>
            <div class="num_and_more">
              <div class="num_wrap"><span class="minus disabled fa fa-minus"></span>
                <div class="input_wrap">
                  <input class="num" type="tel" value="1" max="200" prevalue="1" lowestbuy="0">
                </div>
                <span class="plus fa fa-plus"></span>
              </div>
            </div>
          </div>
        </div>
        <div class="goods_sub_line">
          <div class="m_action" attr-tag="action">
            <a href="javascript:;" class="similar">查看相似</a>
            <span class="m_action_item">移入关注</span><span class="m_action_item">删除</span>
          </div>
        </div>
      </li>
    </ul>
    <change-arguments :showClass="isShow" @ievent = "ievent"></change-arguments>
  </div>
</template>
<script>
import address from '../components/address.vue'
const argumentsComponent = {
  data: function () {
    return {
      show: true,
      myClass: this.showClass
    }
  },
  props: ['showClass'],
  methods: {
    toggle () {
      let data = false
      this.$emit('ievent', data)
    }
  },
  template: `
    <div class="detail_sku_v1_main fu" :class="{show:showClass}" id="skuChangeCont" @click="toggle">
      <div class="main" @click.stop>
          <div class="header">
              <img alt="商品图" class="avt" src="//img14.360buyimg.com/n1/jfs/t19396/214/1588896512/143614/461b13f8/5aced16bN8a86a293.jpg"><p class="price">¥ <em>1799</em>.00</p><p class="prop"><span>已选</span> 50英寸 4K HDR超高清64位智能 1个</p><p class="prop"></p>
              <i class="close itemDetailClose"></i>
          </div>
          <div class="body">
              <div id="skuAttrWrap">
                <div class="sku_kind">版本</div>
                <div class="sku_choose" id="sku1">
                  <span class="choice" no="1" dis="0">55英寸 4K HDR超高清64位智能</span>
                   <span class="choice active" no="1" dis="0">50英寸 4K HDR超高清64位智能</span>
                  <span class="choice" no="1" dis="0">50英寸4K超高清31核金属边框</span>
                </div>
              </div>
              <div class="count_choose">
                  <p class="count">数量</p>
                  <div class="num_wrap_v2">
                      <span id="minusNum" class="minus disable"><i class="row"></i></span>
                      <div class="text_wrap"><input id="buyNum" class="text" type="tel" value="1"></div>
                      <span id="plusNum" class="plus"><i class="row"></i><i class="col"></i></span>
                  </div>
              </div>
          </div>
           <div class="btns show btnWrapJs" @click="toggle">
              <div class="btn red">确认</div>
          </div>
      </div>
    </div>
  `
}

export default {
  name: 'shopCar',
  data () {
    return {
      msg: 'Welcome to Your 购物车',
      isShow: false,
      products: [
        { id: 0,
          img: '//img10.360buyimg.com/n4/jfs/t19396/214/1588896512/143614/461b13f8/5aced16bN8a86a293.jpg',
          name: '康佳（KONKA）S50U 50英寸 4K HDR超高清64位智能液晶电视 (黑色）',
          paras: '不计重量，50英寸 4K HDR超高清64位智能',
          price: '1999' },
        { id: 1,
          img: '//img10.360buyimg.com/n4/jfs/t16111/255/130685380/239911/98a9050e/5a29fb3fN4ce06a3d.jpg',
          name: '创维（Skyworth）49M9 49英寸人工智能HDR 4K超高清智能网络液晶电视机(黑色)',
          paras: '不计重量，49吋 A73架构 HDR-49M9',
          price: '2499' },
        { id: 2,
          img: '//img10.360buyimg.com/n4/jfs/t3268/124/2646283367/114153/f5704b88/57e4a358N9ccc6645.jpg',
          name: 'Apple iPhone 6s Plus (A1699) 32G 金色 移动联通电信4G手机',
          paras: '0.51kg/件，金色，公开版',
          price: '2999' },
        { id: 3,
          img: '//img10.360buyimg.com/n4/jfs/t2404/38/2275898513/155676/a6a1dfeb/56c5b6fcN82321242.jpg',
          name: '花好玉缘  倾心  PT950铂金吊坠/白金吊坠配银项链 生日礼物 女 吊坠+925银链',
          paras: '吊坠+925银链',
          price: '999' },
        { id: 4,
          img: '//img10.360buyimg.com/n4/jfs/t20323/156/420409395/98822/7f26d66b/5b0d4083Ndc3197dc.jpg',
          name: '周生生 Pt950铂金项链白金百搭素链男女款 42860N 计价 45厘米 - 2.49克(含工费370元)',
          paras: '45厘米 - 2.49克(含工费370元)',
          price: '1199' },
        { id: 5,
          img: '//img10.360buyimg.com/n4/jfs/t19396/214/1588896512/143614/461b13f8/5aced16bN8a86a293.jpg',
          name: '康佳（KONKA）S50U 50英寸 4K HDR超高清64位智能液晶电视 (黑色）',
          paras: '不计重量，50英寸 4K HDR超高清64位智能',
          price: '1999' }
      ],
      index: 0,
      choosed: null,
      choosedList: []
    }
  },
  methods: {
    chooseProduct (key) {
      this.choosedList[key].choosed = !this.choosedList[key].choosed
    },
    changeProductPros () {
      this.isShow = true
    },
    ievent (data) {
      this.isShow = data
    }
  },
  created: function () {
    this.products.forEach(element => {
      this.choosedList.push({
        id: element.id,
        choosed: false
      })
    })
  },
  components: {
    'address-bar': address,
    'change-arguments': argumentsComponent
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  list-style: none;
}
a {
  color: #42b983;
}
.goods {
    z-index: 1;
    position: relative;
    min-height: 75px;
    padding: 12px 10px 15px 128px;
    background: #fff;
    -webkit-overflow-scrolling: touch;
  .icon_select {
    left: 0;
    width: 63px;
    height: 100%;
  }
  .image {
    position: absolute;
    left: 43px;
    top: 15px;
    display: block;
    width: 2rem;
    height: 2rem;
  }
  .name {
    font-weight: 700;
    font-size: .37rem;
    margin-bottom: 5px;
  }
  .sku {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    position: relative;
    background-color: #fff;
    font-size: 14px;
    color: #666;
    margin: 8px 0 10px;
    padding: 5px 25px 4px 5px;
    border: 1px solid #e5e5e5;
    border-radius: 2px;
    position: relative;
    i{
      position: absolute;
      right:6px;
      top:20%;
      font-size:0.5rem;
    }
  }
  .goods_line {
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    margin: 5px 0 2px;
    .price {
      -webkit-box-flex: 1;
      -webkit-flex: 1;
      flex: 1;
      line-height: 16px;
      color: #e4393c;
      font-size: 0.4rem;
    }
    .num_wrap span {
      position: relative;
      float: left;
      width: 30px;
      height: 30px;
      line-height: 30px;
      text-align: center;
    }
    .num_wrap .input_wrap {
      float: left;
      position: relative;
      border:1px solid #eee;
      input{
        width: 45px;
        text-align: center;
        height: 28px;
        line-height: 28px;
        padding:0;
        border-width: 0;
      }
    }
    .num_wrap .plus {
      float: right;
    }
  }
  .icon_select {
    display: block;
    width: 0.5rem;
    height:0.5rem;
    position: absolute;
    left: 10px;
    top: 30%;
    border:1px solid #ccc;
    border-radius:50%;
    img{
      width: 110%;
      height: 110%;
      display: none;
    }
  }
}
  .on .icon_select{
    border:none;
    img{
        display: block;
      }
  }
.goods_sub_line{
    .m_action {
    color: #999;
    font-size: 0;
    font-family: Helvetica;
    text-align: right;
    .m_action_item {
      position: relative;
      padding: 0 10px;
      line-height: 1em;
      font-size: 12px;
    }
  }
  .similar{
    font-size:0.3rem;
  }
}
.detail_sku_v1_main {
    position: fixed;
    top: 100%;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 110;
    background-color: rgba(0,0,0,.7);
}
.show.detail_sku_v1_main{
  top:0;
  .main {
    position: absolute;
    -webkit-transform: translate3d(0,0,0);
    transform: translate3d(0,0,0);
  }
}
</style>
<style lang="scss">
.detail_sku_v1_main .main {
    position: absolute;
    -webkit-transform: translate3d(0,420px,0);
    transform: translate3d(0,420px,0);
    -webkit-transition: -webkit-transform .2s cubic-bezier(0,0,.25,1);
    transition: -webkit-transform .2s cubic-bezier(0,0,.25,1);
    transition: transform .2s cubic-bezier(0,0,.25,1);
    transition: transform .2s cubic-bezier(0,0,.25,1),-webkit-transform .2s cubic-bezier(0,0,.25,1);
    bottom: 0;
    width: 100%;
    height: 400px;
    background-color: #fff;
}
.show.detail_sku_v1_main .main {
    position: absolute;
    -webkit-transform: translate3d(0,0,0);
    transform: translate3d(0,0,0);
}
.detail_sku_v1_main {
  .header {
    height: 70px;
    line-height: 1.5;
    padding: 0 0 10px 110px;
    background-color: #fff;
    .avt {
      position: absolute;
      left: 10px;
      top: -20px;
      border-radius: 7px;
      width: 90px;
      height: 90px;
      background-color: #fff;
    }
    .price {
      height: 40px;
      line-height: 40px;
      color: #e4393c;
      font-size: .5rem;
      font-weight: 700;
      margin:0;
    }
    .prop {
      word-break: break-all;
      font-size: 12px;
      color: #333;
      line-height: 1.4em;
      padding-right: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
  .body {
    height: 320px;
  }
  .sku_kind {
    font-size: 12px;
    color: #333;
    margin: 0 10px;
    text-align:left;
    height: 33px;
    line-height: 33px;
  }
  .sku_choose {
    font-size: 12px;
    overflow: hidden;
    margin-bottom: -5px;
    .choice {
      display: inline-block;
      padding: 0 15px;
      min-width: 20px;
      max-width: 270px;
      overflow: hidden;
      height: 25px;
      line-height: 25px;
      float: left;
      text-align: center;
      margin-left: 10px;
      margin-bottom: 10px;
      border-radius: 3px;
      color: #333;
      background-color: #f3f2f8;
      &.active{
        background-color: #e4393c;
        color: #fff;
      }
    }
  }
  .count_choose {
    padding: 10px 10px 15px;
    font-size: 12px;
    margin-bottom: 90px;
    .count {
      color: #333;
      height: 31px;
      line-height: 31px;
      float: left;
    }
  }
  .num_wrap_v2 {
    position: relative;
    height: 31px;
    line-height: 31px;
    z-index: 0;
    width: 110px;
    float: right;
    vertical-align: middle;
    .text {
      height: 30px;
      width: 100%;
      color: #333;
      background: #fff;
      font-size: 12px;
      text-align: center;
    }
    .text_wrap {
      position: relative;
      z-index: 0;
    }
    span {
      position: relative;
      max-width: 30px;
      min-width: 30px;
      height: 30px;
      line-height: 30px;
      background: #f3f2f8;
      text-align: center;
    }
    .minus {
      border-top-left-radius: 3px;
      border-bottom-left-radius: 3px;
    }
    .plus {
      border-top-right-radius: 3px;
      border-bottom-right-radius: 3px;
    }
  }
 .btns.show {
    background-color: #fff;
    position: absolute;
    z-index: 101;
    bottom: 0;
 }
  .btns {
    width: 100%;
    .btn{
      display: block;
      width: 100%;
      -webkit-box-flex: 1;
      -webkit-flex: 1;
      flex: 1;
      height: 50px;
      line-height: 50px;
      color: #fff;
      font-size: 16px;
      text-align: center;
      &.red{
        background-color:red;
      }
    }
  }
}
</style>
