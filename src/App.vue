<template>
  <div id="app">
    <main role="main">
      <div class="d-flex justify-content-between flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom box-shadow">
        <router-link tag="h6" class="my-0 p-6 mr-md-auto font-weight-normal logo" to="/">
          <span class="logo">x</span> XRP Payment
        </router-link>
        <nav class="my-2 my-md-0 mr-md-3">
          <router-link v-if="!awaitingPayment" to="/about" class="p-2 routerlink btn" active-class="btn btn-outline-primary"><i class="fa fa-info-circle"></i> About</router-link>
          <button :disabled="awaitingPayment" v-if="awaitingPayment" to="/about" class="p-2 btn btn-outline-secondary noborder"><i class="fa fa-info-circle"></i> About</button>
        </nav>
        <nav class="my-2 my-md-0 mr-md-3">
          <router-link v-if="!awaitingPayment" to="/settings" class="p-2 routerlink btn" active-class="btn btn-outline-primary"><i class="fa fa-cog"></i> Settings</router-link>
          <button :disabled="awaitingPayment" v-if="awaitingPayment" to="/settings" class="p-2 btn btn-outline-secondary noborder"><i class="fa fa-cog"></i> Settings</button>
        </nav>
      </div>
      <div class="container">
        <router-view/>
      </div>
    </main>

    <footer class="footer">
      <div class="container text-center">
        <small>
          <span class="text-muted">By <a href="https://twitter.com/WietseWind" target="_blank">@WietseWind</a></span>
          -
          <router-link to="/donate"><b>Donate</b></router-link>
          -
          <a href="https://github.com/WietseWind/xrpayments.co" target="_blank"><i class="fa fa-github"></i> Source</a>
        </small>
        <br />
        <small>
          <span class="text-muted">XRP Payments on your website? <a href="https://zapster.io/" target="_blank" class="text-muted">zapster.io</a></span>
        </small>
      </div>
    </footer>
  </div>
</template>

<script>
import ConnectionPool from 'ripple-lib-connection-pool'
import localforage from 'localforage'
localforage.config({ name: 'xrprequest' })

let Pool

if (typeof window.rippleConnectionPool === 'undefined') {
  Pool = new ConnectionPool([ 'wss://fh.xrpl.ws', 'wss://s1.ripple.com' ])
  window.rippleConnectionPool = Pool
} else {
  Pool = window.rippleConnectionPool
}

// import Vue from 'vue'
// import swal from 'sweetalert'

export default {
  name: 'App',
  data () {
    return {
      awaitingPayment: false
    }
  },
  mounted () {
  }
}
</script>

<style lang="scss">

@font-face {
  font-family: 'r1ppled';
  src:  url('/static/xrp-font/r1ppled.eot');
  src:  url('/static/xrp-font/r1ppled.eot#iefix') format('embedded-opentype'),
    url('/static/xrp-font/r1ppled.ttf') format('truetype'),
    url('/static/xrp-font/r1ppled.woff') format('woff'),
    url('/static/xrp-font/r1ppled.svg#r1ppled') format('svg');
  font-weight: normal;
  font-style: normal;
}

html {
  font-size: 14px;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
html {
  position: relative;
  min-height: 100%;
}
body {
  margin-bottom: 60px; /* Margin bottom by footer height */
}
@media (min-width: 768px) {
  html {
    font-size: 16px;
  }
}

.container {
  max-width: 960px;
}

.pricing-header {
  max-width: 700px;
}

.card-deck .card {
  min-width: 220px;
}

.border-top { border-top: 1px solid #e5e5e5; }
.border-bottom { border-bottom: 1px solid #e5e5e5; }

.box-shadow { box-shadow: 0 .25rem .75rem rgba(0, 0, 0, .05); }

.routerlink {
  &:not(.btn) {
    color: #343a40!important;
  }
}

.footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 60px; /* Set the fixed height of the footer here */
  overflow: hidden;
  padding-top: 14px;
  line-height: 15px; /* Vertically center the text there */
  background-color: #f5f5f5;
}

.noborder {
  border-color: transparent !important;
  opacity: .5 !important;
}

.logo {
  // background-image: url('assets/logo.png');
  background-repeat: no-repeat;
  background-position: top left;
  background-size: contain;
  padding: 10px;
  padding-left: 43px;
  cursor: pointer;
  span {
    font-family: 'r1ppled';
    font-size: 5.5rem;
    display: block;
    position: absolute;
    left: -25px;
    line-height: 0rem;
    margin-top: -0.7rem;
  }
  &:hover {
    text-decoration: none;
    color: #2079F9;
    span {
      text-decoration: none;
      color: #2079F9;
    }
  }
}
</style>
