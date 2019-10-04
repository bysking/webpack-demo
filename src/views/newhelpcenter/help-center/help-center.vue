<template>
  <div class="container" v-fixStatusBar>
    <Title value='帮助中心'></Title>
    <div class="search-wrap">
      <div @keyup.enter="doSearch">
        <div class="search-icon">
          <i class="cubeic-search" />
        </div>
        <cube-input
          v-model="searchKey"
          :clearable="true"
          placeholder="请输入想要咨询的问题"
          @focus="focusfns"
          @blur="blurfns"
        />
      </div>
    </div>
    <transition name="fade">
      <div v-if="showHistory" class="history-wrapper">
        <div
          v-for="item in myHistory"
          :key="item"
          class="history-item"
          @click="setSearckKey(item)"
        >
          {{ item }}
        </div>
        <div v-if="myHistory.length===0" class="history-item">暂无搜索记录</div>
      </div>
    </transition>
    <!-- 滚动区域 -->
    <ul class="y-list">
      <li class="y-list-item">
        <div class="y-list-item-inner border-bottom-1px">
          <div class="y-list-item__label">
            {{ this.searchKey==='' ? '问题类型' : '搜索结果'}}
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
      <ul v-if="this.searchKey===''" class="y-list">
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
        <div class="no-data" v-show="!showList || showList.length === 0">暂无数据</div>
      </ul>
      <ul v-if="this.searchKey!==''" class="y-list">
        <li class="y-list-item" v-for="item in searchList" :key="item.id" @click="toDetailPage(item)">
          <div class="y-list-item-inner border-bottom-1px">
            <div class="y-list-item__label">
              {{item.title}}
            </div>
            <div class="y-list-item__icon">
              <yd-icon name="arrow-right"/>
            </div>
          </div>
        </li>
        <div class="no-data" v-show="!searchList || searchList.length === 0">暂无数据</div>
      </ul>

    </yd-scroll>
  </div>
</template>
<script>
import Title from '@/components/title/title.vue'
// import debounce from 'lodash/debounce'
import { saasApis } from '@/libs/ydapi'
import { reqSaas } from '@/libs/http'
import aui from '@/libs/aui'
import { mapGetters } from 'vuex'
export default {
  // 帮助中心页面
  name: 'help-center',
  components: {
    Title
  },
  data () {
    return {
      myHistory: [], // 搜索历史记录
      showHistory: false,
      limit: 10,
      offset: 0,
      classId: '',
      searchKey: '', // 搜索关键词
      showList: [], // 问题分类列表
      searchList: [] // 搜索结果列表
    }
  },
  created () {
    this.initclassData()
  },
  mounted () {
  },
  computed: {
    ...mapGetters(['histories'])
  },
  methods: {
    focusfns () {
      this.showHistory = true
      this.myHistory = this.histories
    },
    blurfns () {
      this.showHistory = false
    },
    // 处理授权搜索,函数抖动
    doSearch () {
      if (this.searchKey.trim() === '') { // 空值不发请求
        // 重新获取分类数据
        return
      }
      this.setHistory()
      // 搜索所有问题
      this.search()
    },
    async setHistory () {
      await this.$store.dispatch('ADD_HISTORY', this.searchKey)
      this.init()
    },
    init () {
      this.myHistory = this.histories
    },
    setSearckKey (item) {
      this.searchKey = item
      this.doSearch()
    },
    // 第一页，搜索全部问题，接口已知
    async search () {
      const params = {
        keyword: this.searchKey
        // limit: this.limit,
        // offset: this.offset
      }
      const {res, err} = await reqSaas(saasApis.tips, null, params)
      if (err || !res) {
        aui.showToast(err.err_msg)
        return
      }
      this.searchList = res.rows
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
    toTipPage (item) {
      // console.log(item)
      this.$router.push({
        name: 'search-tip',
        query: {
          item: JSON.stringify(item)
        }
      })
    },
    toDetailPage (item) {
      this.$router.push({
        name: 'search-detail',
        query: {
          item: JSON.stringify(item)
        }
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
.container
  position: fixed
  top: 0
  left: 0
  right: 0
  width 100%
  height 100%
  display flex
  flex-direction column
  background rgba(248, 248, 247, 1) !important

.scroll-list-wrap
  flex 1
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

.bottom-btn
  display: flex
  justify-content space-between
  align-items center
  padding: 5vw 100px
  // border: 1px solid blue
  position: fixed
  left: 0
  bottom: 0
  right: 0
  background-color: #fff
.cube-input
  width: 100%
.search-wrap
  background: #fff
  padding: 2.667vw 4.8vw
.search-wrap > div
  width: 100%
  height: 9.333vw
  display: flex
.search-icon
  display: flex
  justify-content: center
  align-items: center
  width: 7.067vw
  height: 100%
  background: #efefef
  float: left
  border-radius: 1.333vw 0 0 1.333vw
.search-wrap > div input
  flex: 1
  height: 100%
  border-radius: 0 1.333vw 1.333vw 0
  background: #efefef
  line-height: 9.333vw
.active:active
  color: lightblue
.history-wrapper
  border: 1px solid #e7e7f7;
  display: flex;
  flex-direction: column;
  padding: 0.667vw 1.333vw;
  width: 93%;
  justify-content: space-around;
  margin: 0 auto;
.history-item
  width: 100%;
  margin: 7px auto;
  padding: 5px 20px;
.history-item:hover
  background: #f8f8f7
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>