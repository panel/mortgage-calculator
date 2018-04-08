<template>
  <fieldset class="form-group">
      <legend>Cost</legend>
      <div class="form-group">
        <label for="salePrice">Home Price</label>
        <input type="number" step="5000" :value="salePrice" id="salePrice" @change="change" class="form-control">
      </div>
      <div class="form-group">
        <label for="interestRate">Interest Rate</label>
        <input type="number" step="0.0005" :value="interestRate" @change="change" id="interestRate" class="form-control">
      </div>
      <div class="form-group">
        <label for="mortgageAmount">Mortgage Amount</label>
        <input type="number" readonly :value="mortgageAmount" id="mortgageAmount" class="form-control">
      </div>
      <div class="form-group">
        <label for="monthlyTaxAmount">Monthy Tax Amount</label>
        <input type="number" readonly :value="monthlyTaxAmount" id="monthlyTaxAmount" class="form-control">
      </div>
  </fieldset>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  data: function () {
    return {}
  },
  computed: {
    ...mapState([
      'salePrice',
      'interestRate'
    ]),
    ...mapGetters([
      'monthlyTaxAmount',
      'mortgageAmount'
    ])
  },
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
