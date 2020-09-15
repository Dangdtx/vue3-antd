import {ref, onMounted, onUnmounted} from 'vue'

/**
 * @description 用户长时间未操作页面
 */
export function useUserLeave() {

    let timer
    // 锁屏倒计时
    const lockTime = ref(60 * 10)

    const timekeeping = () => {
        clearInterval(timer)
        timer = setInterval(() => {
            if (--lockTime.value <= 0) {
                clearInterval(timer)
            }
        }, 1000)
    }

    onMounted(() => {
        document.body.addEventListener('mousedown', timekeeping)
    })

    onUnmounted(() => {
        document.body.removeEventListener('mousedown', timekeeping)
    })

    return {lockTime}
}
