import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css'

import Element from 'element-ui'
import './styles/element-variables.scss'
import enLang from 'element-ui/lib/locale/lang/en'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters

import axios from 'axios'

axios.defaults.baseURL = 'http://18.216.107.145:5000/api'
    // axios.defaults.baseURL = 'http://localhost:5000/api'

if (process.env.NODE_ENV === 'production') {
    const { mockXHR } = require('../mock')
    mockXHR()
}

Vue.use(Element, {
    size: Cookies.get('size') || 'medium',
    locale: enLang
})

// register global utility filters
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})

import VueChatScroll from 'vue-chat-scroll'
Vue.use(VueChatScroll)

import * as VueGoogleMaps from "vue2-google-maps"
Vue.config.productionTip = false

Vue.use(VueGoogleMaps, {
    load: {
        key: 'AIzaSyCEELUzZC6wuQ6QRao4fHOLBpKQ-fPpkWI',
        libraries: "places"
    }
});

new Vue({
    el: '#app',
    router,
    store,
    beforeCreate() {
        store.commit('initializeStore')
    },
    render: h => h(App)
})