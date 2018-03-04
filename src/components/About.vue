<template>
  <div class="hello">
    <h2 class="">About</h2>
    <p>
      This tool allows you to create a <i>Ripple Payment URI</i> in a QR code.
      Most of the XRP wallets, like Toast and Kyteapp.co allow you to scan this
      QR code.
    </p>
    <p>
      <b>The XRP is going directly from the wallet of the customer to your wallet 😃</b>
    </p>
    <p>
      When you scan the generated QR code with XRP Wallet app, the destination wallet
      and amount are automatically filled in.
    </p>
    <div class="text-center">
      <router-link to="/" class="btn btn-block btn-outline-primary"><i class="fa fa-home"></i> Home</router-link>
    </div>
    <br />
    &nbsp;
  </div>
</template>

<script>
export default {
  name: 'About',
  data () {
    return {
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
