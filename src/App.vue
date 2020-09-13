<template>
  <config-provider :locale="zhCN">
    <router-view v-slot="{ Component }">
      <transition name="zoom-fade">
        <component :is="Component" />
      </transition>
    </router-view>
  </config-provider>
</template>

<script lang="ts">
import {defineComponent, Transition} from 'vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import {ConfigProvider} from 'ant-design-vue'

export default defineComponent({
  name: 'App',
  components: {ConfigProvider, Transition},
  setup() {

    return {
      zhCN
    }
  }
});
</script>

<style lang="scss">
@import "~@/styles/global.scss";
</style>
