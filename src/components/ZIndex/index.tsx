export default abstract class ZIndex {
    static level = 999
    static gen() {
        return this.level++
    }
}
