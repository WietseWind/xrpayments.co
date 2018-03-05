<template>
  <div class="hello">
    <h2 class="">Wallets</h2>
    <!-- <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6> -->
    <!-- <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p> -->
    <!-- <a href="#" class="card-link">Card link</a> -->
    <!-- <a href="#" class="card-link">Another link</a> -->
    <div class="text-center alert alert-danger" v-if="!wallets || wallets.length < 1">
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
    <h2 class="">Destination Tag</h2>
    <p>Auto-increment a destination tag for each payment, so you can note the generated destination tag on a receipt / bill.</p>
    <div class="input-group mb-3">
      <div class="input-group-prepend">
        <button @click="dtag.use = false" class="btn" :class="{ 'btn-primary': !dtag.use, 'btn-outline-primary' : dtag.use }">Disable</button>
        <button @click="dtag.use = true" class="btn" :class="{ 'btn-primary': dtag.use, 'btn-outline-primary' : !dtag.use }">Enable</button>
      </div>
      <input :disabled="!dtag.use" type="number" min="0" max="2147483646" step="1" class="text-right form-control form-control-sm" placeholder="The next destination tag (integers)" v-model="dtag.next">
    </div>

    <br />
    <br />
    <router-link to="/" class="btn btn-block btn-outline-primary"><i class="fa fa-home"></i> Home</router-link>
    <br />&nbsp;
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
        { index: 'GBP', uri: 'https://data.ripple.com/v2/exchange_rates/EUR+rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq/xrp#https://cors-anywhere.herokuapp.com/https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml#GBP', title: 'Great British Pound' },
        { index: 'SEK', uri: 'https://data.ripple.com/v2/exchange_rates/EUR+rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq/xrp#https://cors-anywhere.herokuapp.com/https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml#SEK', title: 'Swedish Krona' },
        { index: 'RUB', uri: 'https://data.ripple.com/v2/exchange_rates/EUR+rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq/xrp#https://cors-anywhere.herokuapp.com/https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml#RUB', title: 'Russian Ruble' },
        { index: 'NOK', uri: 'https://data.ripple.com/v2/exchange_rates/EUR+rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq/xrp#https://cors-anywhere.herokuapp.com/https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml#NOK', title: 'Norwegian Krone' },
        { index: 'BRL', uri: 'https://data.ripple.com/v2/exchange_rates/EUR+rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq/xrp#https://cors-anywhere.herokuapp.com/https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml#BRL', title: 'Brazilian Real' },
        { index: 'CAD', uri: 'https://data.ripple.com/v2/exchange_rates/EUR+rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq/xrp#https://cors-anywhere.herokuapp.com/https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml#CAD', title: 'Canadian Dollar' },
        { index: 'IDR', uri: 'https://data.ripple.com/v2/exchange_rates/EUR+rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq/xrp#https://cors-anywhere.herokuapp.com/https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml#IDR', title: 'Indonesian Rupiah' },
        { index: 'KRW', uri: 'https://data.ripple.com/v2/exchange_rates/EUR+rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq/xrp#https://cors-anywhere.herokuapp.com/https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml#KRW', title: 'South Korean Won' },
        { index: 'NZD', uri: 'https://data.ripple.com/v2/exchange_rates/EUR+rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq/xrp#https://cors-anywhere.herokuapp.com/https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml#NZD', title: 'New Zealand Dollar' },
        { index: 'ZAR', uri: 'https://data.ripple.com/v2/exchange_rates/EUR+rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq/xrp#https://cors-anywhere.herokuapp.com/https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml#ZAR', title: 'South African Rand' },
        { index: 'CHF', uri: 'https://data.ripple.com/v2/exchange_rates/EUR+rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq/xrp#https://cors-anywhere.herokuapp.com/https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml#CHF', title: 'Swiss Franc' },
        { index: 'CNY', uri: 'https://data.ripple.com/v2/exchange_rates/CNY+razqQKzJRdB4UxFPWf5NEpEG3WMkmwgcXA/xrp', title: 'Chinese Yuan Renminbi' },
        { index: 'JPY', uri: 'https://data.ripple.com/v2/exchange_rates/JPY+rB3gZey7VWHYRqJHLoHDEJXJ2pEPNieKiS/xrp', title: 'Japan Yen' }
      ],
      wallets: null,
      exchange: '',
      dtag: {
        use: false,
        next: 10000
      }
    }
  },
  watch: {
    exchange (e) {
      this.$setItem('exchangerate', this.exchangePairs.filter((s) => {
        return s.index === e
      })[0].uri)
    },
    'dtag.use' () {
      this.$setItem('dtag', this.dtag)
    },
    'dtag.next' () {
      this.$setItem('dtag', this.dtag)
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
    this.$getItem('dtag').then((r) => {
      if (r !== null) {
        this.dtag.use = r.use
        this.dtag.next = r.next
      }
    })
  }
}
</script>

<style lang="scss" scoped>
</style>
