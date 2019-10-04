<template>
  <div class="container">
    <!-- 插槽放置搜索框 -->
    <slot></slot>

    <!-- 滚动区域 帮助问题条目 -->
    <div class="scroll-wrap" ref="scrollWrap">
      <yd-scroll
        v-fixTabBar
        ref="scroll"
        :items="tipList"
        class="scroll"
        :scrollHeight="scrollWrapHeight"
        @on-pulling-down="onPullingDown"
        @on-pulling-up="onPullingUp">

        <ul class="y-list" v-if="tipList.length >= 0">
          <li class="y-list-item" v-for="item in tipList" :key="item.id" @click="toDetailPage(item)">
            <div class="y-list-item-inner border-bottom-1px">
              <div class="y-list-item__label">
                {{item.title}}
              </div>
              <div class="y-list-item__icon">
                <yd-icon name="arrow-right"/>
              </div>
            </div>
          </li>
          <!-- <li class="y-list-item"></li> -->
          <!-- <li class="y-list-item"></li> -->
        </ul>

        <div class="no-data" v-show="!tipList || tipList.length === 0">暂无数据</div>
      </yd-scroll>
    </div>
  </div>

</template>

<script>
import debounce from 'lodash/debounce'
export default {
  name: 'search-tip',
  props: {
    tips: Array,
    scrollheight: Number
  },
  data () {
    return {
      limit: 10,
      offset: 0,
      count: 0,
      currentPage: 1,
      searchKey: '',
      scrollWrapHeight: 0
    }
  },
  created () {
    this.scrollWrapHeight = this.scrollheight - 100
    // this.$nextTick(() => {
    //   this.scrollWrapHeight = this.$refs.scrollWrap.clientHeight - 205
    // })
  },
  computed: {
    tipList () {
      // const test = [1, 2, 3, 4, 5, 6, 7, 8, 9, 12, 12, 13, 14]
      // test.map((item) => {
      //   return {
      //     title: item + '111111'
      //   }
      // })
      // return [...this.tips, ...test]
      return [...this.tips]
    }
  },
  methods: {
    // 处理授权搜索,函数抖动
    doSearch: debounce(function () {
      if (this.searchKey.trim() === '') { // 空值不发请求
        // 重新获取分类数据
        return
      }
      // util.log('当前分类搜索,参数：' + this.searchKey)
      // 调用搜索的接口
      // 搜索结果处理并给list赋值
      this.tipList = []
    }, 200),
    toDetailPage (item) { // 查看指定问题的详情页面
      this.$emit('to-detail-page', item)
    },
    onPullingDown () {
      this.reset()
      this.loadData(1)
    },

    onPullingUp () {
      this.loadData(this.currentPage)
    },

    // 重置初始数据
    reset () {
      // console.log('restet data')
      this.limit = 10
      this.offset = 0
      this.count = 0
      this.currentPage = 1
      // this.list = []
    },

    // 加载数据
    async loadData (page) {
      // console.log('loadData data')
      // const params = {
      //   limit: this.limit,
      //   offset: (page - 1) * this.limit
      // }
      // const { res, err } = await reqSaas(saasApis.list, [], params)
      this.$refs.scroll.forceUpdate()
      // if (err || !res) {
      //   aui.showToast(err.err_msg)
      //   return
      // }
      // const { count, rows } = res
      // // 有数据当前页面加一，否则不加
      // if (rows.length > 1) {
      //   this.currentPage++
      //   this.list.push(...rows)
      //   this.count = count
      // }
    }
  }
}
</script>

<style lang="stylus" scoped>
.container
  // position: relative
  // top: 0
  // left: 0
  // // bottom: 100px
  // // border: 1px solid red
  // display flex
  // flex-direction column
.scroll-wrap
  // flex 1
  // height: 60vh
  width 100%
  height 100%

.scroll-list-wrap
  padding-bottom: 97px;

.no-data
  text-align center
  padding 200px 0 0
  color rgba(0, 0, 0, 0.5)

.op-list
  .op-list-item
    background: #f2f2f2;
    margin-top: 10px;

    .op-card
      padding 20px

      .op-card-item
        display flex
        justify-content space-between
        align-items center
        padding-bottom 24px
        font-size 28px
        font-weight 400
        color rgba(50, 50, 50, 1)

      .op-card-item:last-child
        padding-bottom 100px
</style>