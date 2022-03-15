import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import axios from 'axios'

import Cookie from 'js-cookie'

Vue.use(Vuex)

// https://webpack.js.org/guides/dependency-management/#requirecontext
const modulesFiles = require.context('./modules', true, /\.js$/)

// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
    // set './app.js' => 'app'
    const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
    const value = modulesFiles(modulePath)
    modules[moduleName] = value.default
    return modules
}, {})

export default new Vuex.Store({
    state: {
        user: {},
        data: {}
    },
    mutations: {
        initializeStore(state) {
            Cookie.set('sidebarStatus', 1)
            if (localStorage.getItem('currentUser')) {
                const user = JSON.parse(localStorage.getItem('currentUser'))
                state.user = user
            } else {
                localStorage.removeItem('userId')
                localStorage.removeItem('currentUser')
                localStorage.removeItem('token')
            }
        },
        currentUser(state, currentUser) {
            console.log(currentUser)
            state.user = currentUser
            if (!currentUser) {
                state.user = currentUser
                localStorage.removeItem('userId')
                localStorage.removeItem('currentUser')
                localStorage.removeItem('token')
            } else {
                state.user = currentUser
                localStorage.setItem('currentUser', JSON.stringify(currentUser))
                localStorage.setItem('userId', currentUser.id)

            }
        },
        Data(state, data) {
            state.data = data
        },
    },
    actions: {
        // Admin
        userLogin({ commit }, payload) {
            commit('Data', payload)
            return axios({
                url: '/users/login',
                method: 'POST',
                data: payload
            })
        },
        // Users
        createUser({ commit }, payload) {
            commit('Data', payload)
            return axios({
                url: '/users',
                method: 'POST',
                data: payload
            })
        },
        getUsers({ commit }) {
            commit('Data', {})
            return axios({
                url: `/users`,
                method: 'GET'
            })
        },
        getUser({ commit }, id) {
            commit('Data', {})
            return axios({
                url: `/users/${id}`,
                method: 'GET'
            })
        },
        deleteUser({ commit }, id) {
            commit('Data', {})
            return axios({
                url: `/users/${id}`,
                method: 'DELETE'
            })
        },
        updateUser({ commit }, data) {
            commit('Data', data)
            return axios({
                url: `/users/${data.id}`,
                method: 'PATCH',
                data: data.payload
            })
        },
        fetchSports({ commit }) {
            commit('Data', {})
            return axios.get('https://sports.api.decathlon.com/sports?parents_only=true&has_icon=true')
        },
        fetchPlaces({ commit }, payload) {
            commit('Data', {})
            return axios.get(`https://sportplaces.api.decathlon.com/api/v1/places?origin=${payload.lng},${payload.lat}&radius=50&sports=${payload.sportId}`)
        },
        addToFavourite({ commit }, data) {
            commit('Data', {})
            return axios({
                url: '/sports',
                method: 'POST',
                data: data
            })
        },
        getMySports({ commit }, id) {
            commit('Data', {})
            return axios({
                url: '/sports/my/' + id,
                method: 'GET'
            })
        },
        removeSport({ commit }, id) {
            commit('Data', {})
            return axios({
                url: '/sports/' + id,
                method: 'DELETE'
            })
        },
        manualSearchGeoLocation({ commit }, address) {
            commit('Data', {})
            return axios({
                url: `https://api.myptv.com/geocoding/v1/locations/by-text?searchText=${address}`,
                method: 'GET',
                headers: {
                    'ApiKey': 'YjBkOTI3MmU4NmNmNDE4MjhkZDNjMDcyZTAwZjA0YzA6OTJhMmNmZTItNzg5Ni00YzI5LTkwZGQtYTAxNjJlNTliOTI5'
                }
            })
        },
        // Session Actions
        updateCurrentUser({ commit }) {
            if (localStorage.getItem('currentUser')) {
                const user = JSON.parse(localStorage.getItem('currentUser'))
                axios({
                        url: `users/${user._id}`,
                        method: 'GET'
                    })
                    .then(
                        (response) => {
                            localStorage.setItem('currentUser', JSON.stringify(response.data.data))
                            commit('currentUser', JSON.parse(localStorage.getItem('currentUser')))
                        }
                    )
                    .catch(
                        (error) => {
                            if (error) {
                                localStorage.removeItem('userId')
                                localStorage.removeItem('currentUser')
                                localStorage.removeItem('token')
                            }
                        }
                    )
            }
        },
        updateSessionUser({ commit }, user) {
            commit('currentUser', user)
        }
    },
    modules,
    getters
})