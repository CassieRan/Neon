import LoadingUI from './Loading'
import React from 'react'
import ReactDOM from 'react-dom'

export default abstract class Loading {
    static div: HTMLElement
    static render(): void {
        Loading.div = document.createElement('div')
        document.body.appendChild(Loading.div)
        ReactDOM.render(<LoadingUI />, Loading.div)
    }
    static start(): void {
        Loading.render()
    }
    static end(): void {
        ReactDOM.unmountComponentAtNode(this.div)
        document.body.removeChild(this.div)
    }
}
