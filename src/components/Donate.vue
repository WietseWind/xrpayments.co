<template>
  <div class="hello">
    <h2 class="">Donate</h2>
    <p>
      Hi, thank you for clicking the Donate-link!
    </p>
    <p>
      I made this tool in my spare time with the intention to support
      the XRP community. I believe XRP has a bright future ahead, especially
      if both Ripple and the community pursue all the possibilities XRP offers.
    </p>
    <p>
      If you love this tool and want to send me some love, this is me at Twitter.
      If you want to send me a beer 🍻 - this is my XRP account:
    </p>
    <div class="text-center">
      <QrCode :value="'rPdvC6ccq8hCdPKSPJkPmyZ4Mi1oG2FFkT'" :options="{ size: 150 }"></QrCode><br />
      <code>rPdvC6ccq8hCdPKSPJkPmyZ4Mi1oG2FFkT</code>
    </div>
    <br />
    <div class="text-center">
      <router-link to="/" class="btn btn-block btn-outline-primary"><i class="fa fa-home"></i> Home</router-link>
    </div>
    <br />
    &nbsp;
  </div>
</template>

<script>
import QrCode from '@xkeshi/vue-qrcode'

export default {
  name: 'Donate',
  components: {
    QrCode
  },
  data () {
    return {
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
