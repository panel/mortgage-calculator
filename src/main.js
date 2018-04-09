// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import { format } from 'currency-formatter'
import firebaseConfig from '../.env.json'
import defaultState from './defaultState.json'
import * as firebase from 'firebase'

import App from './App'
import 'bootstrap/dist/css/bootstrap.min.css'

const K = 10 ** 3
const provider = new firebase.auth.GoogleAuthProvider()

firebase.initializeApp(firebaseConfig)

const scenariosRef = firebase.database().ref('/scenarios')

Vue.config.productionTip = false
Vue.use(Vuex)

Vue.filter('currency', function (value) {
  return format(value, { code: 'USD' })
})

Vue.filter('percentage', function (value) {
  return (!value) ? '' : `${(parseFloat(value, 10) * 100).toFixed(2)}%`
})

function interestMultiplier (interestRate) {
  return Math.pow(1 + (interestRate), 360)
}

function writeScenario ({ data, isNew }) {
  let key = data.key

  if (!key) {
    key = firebase.database().ref().child('posts').push().key
    data.key = key
  }

  firebase.database().ref(`scenarios/${key}`).set(data)

  return key
}

let initialState

try {
  const {user, history, ...persistedState} = JSON.parse(localStorage.getItem('state'))
  initialState = persistedState || defaultState
  initialState.history = []
} catch (e) {
  initialState = defaultState
}

const store = new Vuex.Store({
  state: initialState,
  getters: {
    mortgageAmount (state, getters) {
      return state.salePrice - getters.downPayment
    },
    downPayment (state) {
      return state.primaryDownPayment + state.giftDownPayment
    },
    primaryContribution (state, getters) {
      return state.primaryDownPayment / getters.downPayment
    },
    downPaymentCapitalPercentage (state, getters) {
      return state.primaryDownPayment / (state.savings + state.illiquidAssets)
    },
    downPaymentPercentage (state, getters) {
      return (getters.downPayment > 0)
        ? getters.downPayment / state.salePrice
        : 0
    },
    interestMultiplier (state) {
      Math.pow(1 + (state.interestRate / 12), 360)
    },
    monthlyPayment (state, getters) {
      const c = state.interestRate / 12
      const mult = interestMultiplier(c)

      return getters.monthlyTaxAmount + (getters.mortgageAmount * (c * mult)) /
        (mult - 1)
    },
    monthlyTaxAmount (state) {
      return (state.salePrice * 0.02009) / 12
    },
    closingCosts (state) {
      return 6000 + ((state.salePrice / K) * 7.5)
    },
    dueAtClosing (state, getters) {
      return getters.downPayment + getters.closingCosts
    }
  },
  mutations: {
    update (state, { field, value, type }) {
      state[field] = (type === 'number') ? parseFloat(value, 10) : value
      localStorage.setItem('state', JSON.stringify(state))
    },
    save (state) {
      const { history, user, ...everythingElse } = state
      const isNew = !history[state.scenarioName]
      everythingElse.monthlyPayment = this.getters.monthlyPayment
      everythingElse.key = writeScenario({
        data: everythingElse,
        isNew
      })

      Vue.set(state.history, state.scenarioName, everythingElse)

      localStorage.setItem('state', JSON.stringify(state))
    },
    upsert (state, { data }) {
      Vue.set(state.history, data.scenarioName, data)
      localStorage.setItem('state', JSON.stringify(state))
    },
    load (state, { monthlyPayment, ...everythingElse }) {
      for (let key in everythingElse) {
        Vue.set(state, key, everythingElse[key])
      }
      localStorage.setItem('state', JSON.stringify(state))
    },
    remove (state, { scenarioName, localOnly }) {
      const history = Object.assign({}, state.history)
      const { key } = history[scenarioName]

      if (!localOnly) {
        firebase.database().ref(`scenarios/${key}`).remove()
      }

      delete history[scenarioName]
      Vue.set(state, 'history', history)
      localStorage.setItem('state', JSON.stringify(state))
    },
    login (state, { user }) {
      Vue.set(state, 'user', user)
      Vue.set(state, 'displayName', user.displayName)
    }
  }
})

firebase.auth().signInWithPopup(provider).then(result => {
  // The signed-in user info.
  const user = result.user
  store.commit('login', { user })

  return firebase.database().ref('scenarios').once('value')
}).then(snapshot => {
  const scenarios = Object.values(snapshot.val()) || []
  scenarios.forEach(data => store.commit('upsert', { data }))
}).catch(error => {
  console.log(error)
})

scenariosRef.on('child_added', snapshot => {
  const data = snapshot.val()
  if (data.scenarioName) {
    store.commit('upsert', { data })
  }
})

scenariosRef.on('child_changed', snapshot => {
  const data = snapshot.val()
  if (data.scenarioName) {
    store.commit('upsert', { data })
  }
})

scenariosRef.on('child_moved', snapshot => {
  const data = snapshot.val()
  if (data.scenarioName) {
    store.commit('upsert', { data })
  }
})

scenariosRef.on('child_removed', snapshot => {
  const data = snapshot.val()
  if (data.scenarioName) {
    store.commit('remove', { localOnly: true, scenarioName: data.scenarioName })
  }
})

/* eslint-disable no-new */
new Vue({
  store,
  el: '#app',
  template: '<App/>',
  components: { App }
})
