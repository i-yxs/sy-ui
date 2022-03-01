/**
 * provide组件混入
 */
import { getProperty } from '../utils'

export default {
    props: {
        provideKey: String
    },
    data() {
        return {
            provideData: null
        }
    },
    watch: {
        provideKey: {
            immediate: true,
            handler() {
                this.unwatchProvide && this.unwatchProvide()
                this.unwatchProvide = this.$watch(() => {
                    return getProperty(this.provideComponent, this.provideKey)
                }, (value) => {
                    this.provideData = value
                }, {
                    deep: true,
                    immediate: true
                })
            }
        }
    },
    inject: ['provideComponent']
}
