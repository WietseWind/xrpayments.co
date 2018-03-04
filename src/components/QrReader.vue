<template>
  <div class="main">

    <div id="qrreader" class="modal fade show" tabindex="-1" role="dialog" style="display: block; background-color: rgba(0,0,0,.3);">
      <div class="modal-dialog" role="document">
        <div class="modal-content" :class="{ error: errorMsg }">
          <div class="modal-header">
            <h5 class="modal-title">
              QR Reader
            </h5>
            <button type="button" class="close" @click="close" aria-label="Close">
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div class="modal-body">

            <div v-if="errorMsg">

              <div class="alert alert-warning text-center">
                <i class="fa fa-exclamation-triangle"></i>
                {{ errorMsg }}
              </div>

            </div>
            <div v-if="!errorMsg">

              <!-- VueJS: Embed the component contents -->
              <slot></slot>

              <div v-show="!qrInitDone" class="text-center">
                <h1 class="text-muted"><i class="fa fa-circle-o-notch fa-spin"></i></h1>
              </div>
              <div class="qr-code-container" v-show="qrInitDone">
                <div class="qr-code-padding">
                  <qrcode-reader @decode="onQrDecode" @init="onQrInit">
                    <div class="crosshair"></div>
                  </qrcode-reader>
                </div>
              </div>

            </div>

          </div>
          <div class="modal-footer">
            <button v-if="!errorMsg" type="button" class="btn btn-outline-danger" @click="close"><i class="fa fa-times"></i> Cancel</button>
            <button v-if="errorMsg" type="button" class="btn btn-outline-secondary" @click="close"><i class="fa fa-times"></i> Close</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { QrcodeReader } from 'vue-qrcode-reader'

export default {
  name: 'QrReader',
  props: {
    close: Function,
    scan: Function,
    disable: Function
  },
  components: {
    QrcodeReader
  },
  data () {
    return {
      qrInitDone: false,
      qrUnavailable: false,
      errorMsg: ''
    }
  },
  methods: {
    onQrDecode: function (e) {
      this.scan(e)
    },
    async onQrInit (promise) {
      try {
        await promise
        // successfully initialized
      } catch (error) {
        if (error.name === 'NotAllowedError') {
          this.errorMsg = 'User denied camera access permisson'
        } else if (error.name === 'NotFoundError') {
          this.errorMsg = 'No suitable camera device installed'
        } else if (error.name === 'NotSupportedError') {
          this.errorMsg = 'Page is not served over HTTPS (or localhost)'
        } else if (error.name === 'NotReadableError') {
          this.errorMsg = 'Maybe camera is already in use'
        } else if (error.name === 'OverconstrainedError') {
          this.errorMsg = 'Passed constraints don\'t match any camera. Did you requested the front camera although there is none?'
        } else {
          this.errorMsg = 'Browser is probably lacking features (WebRTC, Canvas)'
        }
      } finally {
        // hide loading indicator
        this.qrInitDone = true
      }
    }
  },
  watch: {
    errorMsg: function (v) {
      this.disable()
    }
  },
  computed: {
  },
  mounted: function () {
  }
}
</script>

<style lang="scss" scoped>
  div.modal {
    overflow: auto;

    .modal-content {
      &.error {
        .modal-body {
          .alert {
            margin-bottom: 0px;
          }
        }
        .modal-footer {
          border-top: none;
          padding-top: 0px;
        }
      }
    }
  }
  div.qr-code-container {
    border: 2px solid #ccc;
    overflow: hidden;
    height: 80vmin;
    max-width: 500px;
    max-height: 500px;
    margin: 0 auto 0 auto;

    div.qr-code-padding {
      border: 2px solid white;
      width: 100%;
      height: 100%;
      overflow: hidden;

      div.crosshair {
        border: 2px solid white;
        width: 50vmin;
        height: 50vmin;
        max-width: 50vmin;
        max-height: 50vmin;
        border-radius: 7px;
        position: absolute;
        transform: translate(-50%, -50%);
        left: 50%;
        top: 50%;
      }
    }
  }
</style>

<style lang="scss">
  .qrcode-reader {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  video.qrcode-reader__camera {
    width: 200%;
    height: 200%;
    max-width: 200%;
    max-height: 200%;
    position: absolute;
    transform: translate(-50%, -50%);
    left: 50%;
    top: 50%;
  }
</style>
