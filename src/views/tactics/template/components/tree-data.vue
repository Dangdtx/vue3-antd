<template>
  <div class="tree-wrapper">
    <a-tree
        blockNode
        v-model:expanded-keys="expandedKeys"
        :auto-expand-parent="autoExpandParent"
        :tree-data="treeData"
        :load-data="onLoadData"
        @expand="onExpand"
        @select="onSelect"
    >
      <template v-slot:title="node">
        <span v-if="node.title.indexOf(searchValue) > -1">
          {{ node.title.substr(0, node.title.indexOf(searchValue)) }}
          <span style="color: #f50">{{ searchValue }}</span>
          {{ node.title.substr(node.title.indexOf(searchValue) + searchValue.length) }}
        </span>
        <span v-else>{{ node.title }}</span>
        <operate-row
            :hide-edit="getPosLength(node) < 3"
            :hide-del="getPosLength(node) < 3"
            :hide-add="getPosLength(node) > 3"
            @delete="deleteRow(node)"
            @add="addRow(node)"
            @edit="editRow(node)"/>
      </template>
    </a-tree>
  </div>
  <a-input-search style="margin-bottom: 8px" placeholder="关键字查找" @compositionstart="onChange" @compositionend="onChange"
                  @change="onChange"/>
</template>

<script lang="ts">
import {message, Tree} from 'ant-design-vue'
import {defineComponent, toRefs, SetupContext, reactive, onMounted} from 'vue'
import {OperateRow} from '@/components/operate-row'

import { usePolicyOperation} from "@/views/tactics/template/modals/useModals"
import {
  policyAdd,
  policySet,
  moduleAdd,
  moduleSet,
  moduleDel,
  policyDel,
  moduleBypolicy,
  policyAll
} from '@/api/policy'

interface TreeItem {
  title: string | number;
  key: string | number;
  children?: TreeItem[];
  scopedSlots?: object;
  [propName: string]: any;
}

export default defineComponent({
  name: 'tree-data',
  components: {OperateRow, [Tree.name]: Tree},
  emits: ['selected-node', 'selected'],
  setup(props, context: SetupContext) {
    const state = reactive({
      expandedKeys: ['0'],
      autoExpandParent: true,
      selectedKeys: [] as string[] | number[],
      searchValue: '',
      treeData: [
        {
          title: '策略配置',
          key: '0',
          scopedSlots: {title: 'title'},
          children: []
        }
      ],
    })

    const dataList: TreeItem[] = [];
    const generateList = (data: TreeItem[]) => {
      for (let i = 0; i < data.length; i++) {
        const node = data[i];
        const {key, title} = node;
        dataList.push({key, title});
        if (node.children) {
          generateList(node.children);
        }
      }
    }

    // 获取部门树
    const getDeptTree = async (fatherId: string | number) => {
      const param = {
        id: fatherId
      }
      const data = await moduleBypolicy(param)
      return data.filter(n => n.id != 1).map(item => {
        return {
          title: item.applicationname,
          key: item.applicationid.toString(),
          scopedSlots: {title: 'title'},
          isLeaf: true,
          ...item
        }
      }) || []
    }

    // 获取策略树
    const getPolicyTree = async () => {
      const data = await policyAll({})
      const children = state.treeData[0].children = data.map(item => {
        return {
          title: item.classname,
          key: item.classid + '',
          scopedSlots: {title: 'title'},
          children: [],
          ...item
        } as TreeItem
      })

      for (const item of children) {
        item.children = await getDeptTree(item.key)
      }
      state.autoExpandParent = true
      setTimeout(() => generateList(state.treeData), 1200)
    }

    // 加载树节点
    const onLoadData = (treeNode) => {
      console.log(treeNode, '节点')
      return new Promise(resolve => {
        if (treeNode.dataRef.children) {
          resolve();
          return;
        }
        (async () => {
          treeNode.dataRef.children = await getDeptTree(treeNode.eventKey)
          generateList(state.treeData)
          resolve();
        })()
        // state.treeData = [...state.treeData];
      });
    }

    // 初始化数据
    const initData = () => {
      getPolicyTree()
    }

    onMounted(() => {
      initData()
    })

    // 获取节点层级
    const getPosLength = (node): number => node.pos.split('-').length

    const onExpand = (expandedKeys: any) => {
      console.log('onExpand', expandedKeys);
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      state.expandedKeys = expandedKeys;
      state.autoExpandParent = false;
    }
    const onSelect = (selectedKeys: any, info: any) => {
      console.log('onSelect', info)
      const {node} = info
      const posLength = getPosLength(node)
      posLength > 3 && context.emit('selected', node.eventKey.toString())
      context.emit('selected-node', node)
      state.selectedKeys = selectedKeys;
    }
    const getParentKey = (key: any, tree: any): any => {
      let parentKey;
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        if (node.children) {
          if (node.children.some((item: any) => item.key === key)) {
            parentKey = node.key;
          } else if (getParentKey(key, node.children)) {
            parentKey = getParentKey(key, node.children);
          }
        }
      }
      return parentKey;
    }
    const onChange = (e: any) => {
      const value = e.target.value;
      console.log(dataList)
      const expandedKeys = dataList
          .map((item: any) => {
            if (item.title.indexOf(value) > -1) {
              return getParentKey(item.key, state.treeData);
            }
            return null;
          })
          .filter((item, i, self) => item && self.indexOf(item) === i);
      Object.assign(state, {
        expandedKeys,
        searchValue: value,
        autoExpandParent: true,
      });
    }

    // 删除行
    const deleteRow = async (node) => {
      const pos = getPosLength(node) - 1
      if (pos == 2) {
        const result = await policyDel({id: node.eventKey})
        if (result.Code == 1) {
          initData()
          message.success('删除成功')
        } else {
          message[result.type](result.message || '删除失败')
        }
      } else if (pos == 3) {
        const result = await moduleDel({id: node.eventKey})
        if (result.Code == 1) {
          initData()
          message.success('删除成功')
        } else {
          message[result.type](result.message || '删除失败')
        }
      }
    }
    // 添加行
    const addRow = (node) => {
      const pos = getPosLength(node) - 1
      if (pos == 1) {
        usePolicyOperation({
          title: '策略名称',
          label: '策略名称',
          reqMethod:
          policyAdd,
          callback: (res: any): void => {
            if (res.Code == 1) initData()
          }
        })
      } else if (pos == 2) {
        usePolicyOperation({
          title: '加密类型',
          id: node.eventKey,
          label: '类型名称',
          reqMethod: moduleAdd,
          callback: (res: any): void => {
            if (res.Code == 1) initData()
          }
        })
      }
    }
    // 编辑行
    const editRow = (node) => {
      const pos = getPosLength(node) - 1
      if (pos == 2) {
        usePolicyOperation({
          title: '策略名称',
          id: node.eventKey,
          defaultValue: node.title,
          label: '策略名称',
          reqMethod: policySet
        }, (name) => initData())
      } else if (pos == 3) {
        usePolicyOperation({
          title: '加密分类',
          id: node.eventKey,
          defaultValue: node.title,
          label: '类型名称',
          reqMethod: moduleSet
        }, (name) => initData())
      }
    }

    return {
      ...toRefs(state),
      onChange,
      getPosLength,
      onSelect,
      onExpand,
      onLoadData,
      deleteRow,
      addRow,
      editRow
    };
  }
})
</script>

<style lang="scss" scoped>
.tree-wrapper {
  height: 600px;
  overflow: auto;

  ::v-deep(.ant-tree-title) {
    display: inline-block;
    width: 100%;

    &:hover .actions {
      display: inline-block;
    }
  }
}
</style>
