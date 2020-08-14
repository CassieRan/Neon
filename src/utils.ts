/*
 * 复制到剪贴板
**/
export function setClipbord(content: string): void {
    const inputElement = document.createElement('input');
    inputElement.setAttribute('readonly', 'readonly');
    inputElement.setAttribute('value', content);
    document.body.appendChild(inputElement);
    // android
    inputElement.select()
    // ios
    inputElement.setSelectionRange(0, content.length);
    document.execCommand('copy')
    document.body.removeChild(inputElement);
}
export function toRgb(value: number[]): string  {
    return `rgb(${value.join(',')})`
}
export function toHex(value: number[]): string  {
    const newValue: string[] = value.map(item=>{
        const hex = item.toString(16)
        return hex.length<2?`0${hex}`: hex })
    return `#${newValue.join('')}`
}
export function isMobile(): boolean{
    const ua = navigator.userAgent
    return /mobile|phone|android|pad/i.test(ua)
}
