// API
import userApi from '@/api/user'
// 方法
import { 
    getToken,
    setToken,
    clearToken,
    setUserInfo
} from '@/utils/storage'

const user = {
    state: {
        isLogin: false,
        userInfo: {},
        token: (getToken() || {}).access_token || '',
        refreshToken: (getToken() || {}).refresh_token || '',
        feature: []
    },
    mutations: {
        setToken(state, res) {
            state.isLogin = true
            state.token = res.access_token
            state.refreshToken = res.refresh_token
            setToken(res)
        },
        setUserName(state, value) {
            state.userInfo.username = value
            setUserInfo(state.userInfo)
        },
        setUserInfo(state, userInfo) {
            state.isLogin = true
            state.userInfo = userInfo
        }
    },
    actions: {
        // 登录
        async login({ commit, dispatch }, token) {
            commit('setToken', token)
            await dispatch('getUserInfo')
        },
        // 退出登录
        async logout({ state }) {
            state.isLogin = false
            state.token = ''
            state.refreshToken = ''
            state.userInfo = {}
            clearToken()
        },
        // 获取用户信息
        async getUserInfo({ state, commit, dispatch }) {
            if (state.token) {
                // let data = await userApi.userInfo()
                commit('setUserInfo', data || {})
                dispatch('initBaseData')
            }
        }
    }
}

export default user
