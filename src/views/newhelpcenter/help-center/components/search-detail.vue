<template>
    <div class='container'>

      <div class="flex1">
        <!-- 标题 -->
        <h1 class='tip--title border-bottom-1px'>{{tipInfo.title}}</h1>
      </div>

      <div class="flex1">
        <!-- 内容 -->
        <div class="scroll-list-wrap scroll-list-top border-bottom-1px">
          <cube-scroll ref="scroll">
            <pre v-html="tipInfo.message" class="tip--content"></pre>
          </cube-scroll>
        </div>
      </div>

      <div class="flex1">
        <!-- 关联问题 -->
        <div class="scroll-list-wrap scroll-list-bottom border-bottom-1px">
          <ul class="y-list" v-if="relateTips.length >= 0">
            <li class="y-list-item">相关问题</li>
          </ul>
          <yd-scroll
            v-fixTabBar
            ref="scrolldetail"
            class="scroll"
            :items="relateTips"
            @on-pulling-down="onPullingDown"
            @on-pulling-up="onPullingUp"
          >
            <ul class="y-list" v-if="relateTips.length >= 0">
              <!-- 重要！！！ 此处点击测试数据'关于写代码'-'BUG改不完' 跳转后 会报键值重复错误，因为相关问题列表里面有多条记录id重复 -->
              <!-- 重要！！！ 所以这里我用了:key="index" 而不是:key="item.id" 目前解决方案是后台清理数据， 由于我排查了几遍，前台逻辑应该没bug的 -->
              <li class="y-list-item" v-for="(item, index) in relateTips" :key="index" @click="toDetailPage(item)">
                <div class="y-list-item-inner border-bottom-1px">
                  <div class="y-list-item__label">
                    {{item.title}}
                  </div>
                  <div class="y-list-item__icon">
                    <yd-icon name="arrow-right"/>
                  </div>
                </div>
              </li>
            </ul>
          </yd-scroll>
        </div>
      </div>

    </div>
</template>

<script>
import { saasApis } from '@/libs/ydapi'
import { reqSaas } from '@/libs/http'
import aui from '@/libs/aui'
const ApiCfg = process.API_CFG
export default {
  name: 'search-detail',
  props: {
    itemDetail: Object // 页面展示的问题详情数据
  },
  data () {
    return {
      tipInfo: {
        title: '提示信息',
        message: '等待刷新'
      },
      limit: 10,
      offset: 0,
      relateTips: [] // 相关问题
    }
  },
  computed: {
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
    }
  },
  created () {
    // util.log(this.itemDetail)
    this.initTipData(this.id)
  },
  mounted () {
    this.initTipRelate()
  },
  methods: {
    // 加载问题的详情数据
    async initTipData () {
      console.log(this.itemDetail)
      // util.log('获取帮助内容详情')
      const { res, err } = await reqSaas(saasApis.tip_info, [this.id])
      if (err || !res) {
        aui.showToast(err.err_msg)
        return
      }
      res.message = res.message.split('/v3/file/').join(ApiCfg.oss + 'v3/file/')
      this.tipInfo = res
      // 参考代码
      // ossUrl = 'http://qa-fe.dding.net/'; // 线下 oss(图片、视频)存储域名
      // res.message = res.message.split('/v3/file/').join($http.ossUrl + 'v3/file/')
      //             this.tipInfo = res
      //             api.refreshHeaderLoadDone()
      // util.log(res)
    },
    // 初始化相关问题，根据问题的父级id获取，如果要改需要后端提供接口
    async initTipRelate () {
      let params = {
        limit: this.limit,
        offset: this.offset,
        class_id: this.tipInfo.class_id
      }
      const { res, err } = await reqSaas(saasApis.tips, [], params)
      this.$refs.scrolldetail.forceUpdate()
      if (err || !res) {
        aui.showToast(err.err_msg)
        return
      }
      if (res.rows.length >= 0) {
        this.offset += this.limit
        this.relateTips.push(...res.rows)
      }
    },
    // 跳转到问题详情页
    toDetailPage (item) {
      // util.log(item)
      this.$emit('update-detail-prop', item) // 触发去掉当前页面已经显示的详情页
      setTimeout(() => {
        this.initTipData() // 重新获取详情数据
        this.reset()
        this.initTipRelate()
      }, 0)
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
  position: relative
  top: 0
  left: 0
  width 100%
  height 100%
  display flex
  flex-direction column
  .flex1
    flex: 1
.scroll-list-wrap
  height: 278px;
  flex: 1
.scroll-list-top
  height: 712px
.scroll-list-bottom
  height: 360px
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