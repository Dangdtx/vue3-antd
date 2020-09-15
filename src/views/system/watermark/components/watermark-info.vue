<template>
  <a-form :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
    <a-form-item label="当前组">
      {{treeTitle}}--{{tableTitle}}
    </a-form-item>
    <a-form-item label="水印颜色">
      <input v-model="form.color" type="color"/>
    </a-form-item>
    <a-form-item label="水印字体">
      <a-select v-model:value="form.font" placeholder="请选择字体">
        <a-select-option v-for="item in fontSelectedOptions" :key="item.label" :value="item.label">
          <span :style="{fontFamily: item.fontFamily}">{{ item.label }}</span>
        </a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="字体大小">
      <a-row>
        <a-col :span="10">
          <a-slider v-model:value="form.fontSize" :min="0" :max="40"/>
        </a-col>
        <a-col :span="8">
          <a-input-number
              v-model:value="form.fontSize"
              :formatter="value => `${value}px`"
              :parser="value => value.replace('px', '')"
              :min="1" :max="40" style="marginLeft: 16px"/>
        </a-col>
        <a-col :span="6">
          <a-checkbox v-model:checked="form.fontAutoSize">自动</a-checkbox>
        </a-col>
      </a-row>
    </a-form-item>
    <a-form-item label="透明度">
      <a-row>
        <a-col :span="10">
          <a-slider v-model:value="form.transparent" :min="0" :max="100"/>
        </a-col>
        <a-col :span="4">
          <a-input-number
              v-model:value="form.transparent"
              :formatter="value => `${value}%`"
              :parser="value => value.replace('%', '')"
              :min="0" :max="100" style="marginLeft: 16px"/>
        </a-col>
      </a-row>
    </a-form-item>
    <a-form-item label="显示样式">
      <a-radio-group v-model:value="form.layout">
        <a-radio v-for="(value, key) in styleSelectedOptions" :key="key" :value="key">
          {{ value }}
        </a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item label="水印细节">
      <a @click="isShowDescription = !isShowDescription">{{ isShowDescription ? '收起' : '展开' }}</a>
      <div :class="{'show': isShowDescription}" class="desc-box">
        <a-checkbox-group v-model:value="checkeds" style="display: block;margin-bottom: 10px">
          <a-row>
            <a-col v-for="(value, key) in checkBoxs" :key="key" :span="10">
              <a-checkbox :value="key">
                {{ value }}
              </a-checkbox>
            </a-col>
          </a-row>
        </a-checkbox-group>
        <a-row>
          <a-col :span="6">
            水印条数：
          </a-col>
          <a-col :span="10">
            <a-slider v-model:value="form.items" :min="1" :max="5"/>
          </a-col>
          <a-col :span="4">
            <a-input-number v-model:value="form.items" :min="1" :max="5" style="marginLeft: 16px"/>
          </a-col>
        </a-row>
        <div>
          自定义内容:
        </div>
        <a-textarea v-model:value="form.text"/>
      </div>
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary" @click="saveChange">
        保存修改
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs, watch} from 'vue';
import {useRoute} from "vue-router";
import {Select, Slider, InputNumber, Col, Row, Input} from 'ant-design-vue'

import {
  styleSelectedOptions,
  checkBoxs,
  fontSelectedOptions
} from './options'

import {watermarkSetdm, watermarkFileMark, watermarkDocMark} from '@/api/watermark'

export default defineComponent({
  name: 'watermark-info',
  components: {
    [Select.name]: Select,
    [Select.Option.name]: Select.Option,
    [Slider.name]: Slider,
    [InputNumber.name]: InputNumber,
    [Row.name]: Row,
    [Col.name]: Col,
    [Input.TextArea.name]: Input.TextArea
  },
  props: ['treeTitle', 'tableTitle', 'gid'],
  setup(props) {
    const route = useRoute()

    const state = reactive({
      labelCol: {span: 4},
      wrapperCol: {span: 18},
      isShowDescription: false, // 是否展开
      checkeds: [], // 复选框
      form: {
        color: '#ff0000',
        font: '宋体',
        fontAutoSize: true,
        fontSize: 0,
        layout: '3',
        transparent: 0,
        text: 'Default',
        option: 0,
        items: 0,
        proc: ''
      }
    })

    const sumOption = (): number => {
      let option = state.form.text.length > 0 ? 16 : 0
      state.checkeds.forEach(item => (option += parseInt(item)))
      return option
    }

    // 保存修改
    const saveChange = () => {
      const params = {...state.form}
      params.color = params.color.replace('#', '')
      params.option = sumOption()
      watermarkSetdm({record: params})
    }

    // 监听传过来的gid
    watch(() => props.gid, value => {
      // 打印水印
      if (route.meta.watermarkType == 'filemark') {
        watermarkFileMark({gid: value})
      } else {
        watermarkDocMark({gid: value})
      }
    })
    // 监听传过来的gid
    watch(() => route.fullPath, value => {
      console.log(route.meta.watermarkType)
    }, {immediate:true})

    return {
      ...toRefs(state),
      styleSelectedOptions,
      checkBoxs,
      fontSelectedOptions,
      saveChange
    }
  },
});

</script>

<style lang="scss" scoped>
.desc-box {
  max-height: 0;
  overflow: hidden;
  transition: max-height .3s;
  &.show {
    max-height: 400px;
  }
}
</style>
