<template>
  <div class="hello">
    <router-link to="/about" class="btn btn-sm btn-block btn-outline-secondary"><i class="fa fa-info"></i> Learn more about this tool</router-link>
    <br />
    <h2 class="">Wallets</h2>
    <!-- <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6> -->
    <!-- <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p> -->
    <!-- <a href="#" class="card-link">Card link</a> -->
    <!-- <a href="#" class="card-link">Another link</a> -->
    <div class="text-center alert alert-danger" v-if="wallets && wallets.length < 1">
      No wallets configured
    </div>
    <div v-if="wallets && wallets.length > 0">
      <ul class="list-group">
        <li class="list-group-item" v-for="w in wallets" v-bind:key="w.address">
          <button @click="removeWallet(w.address)" class="btn btn-sm float-right btn-outline-danger"><i class="fa fa-times"></i></button>
          <h5>{{ w.title }}</h5>
          <code class="text-primary">{{ w.address }}</code>
        </li>
      </ul>
      <br />
    </div>
    <router-link to="/settings/add-wallet" class="btn btn-md btn-block btn-outline-primary"><i class="fa fa-plus"></i> Add wallet</router-link>

    <br />
    <h2 class="">Currency</h2>
    <select v-model="exchange" class="form-control">
      <option value="" selected disabled>Select a currency pair</option>
      <option v-bind:value="e.index" v-for="e in exchangePairs" v-bind:key="e.index">{{ e.index }} ({{ e.title }})</option>
    </select>

    <br />
    <hr />
    <router-link to="/" class="btn btn-lg btn-block btn-primary"><i class="fa fa-home"></i> Home</router-link>
  </div>
</template>

<script>
export default {
  name: 'Settings',
  data () {
    return {
      exchangePairs: [
        { index: 'EUR', uri: 'https://data.ripple.com/v2/exchange_rates/EUR+rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq/xrp', title: 'European Euro' },
        { index: 'USD', uri: 'https://data.ripple.com/v2/exchange_rates/USD+rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B/xrp', title: 'United States Dollar' },
        { index: 'CNY', uri: 'https://data.ripple.com/v2/exchange_rates/CNY+razqQKzJRdB4UxFPWf5NEpEG3WMkmwgcXA/xrp', title: 'Chinese Yuan Renminbi' },
        { index: 'JPY', uri: 'https://data.ripple.com/v2/exchange_rates/JPY+rB3gZey7VWHYRqJHLoHDEJXJ2pEPNieKiS/xrp', title: 'Japan Yen' }
      ],
      wallets: null,
      exchange: ''
    }
  },
  watch: {
    exchange (e) {
      this.$setItem('exchangerate', this.exchangePairs.filter((s) => {
        return s.index === e
      })[0].uri)
    }
  },
  methods: {
    removeWallet (w) {
      let index = this.wallets.filter((r) => {
        return r.address === w
      })
      if (index.length > 0) {
        this.wallets.splice(this.wallets.indexOf(index[0]), 1)
        this.$setItem('wallets', this.wallets)
      }
    }
  },
  mounted () {
    this.$getItem('wallets').then((r) => {
      this.wallets = r
    })
    this.$getItem('exchangerate').then((r) => {
      if (r !== null) {
        this.exchange = this.exchangePairs.filter((s) => {
          return s.uri === r
        })[0].index
      }
    })
  }
}
</script>

<style lang="scss" scoped>
</style>
