import LoadingUI from './Loading'
import React from 'react'
import ReactDOM from 'react-dom'



export default class Loading {
    static div: HTMLElement;
    static instance: Loading;
    constructor() {
        this.render()
    }
    render() {
        Loading.div = document.createElement('div')
        document.body.appendChild(Loading.div)
        ReactDOM.render(<LoadingUI />,Loading.div)
    }
    static start() {
        this.instance = new Loading()
    }
    static end() {
        ReactDOM.unmountComponentAtNode(this.div)
        document.body.removeChild(this.div)
    }
}