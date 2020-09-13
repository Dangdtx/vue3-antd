<template>
  <a-tabs :animated="false">
    <a-tab-pane key="1" tab="子部门">
      <Suspense>
        <template #default>
          <sub-dept v-bind="$attrs"/>
        </template>
        <template #fallback>
          <div>加载中...</div>
        </template>
      </Suspense>
    </a-tab-pane>
    <a-tab-pane key="2" tab="客户端">
      <Suspense>
        <template #default>
          <client-info v-bind="$attrs"/>
        </template>
        <template #fallback>
          <div>加载中...</div>
        </template>
      </Suspense>
    </a-tab-pane>
    <a-tab-pane key="3" tab="用户">
      <member-list v-bind="$attrs"/>
    </a-tab-pane>
  </a-tabs>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {Card, Tabs} from 'ant-design-vue'
import {SubDept,ClientInfo, MemberList} from './member-tabs'

export default defineComponent({
  name: "member-info",
  components: {[Card.name]: Card, [Tabs.name]: Tabs, [Tabs.TabPane.name]: Tabs.TabPane, SubDept, ClientInfo, MemberList},
  setup(props, {attrs}) {

    console.log(attrs)
    return {}
  }
})
</script>

<style lang="scss" scoped>
</style>
