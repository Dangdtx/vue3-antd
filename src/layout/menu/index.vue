<template>
    <div class="logo">
      <img src="../../assets/logo.png" alt="">
      <h1 v-show="!collapsed">黑匣子控制中心</h1>
    </div>
    <a-menu @click="clickMenuItem" theme="dark" mode="inline" :inlineCollapsed="false" v-model:selectedKeys="selectedKeys" v-model:openKeys="openKeys"  @openChange="onOpenChange">
      <template v-for="group in routes">
        <a-sub-menu v-if="!group.meta.hidden" :key="group.path">
          <template v-slot:title>
            <component :is="group.meta?.icon"/>
            <span>{{ group.meta.title }}</span>
          </template>
          <template v-for="menu in group.children">
            <a-menu-item v-if="!menu.meta.hidden" :key="group.path + '/' + menu.path">
              <component :is="menu.meta?.icon"/>
              <span class="nav-text">{{ menu.meta.title }}</span>
            </a-menu-item>
          </template>
        </a-sub-menu>
      </template>
    </a-menu>
</template>

<script lang="ts">
import {defineComponent, ref, unref, watch, SetupContext } from 'vue'
import {MenuFoldOutlined, UserOutlined, TeamOutlined, HomeOutlined, DesktopOutlined, SettingOutlined, ApartmentOutlined, EditOutlined} from '@ant-design/icons-vue';
import {message} from 'ant-design-vue'

import router from "@/router/";

import {useRoute} from "vue-router";

interface Props {
  collapsed: boolean;
}

export default defineComponent({
  name: 'menu',
  props: {
    collapsed: {
      type: Boolean,
    }
  },
  components: {
    message,
    UserOutlined,
    SettingOutlined,
    HomeOutlined,
    MenuFoldOutlined,
    DesktopOutlined,
    ApartmentOutlined,
    EditOutlined,
    TeamOutlined
  },
  setup(props: Props, context: SetupContext ) {
    const route = useRoute()
    console.log(route)
    const routes = router.getRoutes().find(item => item.path === '/')?.children || []
    const openKeys = ref([route.matched[1].path])
    const preOpenKeys = ref(unref(openKeys))
    const selectedKeys = ref([route.path])

    const clickMenuItem = (menuItem: any) => {
      router.push(menuItem.key)
    }
    const onOpenChange = (openKey: Array<string>) => openKeys.value = openKey.slice(-1)

    watch(() => props.collapsed, (newVal) => {
      console.log(newVal, preOpenKeys)
      openKeys.value = newVal ? [] : unref(preOpenKeys)
    })

    watch(() => route.fullPath, () => {
      openKeys.value = [route.matched[1].path]
      selectedKeys.value = [route.path]
    })

    watch(() => openKeys.value, (newVal, oldVal) => {
      preOpenKeys.value = oldVal
    })

    return {
      routes,
      openKeys,
      selectedKeys,
      clickMenuItem,
      onOpenChange
    }
  },
});

</script>

<style lang="scss" scoped>

.logo {
  height: 64px;
  line-height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 32px;
    height: 32px;
  }
  h1 {
    color: white;
    word-break: keep-all;
    white-space: nowrap;
    margin-bottom: 0;
  }
}
</style>
