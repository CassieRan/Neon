declare module 'colorthief' {
    export default class ColorThief {
        getColor: (img: HTMLImageElement, quality?:number)=>Promise
        getPalette: (img: HTMLImageElement, colorCount?: number, quality?:number)=>Promise
    }
}