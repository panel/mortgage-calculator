<template>
  <fieldset>
      <legend>Calculations</legend>
      <h2>{{ monthlyPayment | currency }} <small>monthly payment</small></h2>
      <h2>{{ closingCosts | currency }} <small>closing costs</small></h2>
      <h2>{{ dueAtClosing | currency }} <small>due at closing</small></h2>
      <h2>{{ downPaymentPercentage | percentage }} <small>down payment percentage</small></h2>
      <h2>{{ downPaymentCapitalPercentage | percentage }} <small>asset commitment</small></h2>
      <h2>{{ primaryContribution | percentage }} <small>our down payment</small></h2>

      <div class="form-group">
        <label for="listingLink">Listing Link</label>
        <input type="url" :value="listingLink" @change="change" id="listingLink" class="form-control">
      </div>

      <div class="form-group">
        <label for="scenarioName">Scenario Name</label>
        <div class="input-group">
            <input type="text" :value="scenarioName" @change="change" @keypress.enter="save" id="scenarioName" class="form-control">
            <div class="input-group-append">
                <button 
                    class="btn btn-primary" 
                    type="button" 
                    :disabled="scenarioName.trim().length === 0"
                    @click="save"
                >Save</button>
            </div>
        </div>
      </div>
  </fieldset>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
  data: function () {
    return {}
  },
  computed: {
    ...mapGetters([
      'monthlyPayment',
      'downPaymentPercentage',
      'downPaymentCapitalPercentage',
      'primaryContribution',
      'closingCosts',
      'dueAtClosing'
    ]),
    ...mapState([
      'scenarioName',
      'listingLink'
    ])
  },
  methods: {
    change (event) {
      this.$store.commit('update', {
        field: event.target.id,
        value: event.target.value,
        type: event.target.type
      })
    },
    save () {
      this.$store.commit('save')
    }
  }
}
</script>

<style scoped>

</style>
