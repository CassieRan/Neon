import React from 'react'
import './App.css'
/// <reference path="./type.d.ts" />
import ColorThief from 'colorthief'
import { copyToClipbord, toRgb, toHex } from './utils'
import { drawGrid, drawCenter } from './canvas'
import Loading from './components/Loading/index'
import Toast from './components/Toast/index'

interface Props {}
interface State {
    imgSrc: string
    colors: [number, number, number][]
    colorMode: ColorMode
    dominantColor: [number, number, number]
    location: Location
    showMagnifier: boolean
    selectColor: number[] | null
    canvas: Size
}
interface Location {
    x: number
    y: number
}
interface Size {
    w: number
    h: number
}
enum ColorMode {
    RGB = 'rgb',
    HEX = 'hex',
}

export default class App extends React.Component<Props, State> {
    static img = new Image()
    static colorThief = new ColorThief()
    static magnifier = {
        w: 110,
        h: 110,
    }
    static ratio: number = 10 // 放大镜倍数
    constructor(props: Props) {
        super(props)
        this.state = {
            imgSrc: '',
            colors: [],
            colorMode: ColorMode.HEX,
            dominantColor: [255, 255, 255],
            location: { x: 0, y: 0 },
            showMagnifier: false,
            selectColor: null,
            canvas: { w: 345, h: 345 },
        }
        this.choose = this.choose.bind(this)
        this.getPalette = this.getPalette.bind(this)
        this.clickPaletteItemHandler = this.clickPaletteItemHandler.bind(this)
        this.touchStartHandler = this.touchStartHandler.bind(this)
        this.touchMoveHandler = this.touchMoveHandler.bind(this)
        this.touchEndHandler = this.touchEndHandler.bind(this)
        this.drawImage = this.drawImage.bind(this)
        this.loadImg = this.loadImg.bind(this)
        this.drawMagnifier = this.drawMagnifier.bind(this)
    }

    componentDidMount() {}

    choose(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files
        if (!files || !files[0]) return
        this.setState(
            {
                imgSrc: files && files[0] && URL.createObjectURL(files[0]),
            },
            this.loadImg
        )
    }
    async getPalette() {
        const colors = await App.colorThief.getPalette(App.img, 5)
        const dominantColor = await App.colorThief.getColor(App.img)
        this.setState({ colors, dominantColor })
    }
    drawImage() {
        const canvas = document.querySelector('#img') as HTMLCanvasElement
        const ctx = canvas.getContext('2d')

        let width, height
        if (App.img.width > App.img.height) {
            width = 345
            height = (345 * App.img.height) / App.img.width
        } else {
            height = 345
            width = (345 * App.img.width) / App.img.height
        }
        canvas.width = width
        canvas.height = height
        ctx?.drawImage(App.img, 0, 0, width, height)
        this.setState({
            canvas: {
                w: width,
                h: height,
            },
        })
    }
    loadImg() {
        Loading.start()
        App.img.onload = () => {
            this.drawImage()
            this.getPalette()
            Loading.end()
        }
        App.img.src = this.state.imgSrc
    }
    drawMagnifier() {
        const canvas1 = document.querySelector(
            '#magnifier'
        ) as HTMLCanvasElement
        const ctx1 = canvas1.getContext('2d') as CanvasRenderingContext2D
        const canvas2 = document.querySelector('#img') as HTMLCanvasElement
        // const ctx2 = canvas2.getContext('2d') as CanvasRenderingContext2D
        ctx1.clearRect(0, 0, App.magnifier.w, App.magnifier.h)
        // 取消去锯齿
        ctx1.imageSmoothingEnabled = false
        const sw = App.magnifier.w / App.ratio
        const sh = App.magnifier.h / App.ratio
        const sx = Math.floor(this.state.location.x - sw / 2)
        const sy = Math.floor(this.state.location.y - sh / 2)
        ctx1.drawImage(
            canvas2 as CanvasImageSource,
            sx,
            sy,
            sw,
            sh,
            0,
            0,
            App.magnifier.w,
            App.magnifier.h
        )
        drawGrid(ctx1, '#eee', App.ratio, App.ratio)
        drawCenter(ctx1, '#ff0000', App.ratio, App.ratio)
    }
    clickPaletteItemHandler(item: number[]) {
        let content: string
        switch (this.state.colorMode) {
            case ColorMode.RGB:
                content = toRgb(item)
                break
            case ColorMode.HEX:
                content = toHex(item)
                break
            default:
                throw new Error('illegal color mode')
        }
        copyToClipbord(content)
        Toast(`已复制${content}到剪贴板`)
    }
    touchStartHandler(e: React.TouchEvent) {
        // 点击图像出现放大镜
        this.setState({ showMagnifier: true })
        const imgElement = document.querySelector('#img')
        const rect = imgElement?.getBoundingClientRect()
        const { top, left } = rect as DOMRect
        const { pageX, pageY } = e.touches[0]
        this.setState(
            {
                location: {
                    x: pageX - left,
                    y: pageY - top,
                },
            },
            this.drawMagnifier
        )
    }
    touchMoveHandler(e: React.TouchEvent) {
        const imgElement = document.querySelector('#img')
        const rect = imgElement?.getBoundingClientRect() as DOMRect
        const { top, left } = rect
        const { pageX, pageY } = e.touches[0]
        this.setState(
            {
                location: { x: pageX - left, y: pageY - top },
            },
            this.drawMagnifier
        )
    }
    touchEndHandler(e: React.TouchEvent) {
        const imgElement = document.querySelector('#img') as HTMLCanvasElement
        const ctx = imgElement.getContext('2d') as CanvasRenderingContext2D
        const color = ctx.getImageData(
            this.state.location.x,
            this.state.location.y,
            1,
            1
        ).data
        const [r, g, b] = color
        this.setState({
            selectColor: [r, g, b],
        })
    }
    render() {
        const paletteItems = this.state.colors.map(
            (item: number[], index: number) => {
                const rgb = toRgb(item)
                let backgroundStyle = {
                    backgroundColor: rgb,
                }

                return (
                    <li
                        key={index}
                        className="palette-item"
                        style={backgroundStyle}
                        onClick={this.clickPaletteItemHandler.bind(this, item)}
                    ></li>
                )
            }
        )
        const cardBackgroudStyle = {
            width: this.state.canvas.w,
            height: this.state.canvas.h,
            // backgroundColor: toRgb(this.state.dominantColor)
        }
        const magnifierStyle = {
            transform: `translate3d(${
                this.state.canvas.w - this.state.location.x < App.magnifier.w
                    ? this.state.location.x - App.magnifier.w
                    : this.state.location.x
            }px, ${
                this.state.canvas.h - this.state.location.y < App.magnifier.h
                    ? this.state.location.y - App.magnifier.h
                    : this.state.location.y
            }px, 0)`,
        }
        const selectColorBlockStyle = {
            backgroundColor: this.state.selectColor
                ? toRgb(this.state.selectColor)
                : 'none',
        }
        return (
            <div className="App">
                {this.state.selectColor && (
                    <div
                        className="select-color"
                        onClick={this.clickPaletteItemHandler.bind(
                            this,
                            this.state.selectColor
                        )}
                    >
                        <div
                            className="color-block"
                            style={selectColorBlockStyle}
                        ></div>
                        <span className="color-value">
                            {toHex(this.state.selectColor)}
                        </span>
                    </div>
                )}
                <div className="picture" style={cardBackgroudStyle}>
                    {this.state.imgSrc ? (
                        <canvas
                            id="img"
                            onTouchStart={this.touchStartHandler}
                            onTouchMove={this.touchMoveHandler}
                            onTouchEnd={this.touchEndHandler}
                        >
                            您的浏览器不支持canvas
                        </canvas>
                    ) : (
                        <span>欢迎使用Neon</span>
                    )}
                    {this.state.showMagnifier && (
                        <canvas
                            id="magnifier"
                            style={magnifierStyle}
                            width={App.magnifier.w}
                            height={App.magnifier.h}
                        >
                            您的浏览器不支持canvas
                        </canvas>
                    )}
                </div>

                {paletteItems.length > 0 && (
                    <ul className="palette">{paletteItems}</ul>
                )}

                <button className="button">
                    打开图片
                    <input
                        onChange={this.choose}
                        type="file"
                        accept="image/*"
                    />
                </button>
            </div>
        )
    }
}
