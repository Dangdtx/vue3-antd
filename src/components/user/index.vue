<template>
  <a-card title="角色详情">
      <a-tabs :animated="false">
        <a-tab-pane key="1" tab="基础信息">
          <base-info v-bind="$props" />
        </a-tab-pane>
        <a-tab-pane key="2" tab="用户策略">
          <user-policy v-bind="$props" />
        </a-tab-pane>
        <a-tab-pane key="3" tab="操作">
          <operate v-bind="$props" />
        </a-tab-pane>
      </a-tabs>
  </a-card>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {Card, Tabs} from 'ant-design-vue'
import {BaseInfo, UserPolicy, Operate} from './info-tabs'

export default defineComponent({
  name: "user-info",
  props: ['uid'],
  components: {[Card.name]: Card, [Tabs.name]: Tabs, [Tabs.TabPane.name]: Tabs.TabPane, BaseInfo, UserPolicy, Operate},
  setup() {

    return {}
  }
})
</script>

<style lang="scss" scoped>
</style>
