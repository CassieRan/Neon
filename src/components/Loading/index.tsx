import LoadingUI from './Loading'
import React from 'react'
import ReactDOM from 'react-dom'

export default abstract class Loading {
    static div: HTMLElement
    static render(): void {
        this.div = document.createElement('div')
        document.body.appendChild(this.div)
        ReactDOM.render(<LoadingUI />, this.div)
    }
    static start(): void {
        this.render()
    }
    static end(): void {
        ReactDOM.unmountComponentAtNode(this.div)
        document.body.removeChild(this.div)
    }
}
