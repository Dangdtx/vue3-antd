<template>
  <div class="login-box">
    <div class="login-logo">
      <img src="../../assets/logo.png" alt="">
      <h1>黑匣子文档安全管理系统</h1>
    </div>
    <a-form layout="horizontal" :model="formInline" v-bind="formItemLayout" @submit="handleSubmit" @submit.prevent>
      <a-form-item label="服务器">
        <a-input v-model:value="formInline.server" placeholder="Username">
        </a-input>
      </a-form-item>
      <a-form-item label="用户名">
        <a-input v-model:value="formInline.username" placeholder="Username">
        </a-input>
      </a-form-item>
      <a-form-item label="密码">
        <a-input v-model:value="formInline.password" type="password" placeholder="Password">
        </a-input>
      </a-form-item>
      <a-form-item label="端口">
        <a-input v-model:value="formInline.port" type="password" placeholder="Password">
        </a-input>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 19, offset: 5 }">
        <a-button
            type="primary"
            html-type="submit"
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

import router from "@/router";

import {loginApi} from "@/api/sys/user";

export default defineComponent({
  name: "index",
  setup() {
    const state = reactive({
      formInline: {
        server: '',
        username: '',
        password: '',
        port: ''
      },
      formItemLayout: {
        labelCol: { span: 5 },
        wrapperCol: { span: 19 },
      }
    })
    const handleSubmit = () => {
      console.log(state.formInline)
      loginApi(state.formInline)
      router.replace('/')
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
  padding-top: 200px;
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
