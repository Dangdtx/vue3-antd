<template>
  <router-view :key="route.fullPath" v-slot="{ Component }">
    <transition name="zoom-fade" mode="out-in">
      <component :is="Component"/>
    </transition>
  </router-view>
</template>

<script lang="ts">
import {defineComponent, Transition} from 'vue'
import {useRoute} from "vue-router";

export default defineComponent({
  name: "department",
  components: {Transition},
  setup() {

    return {
      route: useRoute()
    }
  }
})
</script>

<style scoped>
</style>
