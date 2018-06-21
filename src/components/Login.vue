<template>
  <dialog class="mdl-dialog">
      <div class="mdl-dialog__content" v-mdl>
          <h4>Login to Pulse</h4>

          <form>
              <div class="mdl-textfield mdl-js-textfield">
                  <input class="mdl-textfield__input" type="email" id="username" v-model="username" autofocus/>
                  <label class="mdl-textfield__label" for="username">Email Address</label>
              </div>
              <div class="mdl-textfield mdl-js-textfield">
                  <input class="mdl-textfield__input" type="password" id="password" v-model="password" @keyup.enter="doLogin"/>
                  <label class="mdl-textfield__label" for="password">Password</label>
              </div>
          </form>

          <p v-if="error" class="error">Email or Password incorrect</p>

          <p>Don't have a login? <a href="https://messenger.klinkerapps.com/overview/signup.html" target="_blank">Sign up</a> for an account from the phone app, first.</p>

          <a href="https://messenger.klinkerapps.com/forgot_password.html" target="_blank">Forgot your password?</a>
          <br>
          <a href="https://messenger.klinkerapps.com/overview/platform-ios.html" target="_blank">Have an <i>iPhone</i>?</a>

      </div>
      <div class="mdl-dialog__actions">
          <button class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" id="login" @click="doLogin">Log in</button>
      </div>
  </dialog>
</template>

<script>

import '@/lib/sjcl.js'
import '@/lib/hmacsha1.js'
import Vue from 'vue'
import { Crypto, Url, Api } from '@/utils/'
import Spinner from '@/components/Spinner.vue'
import dialogPolyfill from 'dialog-polyfill'


export default {
    name: 'login',

    mounted () {
        if (this.$store.state.account_id != '')
            return this.$router.push({ name: 'conversations-list'});

        this.$store.commit("loading", false);
        this.$store.commit('title', this.title);

        let login = document.querySelector(".mdl-dialog");
        if (!login.showModal) {
            dialogPolyfill.registerDialog(this.login);
        }

        login.showModal();

    },

    data () {
        return {
            title: "",
            username: '',
            password: '',
            loading: false,
            error: false,
        }
    },

    methods: {
        doLogin() {

            if (this.username == '' || this.password == '')
                return;

            this.error = false;
            this.loading = true;

            Api.login(this.username, this.password)
                .then((data) => this.handleData(data.data))
                .catch((data) => this.handleError(data));
        },

        handleData (data) {
            this.error = false;

            // Create hash
            let derived_key = sjcl.misc.pbkdf2(this.password, data.salt2, 10000, 256, hmacSHA1);
            let base64_hash = sjcl.codec.base64.fromBits(derived_key);
            // Save data
            this.$store.commit('account_id', data.account_id);
            this.$store.commit('hash', base64_hash);
            this.$store.commit('salt', data.salt1);

            Crypto.setupAes(); // Setup aes for session

            this.loading = false;

            // Start app
            this.$store.state.msgbus.$emit('start-app');

            this.$router.push({ name: 'conversations-list'});

        },

        handleError(data) {
            this.password = "";
            this.error = true;
            this.loading = false;
        }
    },

    components: {
        Spinner
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    @import "../assets/scss/_vars.scss";

    #login-pane {
        position: relative;
        width: 330px;
        height: 100%;
        margin: 5em auto;
    }

    .loading-center {
        position: absolute;
        margin: 57px auto;
        background: #fff;

        height: 100%;
        width: 100%;

        text-align: center;
        vertical-align: middle;

        .spinner {
            margin: 35% auto;
            translate: scale(2);
        }
    }

    .error {
        color: rgb(255,64,129);
    }

    /* loading-fade transition */
    .loading-fade-enter-active {
        transition-delay: 1s;
        transition: all $anim-time ease;
    }
    .loading-fade-leave-active {
        transition-delay: 1s;
        transition: all $anim-time ease;
    }
    .loading-fade-enter, .loading-fade-leave-to {
        transform: translateY(70%);
        opacity: 0;
    }

    dialog {
        position: fixed;
        top: 50%;
        transform: translate(0, -50%);
    }

</style>
