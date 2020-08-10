import React from 'react'
import ReactDom from 'react-dom'
import ToastUI from './Toast'
import { type } from 'os'

interface ToastItem {
    content: string
    duration: number
}

interface ToastController {
    status: 'finnal' | 'pending'
    stack: ToastItem[]
    add: (item: ToastItem) => void
    remove: () => ToastItem,
    next: ()=>void
}

let toastController: ToastController = {
    status: 'finnal',
    stack: [],
    add(item: ToastItem) {
        this.stack.push(item)
        if (this.status === 'finnal' && this.stack.length > 0) this.next()
    },
    remove() {
        if(this.stack.length) return this.stack.shift()
    },
    next() {
        if (this.stack.length <= 0) return (this.status = 'finnal')
        this.status = 'pending'
        const item = this.removeToast()
        const div = document.createElement('div')
        document.body.appendChild(div)
        ReactDom.render(<ToastUI content={item.content} />, div)
        setTimeout(() => {
            ReactDom.unmountComponentAtNode(div)
            document.body.removeChild(div)
            this.next()
        }, item.duration)
    },
}

export default function toast(content: string, duration = 2000) {
    toastController.add({ content, duration })
}
