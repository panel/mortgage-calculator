<template>
  <fieldset class="form-group">
      <legend>Assets</legend>
      <div class="form-group">
        <label for="savings">Savings</label>
        <input type="number" step="1000" :value="savings" @change="change" id="savings" class="form-control">
      </div>
      <div class="form-group">
        <label for="illiquidAssets">Other Assets</label>
        <input type="number" step="1000" :value="illiquidAssets" @change="change" id="illiquidAssets" class="form-control">
      </div>
      <div class="form-group">
        <label for="primaryDownPayment">Primary Down Payment</label>
        <input type="number" step="500" :value="primaryDownPayment" @change="change" id="primaryDownPayment" class="form-control">
      </div>
      <div class="form-group">
        <label for="giftDownPayment">Gift Down Payment</label>
        <input type="number" step="500" :value="giftDownPayment" @change="change" id="giftDownPayment" class="form-control">
      </div>
  </fieldset>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data: function () {
    return {}
  },
  computed: mapState([
    'savings',
    'illiquidAssets',
    'primaryDownPayment',
    'giftDownPayment'
  ]),
  methods: {
    change (event) {
      this.$store.commit('update', {
        field: event.target.id,
        value: event.target.value,
        type: event.target.type
      })
    }
  }
}
</script>

<style scoped>
</style>
