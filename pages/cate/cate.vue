<template>
	<view>

		 <!-- 使用 自定义的搜索组件 -->
		<my-search @click="gotoSearch"></my-search>

		<view class="scroll-view-container">
			<scroll-view class="left-scroll-view" scroll-y :style="{height: wh + 'px'}">
				<block v-for="(item, i) in cateList" :key="i">
					<view :class="['left-scroll-view-item', i === active ? 'active' : '']" @click="activeChanged(i)">
						{{item.cat_name}}
					</view>
				</block>

				
			</scroll-view>
			<scroll-view class="right-scroll-view" scroll-y :style="{height: wh + 'px'}" :scroll-top="scrollTop">
				<view class="cate-lv2" v-for="(item2, i2) in cateLevel2" :key="i2">
					<view class="cate-lv2-title">
						/{{item2.cat_name}} /
					</view>
					
					<!-- 动态渲染三级分类列表数据 -->
					<view class="cate-lv3-list">
						<view class="cate-lv3-item" v-for="(item3, i3) in item2.children" :key="i3" @click="gotoGoodsList(item3)">
							<image :src="item3.cat_icon"></image>
							<text>{{item3.cat_name}}</text>
						</view>
						
					</view>

				</view>
				
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import badgeMix from '@/mixins/tabbar-badge.js'
	export default {
		mixins: [badgeMix],
		data() {
			return {
				wh: 0,
				cateList: [],
				active: 0,
				cateLevel2: [],
				// 滚动条距离顶部距离
				scrollTop: 0
			};
		},
		onLoad() {
			const sysInfo = uni.getSystemInfoSync()
			this.wh = sysInfo.windowHeight - 50
			this.getCateList()
		},
		methods: {
			// 获取分类列表数据
			async getCateList() {
			  // 3.1 发起请求
			  const { data: res } = await uni.$http.get('/api/public/v1/categories')
			  // 3.2 请求失败
			  if (res.meta.status !== 200) return uni.$showMsg()
			  // 3.3 请求成功，为 data 中的数据赋值
			  this.cateList = res.message
			  
			  this.cateLevel2 = res.message[0].children
			},
			
			activeChanged(i) {
				this.active = i
				this.cateLevel2 = this.cateList[i].children
				this.scrollTop = this.scrollTop ? 0:1
			},
			gotoGoodsList(item3) {
				uni.navigateTo({
					url: '/subpkg/goods_list/goods_list?cid=' + item3.cat_id
				})
			},
			
			gotoSearch() {
				uni.navigateTo({
					url: '/subpkg/search/search'
				})
			}
		}
	}
</script>

<style lang="scss">
.scroll-view-container {
	display: flex;
	
	.left-scroll-view {
		width: 120px;
		
		.left-scroll-view-item {
			line-height: 60px;
			background-color: #F7F7F7;
			text-align: center;
			font-size: 12px;
			
			// 激活项样式
			&.active {
				background-color: #ffffff;
				position: relative;
				
				// 渲染激活项左侧红色指示线
				&::before {
					content: ' ';
					display: block;
					width: 3px;
					height: 30px;
					background-color: #c00000;
					position: absolute;
					left: 0;
					top: 50%;
					transform: translateY(-50%);

				}
			}
		}
	}
	.cate-lv2-title {
		font-size: 12px;
		font-weight: bold;
		text-align: center;
		padding: 15px 0;
	}
	
	.cate-lv3-list {
		display: flex;
		flex-wrap: wrap;
		
		.cate-lv3-item {
			width: 33.33%;
			margin-bottom: 10px;
			display: flex;
			flex-direction: column;
			align-items: center;
			
			image {
				width: 60px;
				height: 60px;
			}
			
			text {
				font-size: 12px;
			}
		}
	}

}
</style>
