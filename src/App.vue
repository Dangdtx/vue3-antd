<template>
  <config-provider v-if="lockTime > 0" :locale="zhCN">
    <router-view v-slot="{ Component }">
      <transition name="zoom-fade">
        <component :is="Component" />
      </transition>
    </router-view>
  </config-provider>
  <lock-screen v-if="lockTime <= 0" />
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import {ConfigProvider} from 'ant-design-vue'
import {LockScreen} from '@/components/lockscreen'
import {useUserLeave} from '@/hooks/useUserLeave'

export default defineComponent({
  name: 'App',
  components: {ConfigProvider, LockScreen},
  setup() {

    const {lockTime} = useUserLeave()

    return {
      zhCN,
      lockTime
    }
  }
});
</script>

<style lang="scss">
@import "~@/styles/global.scss";
</style>
