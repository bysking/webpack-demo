<template>
  <div
v-fixStatusBar
       class="container"
>
    <Title value="帮助中心" />
    <div ref="reOfpanel">
      <cube-tab-panels v-model="selectedLabel">
        <cube-tab-panel
v-for="item in tabs"
                        :key="item.label"
:label="item.label"
>
          <component
            :is="item.component"
            v-if="item.loaded"
            :item-detail="itemDetail"
            :tips="tipItem"
            :scrollheight="scrollHeight"
            @to-detail-page="toDetailPage"
            @update-detail-prop="updateDetailProp"
            @toTipPage="toTipPage"
          >
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
              <div
v-if="showHistory"
                   class="history-wrapper"
>
                <div
                  v-for="item in myHistory"
                  :key="item"
                  class="history-item"
                  @click="setSearckKey(item)"
                >
                  {{ item }}
                </div>
                <div
v-if="myHistory.length===0"
                     class="history-item"
>
                  暂无搜索记录
                </div>
              </div>
            </transition>
          </component>
        </cube-tab-panel>
      </cube-tab-panels>
    </div>
    <div
v-if="selectedLabel!==1"
         class="bottom-btn"
>
      <div>
        <div @click="leftPage">
          <!-- <yd-icon name="arrow-left"/> -->
          <i class="active cubeic-back" />
        </div>
      </div>
      <div>
        <div
v-if="selectedLabel!==3"
             @click="rightPage"
>
          <!-- <yd-icon name="arrow-right"/> -->
          <i class="active cubeic-arrow" />
        </div>
      </div>
    </div>
    <!-- <div v-fixTabBar></div> -->
  </div>
</template>
<script>
import Title from '@/components/title/title.vue'
import searchClasses from './components/search-classes.vue'
import searchTip from './components/search-tip.vue'
import searchDetail from './components/search-detail.vue'
// import debounce from 'lodash/debounce'
import { saasApis } from '@/libs/ydapi'
import { reqSaas } from '@/libs/http'
import aui from '@/libs/aui'
import { mapGetters } from 'vuex'
export default {
  // 帮助中心页面
  name: 'HelpCenter',
  components: {
    Title,
    searchClasses,
    searchTip,
    searchDetail
  },
  data () {
    return {
      myHistory: [],
      showHistory: false,
      limit: 10,
      offset: 0,
      classId: '',
      searchKey: '',
      itemDetail: {}, // 选定的问题
      tipItem: {}, // 选定的问题大类
      selectedLabel: 1,
      tabs: [
        {
          id: 1,
          label: 1,
          context: 'cubeic-like',
          name: '帮助中心',
          component: 'searchClasses',
          loaded: true
        },
        {
          id: 2,
          label: 2,
          context: 'cubeic-star',
          name: '帮助中心二级页面',
          component: 'searchTip',
          loaded: false
        },
        {
          id: 3,
          label: 3,
          context: 'cubeic-star',
          name: '帮助中心三级页面',
          component: 'searchDetail',
          loaded: false
        }
      ],
      scrollHeight: 0
    }
  },
  created () {},
  mounted () {
    this.$nextTick(() => {
      this.scrollHeight = this.$refs.reOfpanel.clientHeight
    })
  },
  computed: {
    ...mapGetters(['histories'])
  },
  methods: {
    focusfns () {
      // console.log('11')
      this.showHistory = true
      this.myHistory = this.histories
    },
    blurfns () {
      // console.log('22')
      this.showHistory = false
    },
    leftPage () {
      // console.log('--')
      if (this.selectedLabel > 1) {
        if (this.selectedLabel === 2) {
          // 从分类下问题列表页 跳回分类页 清空搜索关键词
          this.searchKey = ''
        }
        this.selectedLabel--
      }
      this.tabs.forEach(item => {
        if (item.id === this.selectedLabel) {
          // 如果遍历的菜单等于当前需要改变的菜单的index
          if (!item.loaded) {
            // 未加载就加载
            item.loaded = true
          }
        } else {
          if (item.loaded) {
            item.loaded = false // 如果遍历的菜单不等于当前需要改变的菜单的index就关闭
          }
        }
      })
    },
    rightPage () {
      // console.log('++')
      // itemDetail: {}, // 选定的问题
      // tipItem: {}, // 选定的问题大类
      switch (this.selectedLabel) {
        case 1: {
          if (Object.keys(this.tipItem).length > 0) {
            this.searchKey = '' // 点击具体分类问题后，清空大类搜索关键词
            this.selectedLabel++
          } else {
            aui.showToast('分类下暂无数据')
          }
          break
        }
        case 2: {
          if (Object.keys(this.itemDetail).length > 0) {
            this.selectedLabel++
          } else {
            aui.showToast('请先选择问题分类')
          }
          break
        }
      }
      if (this.selectedLabel < 3) {
        // if (this.selectedLabel === 1 && Object.keys(this.tipItem).length > 0) {
        //   this.selectedLabel++
        //   return
        // } else if (this.selectedLabel === 2 && Object.keys(this.itemDetail).length > 0) {
        //   this.selectedLabel++
        //   return
        // }
        // this.selectedLabel++
      }
      this.tabs.forEach(item => {
        if (item.id === this.selectedLabel) {
          // 如果遍历的菜单等于当前需要改变的菜单的index
          if (!item.loaded) {
            // 未加载就加载
            item.loaded = true
          }
        } else {
          if (item.loaded) {
            item.loaded = false // 如果遍历的菜单不等于当前需要改变的菜单的index就关闭
          }
        }
      })
    },
    // 切换到帮助问题列表页
    toTipPage (item) {
      const { tips = null, id = null } = item
      this.tipItem = tips || item
      this.classId = id
      this.rightPage() // 切换下一页页
    },
    // 切换到帮助问题详情页
    toDetailPage (itemDetail) {
      this.itemDetail = itemDetail
      this.rightPage() // 切换detail页，下一页
    },
    // 更新传入详情页面的参数
    updateDetailProp (itemDetail) {
      this.itemDetail = itemDetail
      // this.rightPage() // 切换detail页，下一页
    },
    // 处理授权搜索,函数抖动
    doSearch () {
      if (this.searchKey.trim() === '') {
        // 空值不发请求
        // 重新获取分类数据
        return
      }
      this.setHistory()
      // console.log('搜索参数：' + this.searchKey)
      if (this.selectedLabel === 1) {
        // 在第一个pannel页面
        // 搜索所有问题
        this.search()
      } else if (this.selectedLabel === 2) {
        // 在第二个pannel页面
        //  搜索指定分类的问题
        this.search2()
      }
    },
    async setHistory () {
      await this.$store.dispatch('ADD_HISTORY', this.searchKey)
      this.init()
    },
    init () {
      this.myHistory = this.histories
    },
    setSearckKey (item) {
      // console.log('搜索', item)
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
      const { res, err } = await reqSaas(saasApis.tips, null, params)
      if (err || !res) {
        aui.showToast(err.err_msg)
        return
      }
      if (res.rows.length > 0) {
        this.searchKey = '' // 进入分类前，把大类的搜索关键词赋值为空
        // 有数据才切换pannel到第二页
        this.toTipPage(res.rows)
      } else {
        aui.showToast('无搜索结果')
      }
      // console.log(res)
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
        aui.showToast('无搜索结果')
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.container {
  position: relative;
  background: #fff !important;
}

.bottom-btn {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5vw 100px;
  // border: 1px solid blue
  position: fixed;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: #fff;
}

.cube-input {
  width: 100%;
}

.search-wrap {
  background: #fff;
  padding: 2.667vw 4.8vw;
}

.search-wrap > div {
  width: 100%;
  height: 9.333vw;
  display: flex;
}

.search-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 7.067vw;
  height: 100%;
  background: #efefef;
  float: left;
  border-radius: 1.333vw 0 0 1.333vw;
}

.search-wrap > div input {
  flex: 1;
  height: 100%;
  border-radius: 0 1.333vw 1.333vw 0;
  background: #efefef;
  line-height: 9.333vw;
}

.active:active {
  color: lightblue;
}

.history-wrapper {
  border: 1px solid #e7e7f7;
  display: flex;
  flex-direction: column;
  padding: 0.667vw 1.333vw;
  width: 93%;
  justify-content: space-around;
  margin: 0 auto;
}

.history-item {
  width: 100%;
  margin: 7px auto;
  padding: 5px 20px;
}

.history-item:hover {
  background: #f8f8f7;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter, .fade-leave-to { /* .fade-leave-active below version 2.1.8 */
  opacity: 0;
}
</style>
