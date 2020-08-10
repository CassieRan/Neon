export function drawGrid(
    context: CanvasRenderingContext2D,
    color: string,
    stepx: number,
    stepy: number,
    width = 0.5
) {
    context.strokeStyle = color
    context.lineWidth = width

    for (let i = stepx + 0.5; i < context.canvas.width; i += stepx) {
        context.beginPath()
        context.moveTo(i, 0)
        context.lineTo(i, context.canvas.height)
        context.stroke()
    }

    for (let i = stepy + width; i < context.canvas.height; i += stepy) {
        context.beginPath()
        context.moveTo(0, i)
        context.lineTo(context.canvas.width, i)
        context.stroke()
    }
}
export function drawCenter(
    context: CanvasRenderingContext2D,
    color: string,
    w: number,
    h: number,
    width=1
) {
    const centerX = context.canvas.width / 2
    const centerY = context.canvas.height / 2
    context.strokeStyle = color
    context.lineWidth = width
    context.strokeRect(centerX - w / 2, centerY - h / 2, w, h)
}