import React from 'react'
import './App.css'
/// <reference path="./type.d.ts" />
import ColorThief from 'colorthief'
import { copyToClipbord, toRgb, toHex } from './utils'

interface Props {}
interface State {
    imgSrc: string
    colors: [number, number, number][]
    colorMode: ColorMode
    dominantColor: [number, number, number]
    location: Location
}
interface Location {
    x: number
    y: number
}
enum ColorMode {
    RGB = 'rgb',
    HEX = 'hex',
}

export default class App extends React.Component<Props, State> {
    static img = new Image()
    static colorThief = new ColorThief()
    static magnifier={
        w: 100,
        h: 100
    }
    static ratio ={
        x: 1,
        y: 1
    }
    constructor(props: Props) {
        super(props)
        this.state = {
            imgSrc: '',
            colors: [],
            colorMode: ColorMode.RGB,
            dominantColor: [255, 255, 255],
            location: { x: 0, y: 0 },
        }
        this.choose = this.choose.bind(this)
        this.getPalette = this.getPalette.bind(this)
        this.clickPaletteItemHandler = this.clickPaletteItemHandler.bind(this)
        this.touchStartHandler = this.touchStartHandler.bind(this)
        this.touchMoveHandler = this.touchMoveHandler.bind(this)
        this.drawImage = this.drawImage.bind(this)
        this.loadImg = this.loadImg.bind(this)
        this.drawMagnifier = this.drawMagnifier.bind(this)
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
            backgroundColor: toRgb(this.state.dominantColor),
        }
        const magnifierStyle = {
            transform: `translate3d(${this.state.location.x}px, ${this.state.location.y}px, 0)`,
        }
        return (
            <div className="App">
                <div
                    className="picture"
                    style={cardBackgroudStyle}
                    onTouchStart={this.touchStartHandler}
                    onTouchMove={this.touchMoveHandler}
                >
                    {this.state.imgSrc ? (
                        <canvas id="img"></canvas>
                    ) : (
                        <span>欢迎使用Neon</span>
                    )}
                    <canvas
                        id="magnifier"
                        style={magnifierStyle}
                        width={App.magnifier.w}
                        height={App.magnifier.h}
                    ></canvas>
                </div>

                {paletteItems.length > 0 && (
                    <ul className="palette">{paletteItems}</ul>
                )}

                <button className="button">
                    选择图片
                    <input
                        onChange={this.choose}
                        type="file"
                        accept="image/*"
                    />
                </button>
            </div>
        )
    }
    choose(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files
        if (!files || !files[0]) return
        this.setState(
            {
                imgSrc: files && files[0] && URL.createObjectURL(files[0]),
            },
            // this.getPalette
            this.loadImg
        )
    }
    async getPalette() {
        const colors = await App.colorThief.getPalette(App.img)
        const dominantColor = await App.colorThief.getColor(App.img)
        this.setState({ colors, dominantColor })
    }
    drawImage() {
        const canvas = document.querySelector('#img')
        const ctx = (canvas as HTMLCanvasElement).getContext('2d')

        let width, height
        if (App.img.width > App.img.height) {
            width = 345
            height = (345 * App.img.height) / App.img.width
        } else {
            height = 345
            width = (345 * App.img.width) / App.img.height
        }
        App.ratio.x = App.img.width/width
        App.ratio.y = App.img.height/height

        ;(canvas as HTMLCanvasElement).width = width
        ;(canvas as HTMLCanvasElement).height = height
        ctx?.drawImage(App.img, 0, 0, width, height)
    }
    loadImg() {
        App.img.onload = () => {
            this.drawImage()
            this.getPalette()
        }
        App.img.src = this.state.imgSrc
    }
    drawMagnifier() {
        const canvas1 = document.querySelector('#magnifier')
        const ctx1 = (canvas1 as HTMLCanvasElement).getContext('2d')
        const canvas2 = document.querySelector('#img')
        const ctx2 = (canvas2 as HTMLCanvasElement).getContext('2d')
        ctx1?.clearRect(0, 0, App.magnifier.w, App.magnifier.h)
        console.log(this.state.location,Math.floor(this.state.location.x*App.ratio.x),Math.floor(this.state.location.y*App.ratio.y))
        // console.log(ctx2?.getImageData(this.state.location.x, this.state.location.y, 1, 1))
        ctx1?.drawImage(App.img, Math.floor(this.state.location.x*App.ratio.x), Math.floor(this.state.location.y*App.ratio.y), 1,1, 0, 0, App.magnifier.w, App.magnifier.h)
        drawGrid(ctx1 as CanvasRenderingContext2D, `#eee`,10,10)

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
    }
    touchStartHandler(e: React.TouchEvent) {
        const pictureElement = document.querySelector('.picture')
        const rect = pictureElement?.getBoundingClientRect()
        const { top, left } = rect as DOMRect
        // console.log(top, left, rect)
        const { pageX, pageY } = e.touches[0]
        // console.log(pageX, pageY, e.touches[0])
        this.setState({
            location: { x: Math.ceil(pageX - left), y: Math.ceil(pageY - top) },
        },this.drawMagnifier)
    }
    touchMoveHandler(e: React.TouchEvent) {
        const pictureElement = document.querySelector('.picture')
        const rect = pictureElement?.getBoundingClientRect()
        const { top, left } = rect as DOMRect
        // console.log(top, left, rect)
        const { pageX, pageY } = e.touches[0]
        // console.log(pageX, pageY, e.touches[0])
        this.setState({
            location: { x: Math.ceil(pageX - left), y: Math.ceil(pageY - top) },
        })
    }
}

function drawGrid (context: CanvasRenderingContext2D, color: string, stepx: number, stepy:number) {
    context.strokeStyle = color
    context.lineWidth = 0.5
  
    for (let i = stepx + 0.5; i < context.canvas.width; i += stepx) {
      context.beginPath()
      context.moveTo(i, 0)
      context.lineTo(i, context.canvas.height)
      context.stroke()
    }
  
    for (let i = stepy + 0.5; i < context.canvas.height; i += stepy) {
      context.beginPath()
      context.moveTo(0, i)
      context.lineTo(context.canvas.width, i)
      context.stroke()
    }
  }
