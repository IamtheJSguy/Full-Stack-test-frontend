<template>
  <div class="login-container" style="background-color: #232323;">
    <ell-top style="position: absolute; top: 0; right: 0;" />
    <ell-down style="position: absolute; bottom: 0; left: 0;" />
    <div class="auth-main-container" style="background-color: #232323;">
      <el-row :gutter="12" type="flex" justify="center" align="top" style="max-height: calc(100%-100px);">
        <el-col
          :span="24"
          :offset="0"
          :xs="24"
          :sm="24"
          :md="24"
          :lg="24"
          :xl="12"
          style="padding: 80px 50px; text-align: center; max-height: calc(100%-100px);"
        >
          <h1 style="color: #BDBDBD;" >Sports Login<sup class="heading-sub"></sup></h1>
          <div style="width: 400px; margin: 0 auto; text-align: left; background-color: #232323;">
            <el-form ref="loginForm" :model="loginForm" :rules="loginRules" style="text-align: center;" autocomplete="on">
              <el-form-item prop="username" class="field">
                <el-input
                  ref="credential"
                  v-model="loginForm.email"
                  placeholder="Email"
                  name="email"
                  type="email"
                  tabindex="1"
                  autocomplete="on"
                />
              </el-form-item>

              <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
                <el-form-item prop="password" class="field field-2">
                  <el-input
                    :key="passwordType"
                    ref="password"
                    v-model="loginForm.password"
                    style="letter-spacing: 5px;"
                    :type="passwordType"
                    placeholder="Password"
                    name="password"
                    tabindex="2"
                    autocomplete="on"
                    @keyup.native="checkCapslock"
                    @blur="capsTooltip = false"
                    @keyup.enter.native="handleLogin"
                  />
                  <span class="show-pwd" @click="showPwd">
                    <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
                  </span>
                </el-form-item>
              </el-tooltip>

              <div style="width: 400px; margin: 20px auto; display: flex; justify-content: space-between;">
                <div>
                  <router-link to="/register" style="margin: 0; color: #707070; font-family: Helvetica; font-size: 14px">Signup</router-link>
                </div>
              </div>
              <el-button :loading="loading" type="primary" style="background-color: #F6B233; " class="form-button" @click.native.prevent="handleLogin">Sign In</el-button>
            </el-form>
            <p style="margin-left: 90px;" class="tnc">Terms and Conditions & Privacy Poicy</p>
          </div>
        </el-col>
        <el-col :span="24" :offset="0" :xs="0" :sm="12" :md="24" :lg="24" :xl="24">
          <img src="https://techub.com.pk/wp-content/uploads/2021/04/logo-techhub.svg" alt=""   style="height: 60%; width: 60%; fill: #F6B233; margin: 20%;">
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ellipseDown from './components/AuthenticationSVG/ellipseDown'
import ellipseUp from './components/AuthenticationSVG/ellipseUp'

export default {
  name: 'Login',
  components: {
    'ell-down': ellipseDown,
    'ell-top': ellipseUp
  },
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        email: '',
        password: ''
      },
      loginRules: {
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      checked: false
    }
  },
  computed: {
    ...mapState({
      user: state => state.user
    })
  },
  created() {
      if(this.user.id){
        this.$router.push('/app')
      }
    },
  mounted() {
    if (this.loginForm.email === '') {
      this.$refs.credential.focus()
    }
  },
  methods: {
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('userLogin', this.loginForm)
            .then(response => {
              this.notification(
                { status: 'Done!', message: 'Successfully Logged In' },
                'success'
              )
              // localStorage.setItem('userId', response.data.data.id)
              this.$store.commit('currentUser', response.data.data)
              this.loading = false
              this.$router.push('/app')
            })
            .catch(error => {
              this.loading = false
              this.notification(error.response.data, 'error')
            })
        } else {
          return false
        }
      })
    },
    notification(data, type) {
      this.$notify({
        title: data.status,
        message: data.message || data.errEmail || data.errPassword,
        type: type
      })
    }
  }
}
</script>

<style lang="scss">

$bg: #ffffff;
$light_gray: #fff;
$cursor: #6c63ff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 60px;
    background: #fff;
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.16);
    input {
      background: #fff;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 3px;
      padding: 12px 5px 12px 15px;
      color: #000;
      height: 60px;
      caret-color: $cursor;
      font-size: 18px;
      width: 400px;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #000 !important;
      }
    }
    input:focus {
      border-left: 7px solid #6c63ff;
    }
  }
  .field {
    width: 400px;
  }
  .form-button {
    width: 400px;
    background-color: rgb(146, 1, 1);
    color: #fff;
    height: 50px;
    font-weight: 700;
    margin-top: 20px;
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background-color: rgb(255, 255, 255);
    border-radius: 3px;
    color: #000000;
    box-shadow: 0 10px 30px 0 rgba(0, 0, 0, 0.16);
    margin: 0 auto;
    height: 60px;
  }
}
</style>

<style lang="scss" scoped>
$bg: #f4f4f4;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .auth-main-container {
    width: calc(100% - 100px);
    height: calc(100% - 100px);
    top: 50px;
    left: 50px;
    position: absolute;
    border-radius: 5px;
    box-shadow: 0 10px 30px 0 rgba(0, 0, 0, 0.16);
    background-color: #ffffff;

    .form-heading {
      margin-top: 30px;
      font-size: 18px;
    }
    .heading-sub {
      font-family: Helvetica;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.17;
      letter-spacing: normal;
      text-align: left;
      color: #b6b6b6;
    }
    .tnc {
      height: 10.5px;
      font-family: Helvetica;
      font-size: 12px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.17;
      letter-spacing: normal;
      text-align: left;
      color: #289ffa;
    }
  }
  .login-form {
    position: relative;
    border-radius: 3px;
    box-shadow: 0 3.5px 13px 0 rgba(137, 137, 137, 0.16);
    border: solid 0.5px #eeeff5;
    background-color: #ffffff;
    overflow: hidden;
  }

  .input-field {
    height: 76px;
    width: 250px;
    background-color: #ffffff;
    margin: 0;

    input {
      color: #000000;
      background: #ffffff;
    }
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
