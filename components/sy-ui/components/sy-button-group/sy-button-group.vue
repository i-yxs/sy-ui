<!--
* @description 按钮组
* @author yxs
!-->
<template>
    <view
        v-if="__props.options.length > 0"
        :class="{column: __props.column}"
        class="sy-button-group"
    >
        <sy-button
            v-for="(item, index) in options_"
            :key="index"
            :props="item"
            @click="handleActive(item, index)"
        />
    </view>
</template>
<script>

    import store from '@/store'
    import props from './props'
    import { getProperty } from '../../utils'
    import mixinProps from '../../mixin/props'
    import mixinProvide from '../../mixin/provideComponent'

    export default {
        name: 'SyButtonGroup',
        mixins: [mixinProps, mixinProvide],
        props,
        computed: {
            options_() {
                let options = this.isEmpty(this.provideData) ? this.__props.options : this.provideData
                if (typeof options === 'string') {
                    options = getProperty(store.state.baseData, options)
                }
                options = Array.isArray(options) ? options : []
                return options
            }
        },
        methods: {
            handleActive(data, index) {
                let params = { data, index }
                if (data.name) {
                    this.$emit(data.name, params)
                }
                this.$emit('click', params)
            }
        }
    }
</script>
<style lang="scss" scoped>
.sy-button-group{
    display: flex;
    align-items: center;
    &.column{
        align-items: initial;
        flex-direction: column;
    }
}
/* #ifdef MP-WEIXIN */
/deep/{
    sy-button{
        flex: 1;
        &  + sy-button {
            margin-left: 30rpx;
        }
    }
}
.column{
    /deep/{
        sy-button + sy-button{
            margin-top: 30rpx;
            margin-left: 0;
        }
    }
}
/* #endif */
/* #ifndef MP-WEIXIN */
/deep/{
    .sy-button{
        flex: 1;
        &  + .sy-button{
            margin-left: 30rpx;
        }
    }
}
.column{
    align-items: initial;
    flex-direction: column;
    /deep/{
        .sy-button{
            flex: initial;
        }
        .sy-button + .sy-button{
            margin-top: 30rpx;
            margin-left: 0;
        }
    }
}
/* #endif */
</style>

