<template>
  <a-card title="部门详情">
      <a-tabs :animated="false">
        <a-tab-pane key="1" tab="部门信息">
          <base-info v-bind="$props" />
        </a-tab-pane>
        <a-tab-pane key="2" tab="部门策略">
          <dept-info v-bind="$props" />
        </a-tab-pane>
        <a-tab-pane key="3" tab="成员组成">
          <member-info v-bind="$props" />
        </a-tab-pane>
        <a-tab-pane key="4" tab="操作">
          <operate v-bind="$props" />
        </a-tab-pane>
      </a-tabs>
  </a-card>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {Card, Tabs} from 'ant-design-vue'
import {BaseInfo, DeptInfo, MemberInfo, Operate} from './components/info-tabs'

export default defineComponent({
  name: "dept-info",
  props: ['deptId'],
  components: {[Card.name]: Card, [Tabs.name]: Tabs, [Tabs.TabPane.name]: Tabs.TabPane, BaseInfo, DeptInfo, MemberInfo, Operate},
  setup() {

    return {}
  }
})
</script>

<style lang="scss" scoped>
</style>
