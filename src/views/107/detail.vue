<template>
  <div v-fixStatusBar class='container'>
    <Title :customBack="true" @on-back="backToIndex" value="帮助详情"/>
    <!-- 标题 -->
    <h1 class="tip--title border-bottom-1px">
{{ tipInfo.title }}
</h1>

    <!-- 内容 -->
    <div class="scroll-list-wrap scroll-list-top border-bottom-1px">
      <cube-scroll>
        <pre class="tip--content" v-html="tipInfo.message"/>
      </cube-scroll>
    </div>
    <!-- 关联问题 -->
    <ul v-if="relateTips.length >= 0" class="y-list">
      <li class="y-list-item">
相关问题
</li>
    </ul>
    <div ref="refWrap" class="scroll-wrap border-bottom-1px">
      <yd-scroll
        ref="scrolldetail"
          v-fixTabBar
        class="scroll"
        :items="relateTips"
        :scroll-height="scrollWrapHeight"
        @on-pulling-down="onPullingDown"
        @on-pulling-up="onPullingUp"
      >
        <ul v-if="relateTips.length >= 0" class="y-list">
          <li v-for="(item, index) in relateTips" class="y-list-item" :key="index" @click="toDetailPage(item)">
            <div class="y-list-item-inner border-bottom-1px">
              <div class="y-list-item__label">
                {{ item.title }}
              </div>
              <div class="y-list-item__icon">
                <yd-icon name="arrow-right" />
              </div>
            </div>
          </li>
          <div v-show="!relateTips || relateTips.length === 0" class="no-data">
暂无数据
</div>
        </ul>
      </yd-scroll>
    </div>
    <div ref="refOfBtn" class="bottom-btn">
      <div>
        <div @click="toTipPage">
          <i class="active cubeic-back"/>
        </div>
      </div>
      <div>
        <div/>
      </div>
    </div>
  </div>
</template>

<script>
import Title from '@/components/title/title.vue'
import { saasApis } from '@/libs/ydapi'
import { reqSaas } from '@/libs/http'
import aui from '@/libs/aui'
const ApiCfg = process.API_CFG
export default {
  name: 'SearchDetail',
  components: {
    Title
  },
  data () {
    return {
      tipInfo: {
        title: '',
        message: ''
      },
      limit: 10,
      offset: 0,
      heighta: 0,
      heightb: 0,
      relateTips: [] // 相关问题
    }
  },
  computed: {
    itemDetail () {
      return JSON.parse(this.$route.query.item)
    },
    id () { // 问题id
      return this.itemDetail.id
    },
    title () { // 问题标题
      return this.itemDetail.title
    },
    classId () { // 问题的父级分类id
      return this.tipInfo.class_id
    },
    options () {
      return {
        pullDownRefresh: this.pullDownRefreshObj,
        pullUpLoad: this.pullUpLoadObj,
        scrollbar: true
      }
    },
    scrollWrapHeight () {
      return this.heighta - this.heightb
    }
  },
  created () {
    // util.log(this.itemDetail)
    this.initTipData(this.id)
  },
  mounted () {
    this.$nextTick(() => {
      this.heighta = this.$refs.refWrap.clientHeight
      this.heightb = this.$refs.refOfBtn.clientHeight
    })
  },
  methods: {
    backToIndex () {
      this.$router.push({ name: 'home' })
    },
    toTipPage () {
      this.$router.go(-1)
    },
    // 加载问题的详情数据
    async initTipData (id) {
      console.log('初始化详情数据', id)
      // util.log('获取帮助内容详情')
      const { res, err } = await reqSaas(saasApis.tip_info, [id])
      if (err || !res) {
        aui.showToast(err.err_msg)
        return
      }
      res.message = res.message.split('/v3/file/').join(ApiCfg.oss + 'v3/file/')
      this.tipInfo = res
      this.initTipRelate()
      // 参考代码
      // ossUrl = 'http://qa-fe.dding.net/'; // 线下 oss(图片、视频)存储域名
      // res.message = res.message.split('/v3/file/').join($http.ossUrl + 'v3/file/')
      //             this.tipInfo = res
      //             api.refreshHeaderLoadDone()
      // util.log(res)
    },
    // 初始化相关问题，根据问题的父级id获取，如果要改需要后端提供接口
    async initTipRelate () {
      const params = {
        limit: this.limit,
        offset: this.offset,
        class_id: this.classId
      }
      const { res, err } = await reqSaas(saasApis.tips, [], params)
      this.$refs.scrolldetail.forceUpdate()
      if (err || !res) {
        aui.showToast(err.err_msg)
        return
      }
      const records = res.rows.filter((item) => {
        return item.id !== this.tipInfo.id
      })
      if (records.length > 0) {
        this.offset += this.limit
        this.relateTips.push(...records)
      }
    },
    // 跳转到问题详情页
    toDetailPage (item) {
      // this.tipInfo = item
      this.reset()
      this.initTipData(item.id) // 重新获取详情数据
    },
    // 下拉刷新
    onPullingDown () {
      this.reset()
      this.initTipRelate()
    },
    // 上拉加载
    onPullingUp () {
      this.initTipRelate()
    },

    // 重置初始数据
    reset () {
      this.limit = 10
      this.offset = 0
      this.relateTips = []
    }
  }
}
</script>

<style lang="stylus" scoped>
.container
  position: fixed
  top: 0
  left: 0
  width 100%
  height 100%
  display flex
  flex-direction column

.scroll-list-wrap
  min-height: 50px
.scroll-list-top
  height: 600px
.scroll-wrap
  flex: 1
.bottom-btn
  height: 100px
  padding: 0px 100px
  // border: 1px solid blue
  position: fixed
  left: 0
  bottom: 0
  right: 0
  display: flex
  justify-content space-between
  align-items center
  background-color: #fff
.tip--content
  white-space pre-wrap
  line-height 2
  padding 30px
  border-radius 10px
  p
    font-size 28px
  img
    max-width 100%
.frm-title
  padding-top 30px
.tip--title
  text-align: center
  padding: 10px
  font-weight: bold

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
.y-list-item__label
  display: flex;
  align-items: center;
  padding: 3vw 0;
  min-width: 22vw;
  min-height: 8.267vw;
  font-size: 4vw;
</style>
