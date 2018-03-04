<template>
  <div class="hello">
    <h3 class="text-dark">Add wallet</h3>
    <!-- <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6> -->
    <!-- <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p> -->
    <!-- <a href="#" class="card-link">Card link</a> -->
    <!-- <a href="#" class="card-link">Another link</a> -->
    <label class="text-muted">Address</label>
    <div class="input-group mb-3">
      <input type="text" class="form-control form-control-lg" placeholder="Add a wallet address, rXXXXXX...." v-model="newWallet.account">
      <div class="input-group-append" v-if="!qr.disabled">
        <button @click="qr.scanning=true" class="btn btn-primary" type="button"><i class="fa fa-fw fa-qrcode"></i></button>
      </div>
    </div>
    <label class="text-muted">Description</label>
    <input ref="description" type="text" class="form-control form-control-lg" placeholder="Description, eg. 'My Store Wallet'" v-model="newWallet.title">

    <br />
    <div v-if="validateErr">
      <p class="alert alert-danger text-center">Wallet address invalid or wallet not activated.</p>
    </div>
    <button @click="addWallet" :disabled="!newWalletValid" class="btn btn-lg btn-outline-primary btn-block"><i class="fa fa-save"></i> Add wallet</button>

    <QrReader v-if="qr.scanning" :close="qrClose" :scan="qrScan" :disable="qrDisable">
      <p class="text-muted">
        Scan a QR code with your wallet address (rXXXXX...)
      </p>
    </QrReader>
  </div>
</template>

<script>
import QrReader from './QrReader'
import swal from 'sweetalert'

export default {
  name: 'AddWallet',
  components: {
    QrReader
  },
  computed: {
    newWalletValid () {
      return this.newWallet.title.trim() !== '' && this.newWallet.account.trim().match(/^r[a-zA-Z0-9]{20,}$/) && !this.newWallet.validating
    }
  },
  data () {
    return {
      newWallet: {
        title: '',
        account: '',
        validating: false
      },
      qr: {
        disabled: false,
        scanning: false
      },
      validateErr: false,
      wallets: []
    }
  },
  methods: {
    addWallet () {
      var that = this
      this.validateErr = false
      this.newWallet.validating = true
      if (that.wallets.filter((ew) => {
        return ew.address === that.newWallet.account.trim()
      }).length < 1) {
        window.rippleConnectionPool.getAccountInfo(this.newWallet.account.trim(), function (r) {
          that.newWallet.validating = false
          console.log(r)
          if (!r.success) {
            that.validateErr = true
          } else {
            that.wallets.push({
              address: that.newWallet.account.trim(),
              title: that.newWallet.title.trim()
            })
            swal('Added wallet', 'Wallet "' + that.newWallet.title + '" added', 'success').then(() => {
              that.$setItem('wallets', that.wallets)
              that.$router.replace('/settings')
            })
          }
        })
      } else {
        swal('Oops', 'This wallet is already configured', 'error')
      }
    },
    qrDisable: function () { this.qr.disabled = true },
    qrClose: function () { this.qr.scanning = false },
    qrScan: function (e) {
      var address = e.match(/(r[a-zA-Z0-9]{20,})/)
      if (address) {
        this.newWallet.account = address[1]
        this.$refs.description.focus()
      } else {
        swal('Oops', 'Invalid wallet address', 'error')
      }
      this.qr.scanning = false
    }
  },
  mounted () {
    this.$getItem('wallets').then((r) => {
      if (r !== null) {
        r.forEach((w) => {
          this.wallets.push(w)
        })
      }
    })
  }
}
</script>

<style lang="scss" scoped>
</style>
