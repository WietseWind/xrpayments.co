<template>
  <div class="hello">
    <div v-if="!waitForPayment">
      <h2 class="text-center">Create payment QR</h2>

      <div v-if="wallets && wallets.length > 0">
        <div v-if="wallets.length > 1">
          <br />
          <h5 class="text-center text-muted text-secondary">Select wallet</h5>
          <ul class="list-group list-group-condensed">
            <li @click="activeWallet = w.address" class="list-group-item text-center click" :class="{ 'selected text-primary': w.address === activeWallet, 'text-muted': w.address !== activeWallet }" v-for="w in wallets" v-bind:key="w.address">
              <i class="fa fa-check" v-if="w.address === activeWallet"></i>
              {{ w.title }}
            </li>
          </ul>
        </div>
        <br />
        <h5 class="text-center text-muted text-secondary">Payment amount</h5>
        <div class="alert alert-warning text-center" v-if="useCurrency === currency && rate === 0">
          Waiting for exchange rate...
        </div>
        <div class="input-group mb-3" v-if="useCurrency !== currency || rate > 0 || useCurrency === 'XRP'">
          <input type="text" class="form-control form-control-lg text-center font-bold" :placeholder="'Amount ' + (useCurrency === currency ? currency : 'XRP')" v-model="amount">
          <div class="input-group-append">
            <button :disabled="currency === ''" class="btn" @click="useCurrency = 'XRP'" :class="{ 'btn-primary': useCurrency !== currency && currency !== '', 'btn-outline-primary': useCurrency === currency || currency === '' }" type="button">
              <span v-if="useCurrency !== currency">
                <i class="fa fa-check" v-if="currency !== ''"></i> <b>XRP</b>
              </span>
              <span v-if="useCurrency === currency">
                XRP
              </span>
            </button>
            <button  v-if="currency && rate > 0" class="btn" @click="useCurrency = currency" :class="{ 'btn-primary': useCurrency === currency, 'btn-outline-primary': useCurrency !== currency }" type="button">
              <span v-if="useCurrency === currency">
                <i class="fa fa-check"></i> <b>{{ currency }}</b>
              </span>
              <span v-if="useCurrency !== currency">
                {{ currency }}
              </span>
            </button>
          </div>
        </div>
        <div class="convert alert alert-warning text-dark text-center" v-if="convertedAmount.xrp && convertedAmount.xrp > 0 && rate > 0">
          <h4 v-if="useCurrency === currency && convertedAmount.currency > 0" class="text-center">
            <small class="text-muted">
              {{ convertedAmount.currency.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }} {{ useCurrency }}
              =
            </small>
            <b>{{ convertedAmount.xrp.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 6 }) }} XRP</b>
          </h4>
          <h4 v-if="useCurrency !== currency" class="text-center">
            <b>{{ convertedAmount.xrp.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 6 }) }} XRP</b>
            <small class="text-muted">
              =
              {{ convertedAmount.currency.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }} {{ currency }}
            </small>
          </h4>
        </div>
        <button @click="waitForPayment=true" class="btn btn-block btn-success btn-lg" v-if="convertedAmount.xrp && convertedAmount.xrp > 0">
          <b>Generate QR</b>
          <i class="fa fa-arrow-right"></i>
        </button>
      </div>
    </div>

    <div v-if="waitForPayment">
      <h2 class="text-center">Pay <code class="text-primary" v-if="convertedAmount.currency && convertedAmount.currency > 0">{{ convertedAmount.currency.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }} {{ currency }}</code> in XRP</h2>

      <div class="text-center card">
        <div class="card-body">
          <QrCode :value="'https://ripple.com//send?to=' +  activeWallet+ '&amount=' + convertedAmount.xrp" :options="{ size: 225 }"></QrCode>
          <br />
          <code class="text-muted">{{ activeWallet }}</code>
        </div>
        <div class="card-footer">
          <b>Scan this code to pay: <code class="text-primary">{{ convertedAmount.xrp }} XRP</code></b>
        </div>
      </div>
      <div class="text-center text-muted">
        <br />
        <br />
        <h3><i class="fa fa-circle-o-notch fa-spin"></i> Awaiting payment...</h3>
        <br />
        <button @click="waitForPayment=false" class="btn btn-outline-danger btn-sm">
          <i class="fa fa-times"></i> Cancel
        </button>
      </div>
    </div>

    <div v-if="!wallets || wallets.length < 1">
      <br />
      <div class="alert alert-warning text-dark text-center">
        <b><i class="fa fa-exclamation-triangle"></i> No wallet(s) configured!</b>
      </div>
      <router-link to="/settings" class="btn btn-md btn-block btn-primary"><i class="fa fa-cog"></i> Settings</router-link>
    </div>

    <br />
    &nbsp;
  </div>
</template>

<script>
import QrCode from '@xkeshi/vue-qrcode'
import swal from 'sweetalert'

export default {
  name: 'Home',
  components: {
    QrCode
  },
  data () {
    return {
      wallets: [],
      exchange: '',
      activeWallet: '',
      amount: null,
      useCurrency: 'XRP',
      rate: 0,
      waitForPayment: false
    }
  },
  computed: {
    currency () {
      if (this.exchange && this.exchange !== null) {
        var cMatch = this.exchange.match(/([A-Z]{3})\+/)
        if (cMatch) return cMatch[1]
      }
      return ''
    },
    convertedAmount () {
      var amount = (this.amount || 0) + ''
      if (amount.match(/,/) && !amount.match(/\./)) {
        amount = amount.replace(/,/, '.')
      }
      if (amount.match(/[0-9]+,[0-9]+\.[0-9]+/)) {
        amount = amount.replace(/,/, '')
      }
      if (amount.match(/[0-9]+\.[0-9]+,[0-9]+/)) {
        amount = amount.replace(/\./, '').replace(/,/, '.')
      }
      amount = parseFloat(amount)

      var converted = {
        xrp: 0,
        currency: 0
      }

      // console.log(this.currency)
      // console.log(this.useCurrency)
      if (this.currency === this.useCurrency) {
        converted.currency = parseFloat(amount.toFixed(2))
        if (this.rate > 0) {
          converted.xrp = parseFloat((converted.currency * this.rate).toFixed(6))
        }
      } else {
        converted.xrp = parseFloat(amount.toFixed(6))
        if (this.rate > 0) {
          converted.currency = parseFloat((converted.xrp / this.rate).toFixed(2))
        }
      }
      return converted
    }
  },
  watch: {
    waitForPayment (a) {
      this.$parent.awaitingPayment = a
    },
    activeWallet (a) {
      this.$setItem('activewallet', a)
    },
    useCurrency (c) {
      this.$setItem('usecurrency', c)
    }
  },
  methods: {
    fetchExchangeRate () {
      if (this.exchange && this.exchange !== null && this.exchange !== '') {
        fetch(this.exchange).then((r) => {
          return r.json()
        }).then((r) => {
          var newRate = parseFloat(r.rate)
          if (this.rate !== newRate) {
            console.log('Update rate, old / new', this.rate, newRate)
            this.rate = newRate
          }
        }).catch(console.error)
      }
    }
  },
  mounted () {
    var that = this

    window.rippleConnectionPool.on('tx', function (tx) {
      if (tx.message.transaction.TransactionType === 'Payment' && tx.message.validated && tx.message.engine_result === 'tesSUCCESS') {
        var amount = parseFloat(tx.message.transaction.Amount) / 1000 / 1000
        if (that.waitForPayment) {
          if (tx.message.transaction.Destination === that.activeWallet) {
            var msgDiv = document.createElement('div')
            msgDiv.className = 'text-center'
            if (that.convertedAmount.xrp === amount) {
              msgDiv.innerHTML = '<b>' + amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 6 }) + ' XRP</b> received from <code class="text-primary">' + tx.message.transaction.Account + '</code>'
              swal({ title: 'Received payment', icon: 'success', content: msgDiv }).then(() => {
                that.waitForPayment = false
                that.amount = null
              })
            } else {
              msgDiv.innerHTML = '<b>' + amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 6 }) + ' XRP</b> received (<b class="text-danger">' + that.convertedAmount.xrp.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 6 }) + ' XRP requested</b>) from <code class="text-primary">' + tx.message.transaction.Account + '</code>'
              swal({ title: 'Warning!', icon: 'error', content: msgDiv }).then(() => {
                that.waitForPayment = false
                that.amount = null
              })
            }
          }
        }
      }
    })

    this.$getItem('wallets').then((r) => {
      this.wallets = r
      if (this.wallets && this.wallets.length > 0) {
        this.wallets.forEach((w) => {
          window.rippleConnectionPool.addWallet(w.address)
        })
      }
      this.$getItem('activewallet').then((r) => {
        if (r && that.wallets && that.wallets.length > 0 && that.wallets.filter((a) => {
          return a.address === r
        }).length > 0) {
          that.activeWallet = r
        } else {
          if (that.wallets && that.wallets.length > 0) {
            that.activeWallet = that.wallets[0].address
          }
        }
      })
    })
    this.$getItem('exchangerate').then((r) => {
      this.exchange = r
      that.fetchExchangeRate()
      setInterval(that.fetchExchangeRate, 5000)
      this.$getItem('usecurrency').then((r) => {
        if (r === this.currency) {
          this.useCurrency = r
        }
      })
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  ul.list-group-condensed {
    li {
      padding: 5px 10px;
      font-size: 1.4em;
      &.selected {
        font-weight: 600;
      }
    }
  }
  div.convert {
    h4 {
      padding-bottom: 0;
      margin-bottom: 0;
      small {
        display: inline-block;
        position: relative;
        top: -1px;
        padding-top: 0;
      }
    }
  }
  .click {
    cursor: pointer;
  }
  .font-bold {
    font-weight: bold;
  }
</style>
