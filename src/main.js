// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import { format } from 'currency-formatter'
import App from './App'
import 'bootstrap/dist/css/bootstrap.min.css'

const K = 10 ** 3

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

const persistedState = JSON.parse(localStorage.getItem('state'))
const initialState = persistedState || {
  primaryDownPayment: 30 * K,
  giftDownPayment: 15 * K,
  savings: 65 * K,
  illiquidAssets: 35 * K,
  salePrice: 645 * K,
  interestRate: 0.0425,
  scenarioName: '',
  listingLink: '',
  history: {}
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
      const { history, ...everythingElse } = state
      everythingElse.monthlyPayment = this.getters.monthlyPayment
      Vue.set(state.history, state.scenarioName, everythingElse)
      localStorage.setItem('state', JSON.stringify(state))
    },
    load (state, { monthlyPayment, ...everythingElse }) {
      for (let key in everythingElse) {
        Vue.set(state, key, everythingElse[key])
      }
      localStorage.setItem('state', JSON.stringify(state))
    },
    remove (state, scenarioName) {
      const history = Object.assign({}, state.history)
      delete history[scenarioName]
      Vue.set(state, 'history', history)
      localStorage.setItem('state', JSON.stringify(state))
    }
  }
})

/* eslint-disable no-new */
new Vue({
  store,
  el: '#app',
  template: '<App/>',
  components: { App }
})
