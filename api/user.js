import fly from '@/utils/fly'
export default {
    // 登录
    login: function(body) {
        return fly.request({
            url: 'login',
            method: 'post',
            body
        })
    },
    // 获取用户信息
    getUserInfo: function(params) {
        return fly.request({
            url: 'getUserInfo',
            method: 'get',
            params,
            showErrorToast: false
        })
    }
}
