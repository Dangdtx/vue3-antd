import {createApp, h, App} from 'vue'

import {ModalProps} from './props'

import ModalComponent from './policy-name-operation.vue'

let ModalComponentInstance: App<Element> | null = null
let wrapperEl: HTMLElement | null = null

export const usePolicyOperation = (props: ModalProps, callback?: (param: any) => any) => {

    const bodyClick = () => {
        ModalComponentInstance && wrapperEl && document.body.removeChild(wrapperEl);
        document.body.removeEventListener('click', bodyClick);
        ModalComponentInstance = null;
    }

    ModalComponentInstance && bodyClick()

    if (!ModalComponentInstance) {
        ModalComponentInstance = createApp({
            setup() {
                return () => h(ModalComponent, {
                    ...props,
                    onCallback: (param) => callback && callback(param)
                } )
            }
        })
        wrapperEl = document.createElement('div')
        document.body.appendChild(wrapperEl)
        ModalComponentInstance.mount(wrapperEl)
        console.log(ModalComponentInstance)
    }

    document.body.addEventListener('click', bodyClick);
}


