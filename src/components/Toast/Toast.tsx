import React from 'react'
import './Toast.css'
import ZIndex from '../ZIndex/index'

interface Props {
    content: string
}
export default class Toast extends React.Component<Props, {}> {
    constructor(props: Props) {
        super(props)
    }
    render() {
        return <div className="toast" style={{zIndex: ZIndex.gen()}}>{this.props.content}</div>
    }
}
