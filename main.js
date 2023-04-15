import Vue from 'vue'
import App from './App'
import { $http } from '@escook/request-miniprogram'


uni.$http = $http

// 配置请求跟路径
$http.baseUrl = 'https://www.uinav.com'

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
	...App
})
app.$mount()
