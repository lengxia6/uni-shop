<template>
	<view>
		<view class="search-box">
			<uni-search-bar @input="input" :radius="100" cancelButton="none"></uni-search-bar>
		</view>
		
		<view class="sugg-list" v-if="searchResults.length !== 0">
			<view class="sugg-item" v-for="(item, i) in searchResults" :key="i" @click="gotoDetail(item.goods_id)">
				<view class="goods-name">{{item.goods_name}}</view>
				<uni-icons type="arrowright" size="16"></uni-icons>
			</view>
		</view>
		<view class="history-box" v-else>
			<view class="history-title">
				<text>搜索历史</text>
				<uni-icons type="trash" size="17" @click="cleanHistory"></uni-icons>
				
			</view>
			<view class="history-list">
				<uni-tag :text="item" v-for="(item, i) in historys" :key="i" @click="gotoGoodsList(item)"></uni-tag>
				
			</view>
		</view>
	</view>

</template>

<script>
	export default {
		
		computed: {
			historys() {
				return [...this.historyList].reverse()
			}
		},
		data() {
			return {
				timer: null,
				kw: '',
				searchResults: [],
				historyList: []
			};
		},
		
		methods: {
			input(e) {
				// 清楚 timer 延时器
				clearTimeout(this.timer)
				// 重启一个延时器
				this.timer = setTimeout(() =>{
				  this.kw = e.value
				  this.getSearchList()
				},500)
			},
			async getSearchList() {
				if (this.kw === '') {
					this.searchResults = []
					return
				}
				const { data: res } = await uni.$http.get('/api/public/v1/goods/qsearch',{ query: this.kw})
				// 3.2 请求失败
				if (res.meta.status !== 200) return uni.$showMsg()
				// 3.3 请求成功，为 data 中的数据赋值
				this.searchResults = res.message
				
				this.saveSearchHistory()
			},
			gotoDetail(goods_id) {
				uni.navigateTo({
					url: '/subpkg/goods_detail/goods_detail?goods_id=' + goods_id
				})
			},
			
			saveSearchHistory() {
				// this.historyList.push(this.kw)
				
				const set = new Set(this.historyList)
				set.delete(this.kw)
				set.add(this.kw)
				this.historyList = Array.from(set)
				// 将搜素历史记录持久化存储到本地
				uni.setStorageSync('kw', JSON.stringify(this.historyList))
			},
			
			cleanHistory() {
				this.historyList = []
				uni.setStorageSync('kw', '[]')
			},
			
			gotoGoodsList(kw) {
				uni.navigateTo({
					url: '/subpkg/goods_list/goods_list?query=' + kw
				})
			}
		},
		
		onLoad() {
			this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]')
		}
	}
</script>

<style lang="scss">
  .search-box {
    position: sticky;
    top: 0;
    z-index: 999;
  }
  
  .sugg-list {
	  padding: 0 5px;
	  
	  .sugg-item {
		  font-size: 12px;
		  padding: 13px 0;
		  border-bottom: 1px solid #efefef;
		  display: flex;
		  align-items: center;
		  justify-content: space-between;
		  .goods-name {
			  // 不运行换行
			  white-space: nowrap;
			  // 溢出部分隐藏
			  overflow: hidden;
			  text-overflow: ellipsis;
			  margin-right: 3px;
		  }
	  }
  }
  
  .history-box {
	  padding: 0 5px;
	  
	  .history-title {
	  	  display: flex;
	  	  justify-content: space-between;
	  	  align-items: center;
	  	  height: 40px;
	  	  font-size: 13px;
	  	  border-bottom: 1px solid #efefef;
	  	  
	  	  .history-list {
	  		  display: flex;
	  		  flex-wrap: wrap;
	  		  
	  		  .uni-tag {
	  			  margin-top: 5px;
	  			  margin-right: 5px;
	  		  }
	  	  }
	  }
  }
  
</style>
