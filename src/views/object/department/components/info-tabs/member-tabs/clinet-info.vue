<template>
  <split-panel>
    <template v-slot:left-content>
      <dept-tree :hide-operate="true" :root-tree-option="treeOption" @selected="selectedTree"/>
    </template>
    <template v-slot:right-content>
      <table-data :selected-dept-id="selectedDeptId" />
    </template>
  </split-panel>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue';

import SplitPanel from '@/components/split-panel/index.vue'

import {DeptTree} from "@/components/dept-tree";
import TableData from "@/views/object/terminal/components/table-data.vue";
import {deptInfo} from "@/api/dept";

export default defineComponent({
  name: 'terminal',
  components: {DeptTree, SplitPanel, TableData},
  async setup(props, {attrs}) {
    const selectedDeptId = ref(attrs.deptId) // 部门ID

    const {dname, id} = await deptInfo({}, attrs.deptId)

    const treeOption = ref({
      title: dname,
      key: id
    })

    // 选择的部门id
    const selectedTree = (value) => {
      selectedDeptId.value = value
    }

    return {
      selectedDeptId,
      treeOption,
      selectedTree,
    }
  },
});

</script>

<style>

</style>
