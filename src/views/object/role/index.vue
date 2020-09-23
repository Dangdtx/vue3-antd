<template>
  <router-view :key="route.fullPath" v-slot="{ Component }">
    <transition name="zoom-fade" mode="out-in">
        <component :is="Component"/>
    </transition>
  </router-view>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {useRoute} from "vue-router";

export default defineComponent({
  name: "role",
  setup() {

    return {
      route: useRoute()
    }
  }
})
</script>

<style scoped>
</style>
