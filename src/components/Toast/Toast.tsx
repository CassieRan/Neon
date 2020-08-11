import React from 'react'
import './Toast.css'

interface Props {
    content: string
}
export default class Toast extends React.Component<Props, {}> {
    constructor(props: Props) {
        super(props)
    }
    render() {
        return <div className="toast">{this.props.content}</div>
    }
}
