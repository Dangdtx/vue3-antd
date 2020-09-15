<template>
  <div class="lockscreen">
    <div class="container">
      <div class="number">{{ battery.level }}%</div>
      <div class="contrast">
        <div class="circle"></div>
        <ul class="bubbles">
          <li v-for="i in 15" :key="i"></li>
        </ul>
      </div>
      <div class="charging">
        <div>{{batteryStatus}}</div>
        <div v-show="Number.isFinite(battery.dischargingTime)">
          剩余可使用时间：{{calcDischargingTime}}
        </div>
        <span v-show="Number.isFinite(battery.chargingTime) && battery.chargingTime != 0">
          距离电池充满需要：{{calcDischargingTime}}
        </span>
      </div>
    </div>
    <div class="local-time">
      <div class="time">
        {{ hour }}:{{minute}}
      </div>
      <div class="date">
        {{month}}月{{day}}号，星期{{ week }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, toRefs, computed} from 'vue'
import {useTime} from '@/hooks/useTime'

interface Battery {
  charging: boolean; // 当前电池是否正在充电
  chargingTime: number; // 距离充电完毕还需多少秒，如果为0则充电完毕
  dischargingTime: number; // 代表距离电池耗电至空且挂起需要多少秒
  level: number; // 代表电量的放大等级，这个值在 0.0 至 1.0 之间
  [key: string]: any;
}

export default defineComponent({
  name: "lockscreen",
  setup() {
    // 获取本地时间
    const {month, day, hour, minute, second, week} = useTime()

    const state = reactive({
      battery: {
        charging: false,
        chargingTime: 0,
        dischargingTime: 0,
        level: 100
      }
    })

    // 更新电池使用状态
    const updateBattery = (target) => {
      for (const key in state.battery) {
        state.battery[key] = target[key]
      }
      state.battery.level = state.battery.level * 100
    }

    // 计算电池剩余可用时间
    const calcDischargingTime = computed(() => {
      const hour = state.battery.dischargingTime / 3600
      const minute = state.battery.dischargingTime / 60 % 60
      return `${~~hour}小时${~~minute}分钟`
    })

    // 电池状态
    const batteryStatus = computed(() => {
      if (state.battery.charging && state.battery.level >= 100) {
        return '已充满'
      } else if (state.battery.charging) {
        return  '充电中'
      } else {
        return '已断开电源'
      }
    })

    onMounted(async () => {
      const BatteryManager: Battery = await (navigator as any).getBattery()
      updateBattery(BatteryManager)
      console.log(BatteryManager, '电池')

      // 电池充电状态更新时被调用
      BatteryManager.onchargingchange = ({target}) => {
        updateBattery(target)
        console.log(target, '电池充电状态改变了')
      }
      // 电池充电时间更新时被调用
      BatteryManager.onchargingtimechange = ({target}) => {
        updateBattery(target)
        console.log(target, '电池充电了')
      }
      // 电池断开充电时间更新时被调用
      BatteryManager.ondischargingtimechange = ({target}) => {
        updateBattery(target)
        console.log(target, '电池断开充电了')
      }
      // 电池电量更新时被调用
      BatteryManager.onlevelchange = ({target}) => {
        updateBattery(target)
        console.log(target, '电量更新了')
      }

    })

    return {
      ...toRefs(state),
    month, day, hour, minute, second,week,
      batteryStatus,
      calcDischargingTime
    }
  }
})
</script>

<style lang="scss" scoped>
.lockscreen {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  background: #000;
  color: white;
  overflow: hidden;
  z-index: 999999999;

  .container {
    position: relative;
    width: 300px;
    height: 400px;
    margin: auto;

    .number {
      position: absolute;
      width: 300px;
      top: 27%;
      text-align: center;
      font-size: 32px;
      z-index: 10;
      color: #fff;
    }

    .contrast {
      filter: contrast(15) hue-rotate(0);
      width: 300px;
      height: 400px;
      background-color: #000;
      overflow: hidden;
      animation: hueRotate 10s infinite linear;

      .circle {
        position: relative;
        width: 300px;
        height: 300px;
        box-sizing: border-box;
        filter: blur(8px);

        &::after {
          content: "";
          position: absolute;
          top: 40%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(0);
          width: 200px;
          height: 200px;
          background-color: #00ff6f;
          border-radius: 42% 38% 62% 49% / 45%;
          animation: rotate 10s infinite linear;
        }

        &::before {
          content: "";
          position: absolute;
          width: 176px;
          height: 176px;
          top: 40%;
          left: 50%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background-color: #000;
          z-index: 10;
        }
      }

      .bubbles {
        position: absolute;
        left: 50%;
        bottom: 0;
        width: 100px;
        height: 40px;
        transform: translate(-50%, 0);
        border-radius: 100px 100px 0 0;
        background-color: #00ff6f;
        filter: blur(5px);

        li {
          position: absolute;
          border-radius: 50%;
          background: #00ff6f;
        }
      }
    }

    .charging {
      text-align: center;
      font-size: 20px;
    }
  }

  .local-time {
    position: absolute;
    bottom: 100px;
    left: 60px;
    font-family: helvetica;
    .time {
      font-size: 70px;
    }
    .date {
      font-size: 40px;
    }
  }
}

@for $i from 0 through 15 {
  li:nth-child(#{$i}) {
    $width: 15 + random(15) + px;
    left: 15 + random(70) + px;
    top: 50%;
    transform: translate(-50%, -50%);
    width: $width;
    height: $width;
    animation: moveToTop #{random(6) + 3}s ease-in-out -#{random(5000)/1000}s infinite;
  }
}

@keyframes rotate {
  50% {
    border-radius: 45% / 42% 38% 58% 49%;
  }
  100% {
    transform: translate(-50%, -50%) rotate(720deg);
  }
}

@keyframes moveToTop {
  90% {
    opacity: 1;
  }
  100% {
    opacity: .1;
    transform: translate(-50%, -180px);
  }
}

@keyframes hueRotate {
  100% {
    filter: contrast(15) hue-rotate(360deg);
  }
}
</style>
