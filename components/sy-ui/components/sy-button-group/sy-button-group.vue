<!--
* @description 按钮组
* @author yxs
!-->
<template>
    <view
        :class="{vertical: vertical}"
        class="sy-button-group"
    >
        <sy-button
            v-for="(item, index) in options"
            :key="index"
            :text="item.text"
            :type="item.type"
            :plain="item.plain"
            :loading="item.loading"
            :disabled="item.disabled"
            :prefix-icon="item.prefixIcon"
            :suffix-icon="item.suffixIcon"
            :styles="item.styles"
            @click="handleActive(item, index)"
        />
    </view>
</template>
<script>
    export default {
        name: 'SyButtonGroup',
        props: {
            // 是否垂直布局
            vertical: { type: Boolean, default: false },
            // 数据源
            options: { type: Array, default: () => [] }
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
    &.vertical{
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
.vertical{
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
.vertical{
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

