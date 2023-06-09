import Vue from 'vue'
import App from './App'
import { $http } from '@escook/request-miniprogram'
import store from './store/store.js'


uni.$http = $http

// 封装的展示消息提示的方法
uni.$showMsg = function (title = '数据加载失败!',duration = 1500) {
	uni.showToast({
		title,
		duration,
		icon:'none'
	})
}
// 配置请求跟路径
// $http.baseUrl = 'https://www.uinav.com'
$http.baseUrl = 'https://api-hmugo-web.itheima.net'


// 请求前做的一些事情
$http.beforeRequest = function (options) {
	uni.showLoading({
		title: '数据加载中.....'
	})
}

// 请求后做一些事情
$http.afterRequest = function () {
	uni.hideLoading()
}


Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App,
	// 将 store 挂载到 Vue 实例上
	store,
})
app.$mount()
