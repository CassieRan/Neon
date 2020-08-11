interface Element {
    handler: () => Promise<void> | void
}

// 先进先出队列
export default class Queue<T extends Element> {
    private status: 'finnal' | 'excuting'
    private elements: T[]
    constructor() {
        this.elements = []
        this.status = 'finnal'
    }
    push(element: T) {
        this.elements.push(element)
        if(this.status === 'finnal' && this.elements.length>0) {
            this.excute()
        }
    }
    private shift(): T | undefined {
        return this.elements.shift()
    }
    private async excute() {
        if (this.elements.length <= 0) {
            this.status = 'finnal'
            return
        }
        this.status = 'excuting'
        const currentElement = this.shift()
        await currentElement?.handler()
        this.excute()
    }
}
