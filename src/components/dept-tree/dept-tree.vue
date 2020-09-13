<template>
  <div class="tree-wrapper">
    <a-tree
        blockNode
        v-model:expanded-keys="expandedKeys"
        :loadedKeys="loadedKeys"
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
        <operate-row v-if="!hideOperate" @delete="deleteRow(node)" :hide-edit="true" @add="addRow(node)" @edit="editRow(node)"/>
      </template>
    </a-tree>
  </div>
  <a-input-search style="margin-bottom: 8px" placeholder="关键字查找" @compositionstart="onChange" @compositionend="onChange"
                  @change="onChange"/>
</template>

<script lang="ts">
import {message, Tree} from 'ant-design-vue'
import {defineComponent, toRefs, SetupContext, reactive, onMounted, nextTick, unref} from 'vue'

import {useDeptNew} from './modals/useModals'
import {OperateRow} from '@/components/operate-row'

import {deptDel, deptTree} from '@/api/dept'
import {useRoute, useRouter} from "vue-router";
import {useEventbus} from "@/hooks/useEventbus";

interface TreeItem {
  title: string | number;
  key: string | number;
  children?: TreeItem[];
  scopedSlots?: object;
  [propName: string]: any;
}

export default defineComponent({
  name: 'dept-tree',
  emits: ['selected'],
  props: {
    hideOperate: { // 隐藏操作栏
      type: Boolean,
      default: false
    },
    rootTreeOption: { // 根树配置
      type: Object,
      default: () => ({
        title: '公司',
        key: '1'
      })
    }
  },
  components: {OperateRow, [Tree.name]: Tree},
  setup(props, context: SetupContext) {
    //事件主线
    const {refreshTree} = useEventbus()
    const route = useRoute()
    const router = useRouter()

    const state = reactive({
      expandedKeys: [props.rootTreeOption.key],
      autoExpandParent: true,
      loadedKeys: [props.rootTreeOption.key],
      checkedKeys: [],
      selectedKeys: [],
      searchValue: '',
      treeData: [
        {
          title: '公司',
          key: '1',
          scopedSlots: {title: 'title'},
          children: [],
          ...props.rootTreeOption
        }
      ],
    })

    let dataList: TreeItem[] = [];
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
        ID: fatherId
      }
      const data = await deptTree(param)
      return data.filter(n => n.id != 1).map(item => {
        return {
          title: item.dname.toString(),
          key: item.id.toString(),
          scopedSlots: {title: 'title'},
          treeInfo: item
        }
      })
    }

    // 初始化树
    const initDeptTree = async () => {
      dataList = []
      state.treeData[0].children = await getDeptTree(state.treeData[0].key)
      generateList(state.treeData)
      state.autoExpandParent = false
    }

    onMounted(() => {
      refreshTree(() => {
        // todo
        router.push({
          path: '/redirect' + unref(route).fullPath,
        })
      })
      initDeptTree()
    })

    const onLoadData = (treeNode) => {
      return new Promise(resolve => {
        if (treeNode.dataRef.children) {
          console.log(treeNode.dataRef.children, '果然爱')
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

    const onExpand = (expandedKeys: any) => {
      console.log('onExpand', expandedKeys);
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      state.expandedKeys = expandedKeys;
      state.autoExpandParent = false;
    }
    const onCheck = (checkedKeys: any) => {
      console.log('onCheck', checkedKeys);
      state.checkedKeys = checkedKeys;
    }
    const onSelect = (selectedKeys: any, info: any) => {
      const {node} = info
      context.emit('selected', node.eventKey.toString())
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
      const res = await deptDel({deptID: node.eventKey})
      if (res.Code == 1) {
        message.success('删除成功')
        initDeptTree()
      } else {
        message[res.type](res.message || '删除失败')
      }
    }
    // 添加行
    const addRow = (node) => {
      useDeptNew({fatherId: node.eventKey})
    }
    // 编辑行
    const editRow = (node) => {
      console.log(node)
    }

    return {
      ...toRefs(state),
      onChange,
      onCheck,
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
