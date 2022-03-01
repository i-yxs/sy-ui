
import Vue from 'vue'
import Vuex from 'vuex'

import user from './modules/user'
import baseData from './modules/baseData'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        user,
        baseData
    },
    getters: {
        isLogin: state => state.user.isLogin,
        userInfo: state => state.user.userInfo
    }
})

export default store
