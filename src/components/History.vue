<template>
  <table class="table table-striped">
      <thead>
          <tr>
              <th>Name</th>
              <th>Sale Price</th>
              <th>Monthly Payment</th>
              <th>Created By</th>
              <th></th>
          </tr>
       </thead>
       <tbody class="table-striped">
            <tr v-for="(item, key) in historyArray" :key="key">
                <td v-if="item.listingLink"><a :href="item.listingLink" target="_blank">{{ item.scenarioName }}</a></td>
                <td v-else>{{ item.scenarioName }}</td>
                <td>{{ item.salePrice | currency }}</td>
                <td>{{ item.monthlyPayment | currency }}</td>
                <td>{{ item.displayName }}</td>
                <td>
                    <div class="btn-group">
                        <button class="btn btn-outline-success btn-sm" :id="item.scenarioName" @click="load">Load</button>
                        <button class="btn btn-outline-danger btn-sm" :id="item.scenarioName" @click="remove">Delete</button>
                    </div>
                </td>
            </tr>
        </tbody>
  </table>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    historyArray () {
      return Object.values(this.history)
    },
    ...mapState([
      'history'
    ])
  },
  methods: {
    load (event) {
      this.$store.commit('load', this.history[event.target.id])
    },
    remove (event) {
      this.$store.commit('remove', { scenarioName: event.target.id })
    }
  }
}
</script>

<style>

</style>
