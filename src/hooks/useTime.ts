import {ref, onMounted, onUnmounted} from 'vue'

/**
 * @description 获取本地时间
 */
export function useTime() {

    let timer // 定时器
    const year = ref(0) // 年份
    const month = ref(0) // 月份
    const week = ref('') // 星期几
    const day = ref(0) // 天数
    const hour = ref(0) // 小时
    const minute = ref(0) // 分钟
    const second = ref(0) // 秒

    onMounted(() => {
        clearInterval(timer)
        timer = setInterval(() => {
            const date = new Date()
            year.value = date.getFullYear()
            month.value = date.getMonth() + 1
            week.value =  '日一二三四五六'.charAt(date.getDay())
            day.value = date.getDate()
            hour.value = date.getHours()
            minute.value = date.getMinutes()
            second.value = date.getSeconds()
        }, 1000)
    })

    onUnmounted(() => {
        clearInterval(timer)
    })

    return {month, day, hour, minute, second, week}
}
