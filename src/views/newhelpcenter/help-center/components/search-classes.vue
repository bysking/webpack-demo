<template>
  <div class="container">
    <!-- 搜索授权列表 -->
    <slot></slot>
    <!-- 滚动区域 -->
    <div class="scroll-list-wrap scroll-list-top">
      <ul class="y-list">
        <li class="y-list-item" v-if="showList.length >= 0">
          <div class="y-list-item-inner border-bottom-1px">
            <div class="y-list-item__label">
              问题类型
            </div>
          </div>
        </li>
      </ul>
      <yd-scroll v-fixTabBar
        ref="scroll"
        :items="showList"
        class="scroll"
        @on-pulling-down="onPullingDown"
        @on-pulling-up="onPullingUp"
      >
        <ul class="y-list">
          <li class="y-list-item" v-for="item in showList" :key="item.id" @click="toTipPage(item)">
            <div class="y-list-item-inner border-bottom-1px">
              <div class="y-list-item__label">
                {{item.name}}
              </div>
              <div class="y-list-item__icon">
                <yd-icon name="arrow-right"/>
              </div>
            </div>
          </li>
        </ul>

        <div class="no-data" v-show="!showList || showList.length === 0">暂无数据</div>
      </yd-scroll>
    </div>
  </div>
</template>
<script>
// import debounce from 'lodash/debounce'
import { saasApis } from '@/libs/ydapi'
import { reqSaas } from '@/libs/http'
import aui from '@/libs/aui'

export default {
  // 帮助中心页面
  name: 'search-classes',
  data () {
    return {
      searchKey: '',
      limit: 10,
      offset: 0,
      count: 0,
      currentPage: 1,
      showList: []
    }
  },
  created () {
  },
  mounted () {
    this.initclassData()
  },
  computed: {
  },
  methods: {
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
      this.showList = []
    },
    // 加载数据
    async loadData (page) {
      // console.log('loadData data')
      // const params = {
      //   limit: this.limit,
      //   offset: (page - 1) * this.limit
      // }
      // const { res, err } = await reqSaas(saasApis.xxx, [], params)
      // this.$refs.scroll.forceUpdate()
      // if (err || !res) {
      //   aui.showToast(err.err_msg)
      //   return
      // }
      // const { count, rows } = res
      // // 有数据当前页面加一，否则不加
      // if (rows.length > 1) {
      //   this.currentPage++
      //   this.showList.push(...rows)
      //   this.count = count
      // }
      this.initclassData()
    },

    async toTipPage (item) { // 查看选定分类下的数据列表，item当前分类的数据，包含许多问题
      this.$emit('toTipPage', item)
    },
    // 初始化帮助分类大类列表
    async initclassData () {
      // 原来的助手没有传分页参数，保持一致
      const { res, err } = await reqSaas(saasApis.tip_class, null, { type: '0' })
      this.$refs.scroll.forceUpdate()
      if (err || !res) {
        aui.showToast(err.err_msg)
        return
      }
      // console.log(res)
      // const test = [1, 2, 3, 4, 5, 6, 7, 8, 9, 12, 23, 34]
      // test.map(ite => {
      //   return {
      //     id: ite,
      //     name: ite
      //   }
      // })
      this.showList = [...res.rows]
    }
  }
}
</script>
<style lang="stylus" scoped>
.container
  position: fixed
  top: 0
  left: 0
  bottom: 100px
  width 100%
  height 65%
  // border: 1px solid red
  display flex
  flex-direction column
  background rgba(248, 248, 247, 1) !important

.scroll-list-wrap
  flex 1
  height: 70vh
.scroll-list-top
  max-height: 85vh
  min-height: 85vh
  display: flex
  flex-direction: column
  top: 0
  left: 0
  right: 0
  // border: 1px solid red
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
        padding-bottom 0
</style>