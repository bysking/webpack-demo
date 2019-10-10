<template>
  <div v-fixStatusBar class="container">
    <Title :customBack="true" @on-back="backToIndex" value="帮助列表"/>
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
      <div v-if="showHistory"
class="history-wrapper">
        <div
          v-for="item in myHistory"
          :key="item"
          class="history-item"
          @click="setSearckKey(item)"
        >
          {{ item }}
        </div>
        <div v-if="myHistory.length===0"
class="history-item">
暂无搜索记录
</div>
      </div>
    </transition>
    <div ref="top" class="scroll-wrap">
      <yd-scroll
        ref="scroll"
        v-fixTabBar
        :items="tipList"
        class="scroll"
        :scroll-height="scrollWrapHeight"
        @on-pulling-down="onPullingDown"
        @on-pulling-up="onPullingUp"
>
<ul v-if="this.searchKey===''"
class="y-list">
          <li v-for="item in tipList" class="y-list-item" :key="item.id" @click="toDetailPage(item)">
            <div class="y-list-item-inner border-bottom-1px">
              <div class="y-list-item__label">
                {{ item.title }}
              </div>
              <div class="y-list-item__icon">
                <yd-icon name="arrow-right" />
              </div>
            </div>
          </li>
          <div v-show="!tipList || tipList.length === 0" class="no-data">
暂无数据
</div>
        </ul>
        <ul v-if="this.searchKey!==''"
class="y-list">
          <li v-for="item in searchList" class="y-list-item" :key="item.id" @click="toDetailPage(item)">
            <div class="y-list-item-inner border-bottom-1px">
              <div class="y-list-item__label">
                {{ item.title }}
              </div>
              <div class="y-list-item__icon">
                <yd-icon name="arrow-right" />
              </div>
            </div>
          </li>
          <div v-show="!searchList || searchList.length === 0" class="no-data">
暂无数据
</div>
        </ul>
      </yd-scroll>
    </div>
    <div ref="refOfbtn" class="bottom-btn">
      <div>
        <div @click="toCenterPage">
          <i class="active cubeic-back"/>
        </div>
      </div>
      <div>
        <div @click="goDetailPage()">
          <i class="active cubeic-arrow"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import debounce from 'lodash/debounce'
import Title from '@/components/title/title.vue'
// import debounce from 'lodash/debounce'
import { saasApis } from '@/libs/ydapi'
import { reqSaas } from '@/libs/http'
import aui from '@/libs/aui'
import { mapGetters } from 'vuex'
export default {
  name: 'SearchTip',
  components: {
    Title
  },
  data () {
    return {
      limit: 10,
      offset: 0,
      count: 0,
      currentPage: 1,
      heighta: 0,
      heightb: 0,
      myHistory: [], // 搜索历史记录
      showHistory: false,
      searchKey: '', // 搜索关键词
      searchList: [], // 搜索列表
      tipList: [],
      classId: '',
      detailItem: '' // 保存上次数据
    }
  },
  computed: {
    ...mapGetters(['histories']),
    item () {
      return JSON.parse(this.$route.query.item)
    },
    scrollWrapHeight () {
      return this.heighta - this.heightb
    }
  },
  created () {
    this.tipList = this.item.tips
    this.classId = this.item.id
    this.$nextTick(() => {
      this.heighta = this.$refs.top.clientHeight
      this.heightb = this.$refs.refOfbtn.clientHeight
    })
  },
  mounted () {
    // this.$nextTick(() => {
    //   this.scrollWrapHeight = this.$refs.refOfbtn.clientHeight
    // })
  },
  methods: {
    backToIndex () {
      this.$router.push({ name: 'home' })
    },
    // 第二页，在指定分类下搜索问题
    async search2 () {
      // console.log(this.tipItem)
      const params = {
        keyword: this.searchKey,
        class_id: this.classId // 当前选定的分类id
      }
      const { res, err } = await reqSaas(saasApis.tips, null, params) // 不知道接口
      if (err || !res) {
        aui.showToast(err.err_msg)
        return
      }
      if (res.rows.length > 0) {
        this.searchList = res.rows // 有结果才更新页面数据
      } else {
        this.searchList = []
        aui.showToast('无搜索结果')
      }
    },
    toCenterPage () {
      this.$router.go(-1)
      // console.log('跳转到帮助中心')
    },
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
      // 搜索指定分类下的问题
      this.search2()
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
    },
    toDetailPage (item) {
      this.detailItem = item
      this.$router.push({
        name: 'search-detail',
        query: {
          item: JSON.stringify(item)
        }
      })
    },
    goDetailPage () {
      this.$router.go(1)
      // this.detailItem = item
      // this.$router.push({
      //   name: 'search-detail',
      //   query: {
      //     item: JSON.stringify(item)
      //   }
      // })
    }
  }
}
</script>

<style lang="stylus" scoped>
.container
  position: fixed
  top: 0
  left: 0
  width: 100%
  height: 100%
  display flex
  flex-direction column
.scroll-wrap
  flex: 1
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
        padding-bottom 100px
.bottom-btn
  display: flex
  justify-content space-between
  align-items center
  height: 100px
  padding: 0px 100px
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
