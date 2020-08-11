import React from 'react'
import ReactDom from 'react-dom'
import ToastUI from './Toast'
import Queue from './Queue'

class Toast {
    msg: string
    duration: number
    constructor(msg: string, duration: number) {
        this.msg = msg
        this.duration = duration
    }
    handler(): Promise<void> {
        return new Promise((resolve, reject) => {
            const div = document.createElement('div')
            document.body.appendChild(div)
            ReactDom.render(<ToastUI content={this.msg} />, div)
            setTimeout(() => {
                ReactDom.unmountComponentAtNode(div)
                document.body.removeChild(div)
                resolve()
            }, this.duration)
        })
    }
}

abstract class ToastController {
    static queue = new Queue<Toast>()
    static main(msg: string, duration = 2000) {
        ToastController.queue.push(new Toast(msg, duration))
    }
}

export default ToastController.main
