<template>
  <div class="login-box">
    <div class="login-logo">
      <img src="../../assets/logo.png" alt="">
      <h1>黑匣子管理系统</h1>
    </div>
    <a-form layout="horizontal" :model="formInline" v-bind="formItemLayout" @submit="handleSubmit" @submit.prevent>
      <a-form-item label="用户名">
        <a-input v-model:value="formInline.user" placeholder="请输入用户名">
        </a-input>
      </a-form-item>
      <a-form-item label="密码">
        <a-input v-model:value="formInline.password" type="password" placeholder="请输入密码" autocomplete="new-password">
        </a-input>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 19, offset: 5 }">
        <a-button
            type="primary"
            html-type="submit"
            :loading="loading"
            :disabled="formInline.user === '' || formInline.password === ''"
            block
        >
          登录
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs} from 'vue'
import {message} from 'ant-design-vue'
import md5 from 'blueimp-md5'

import {useRoute, useRouter} from "vue-router";

import {login} from "@/api/sys/user";

export default defineComponent({
  name: "login",
  setup() {
    const state = reactive({
      loading: false,
      formInline: {
        user: '',
        password: '',
      },
      formItemLayout: {
        labelCol: {span: 5},
        wrapperCol: {span: 19},
      }
    })

    const router = useRouter()
    const route = useRoute()

    const handleSubmit = async () => {
      const hide = message.loading('登录中...', 0)
      state.loading = true
      console.log(state.formInline)
      const params = {
        ...state.formInline
      }
      params.password = md5(params.password)
      const result = await login(params).finally(() => {
        state.loading = false
        message.destroy()
      })
      if (result.Code == 1) {
        const toPath = decodeURIComponent((route.query?.redirect || '/') as string)
        router.replace(toPath)
        localStorage.setItem('username', params.user)
      } else {
        message[result.type](result.message || '登录失败')
      }
    }
    return {
      ...toRefs(state),
      handleSubmit
    }
  }
})
</script>

<style lang="scss" scoped>
.login-box {
  width: 100vw;
  height: 100vh;
  display: flex;
  padding-top: 300px;
  flex-direction: column;
  align-items: center;
  background: url("../../assets/login.svg");
  background-size: 100%;

  .login-logo {
    display: flex;
    margin-bottom: 20px;

    img {
      height: 44px;
    }
  }

  .ant-form {
    width: 340px;

    .ant-form-item-label {
      padding-right: 6px;
    }
  }
}
</style>
