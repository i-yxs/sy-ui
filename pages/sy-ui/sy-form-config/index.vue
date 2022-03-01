<template>
    <view class="content">
        <view class="tabs-wrap">
            <view class="body flex">
                <view
                    v-for="item in tabsData"
                    :key="item.value"
                    :class="{active: tabsActive === item.value}"
                    class="item"
                    @click="handleTabsChange(item)"
                >
                    <view class="text">{{ item.label }}</view>
                    <view class="iconfont iconbanyuan"/>
                </view>
            </view>
        </view>
        <view style="height: 124rpx"/>
        <view class="body-wrap">
            <view class="wrap">
                <sy-form-config
                    :style-type="tabsActive"
                    @inputCaptchaActive="handleInputCaptchaActive"
                    @inputCaptchaCooled="handleInputCaptchaCooled"
                    @pickerTreeCheckChange="handlePickerTreeChange"
                    @button="handleSubmit"
                >
                    <template v-slot="{item}">
                        <view class="slot-scope form-config-border">
                            {{ item.content }}
                        </view>
                    </template>
                    <template slot="slot">
                        如果没有能满足需求的组件，可以配置type=slot来获得一个自定义插槽，
                        并且保留除了组件特有的配置项以外的所有配置项（如需要更灵活的自定义插槽，请使用作用域插槽配置）
                    </template>
                </sy-form-config>
            </view>
        </view>
    </view>
</template>
<script>
    import province from './province'

    const formConfigProps = {
        captcha: {
            type: 'inputCaptcha',
            name: 'captcha',
            label: '验证码',
            premise: [
                // 指定表单项验证通过才能操作
                { type: 'handle', name: 'phone', message: '请先输入手机号码' }
            ],
            props: {
                cooling: false,
                duration: 60
            }
        },
        districts: {
            type: 'picker',
            name: 'districts',
            label: '联动选择器',
            props: {
                deep: 4,
                mode: 'linkage',
                placeholder: '请选择所属区域',
                emitPath: true,
                options: []
            }
        },
        districtId: {
            type: 'pickerTree',
            name: 'districtId',
            label: '树状选择器',
            props: {
                loading: false,
                emitPath: true,
                options: []
            }
        }
    }

    export default {
        props: {},
        data() {
            return {
                tabsData: [
                    { value: 'form', label: '表单样式' },
                    { value: 'filter', label: '筛选样式' },
                    { value: 'readonly', label: '详情样式' }
                ],
                tabsActive: 'form',
                formConfig: {
                    data: {
                        name: '',
                        type: '',
                        phone: '12312341234',
                        districtId: [39875],
                        address: '',
                        remark: '',
                        files: []
                    },
                    items: [
                        [
                            {
                                type: 'uploadCard',
                                name: 'avatarFile',
                                props: {
                                    label: '请上传个人头像/个人正面照为佳',
                                    sourceType: ['album', 'camera']
                                }
                            },
                            {
                                cell: true,
                                type: 'uploadCard',
                                name: 'idCardFrontFile',
                                width: '50%',
                                props: {
                                    label: '身份证正面',
                                    styleType: 2,
                                    sourceType: ['album', 'camera']
                                }
                            },
                            {
                                cell: true,
                                type: 'uploadCard',
                                name: 'idCardBackFile',
                                width: '50%',
                                props: {
                                    label: '身份证反面',
                                    styleType: 2,
                                    sourceType: ['album', 'camera']
                                }
                            },
                            {
                                type: 'slot',
                                name: 'slot',
                                align: 'left',
                                label: '自定义插槽'
                            },
                            {
                                content: '未配置type时，会生成一个作用域插槽，并把该配置项当做参数传递给父级作用域，注意：v-slot="{item}"必须定义在template上'
                            },
                            {
                                content: '我是作用域插槽二号'
                            }
                        ],
                        [
                            {
                                type: 'input',
                                name: 'name',
                                label: '输入框',
                                props: {
                                    rows: 4
                                },
                                validate: [
                                    { required: true, message: '请输入手机号码' },
                                    {
                                        validator: (rule, value, item) => {
                                            console.log('验证规则：', rule)
                                            console.log('表单value：', value)
                                            console.log('表单配置项：', item)
                                            console.log('上下文：', this)
                                            return false
                                        },
                                        message: '自定义验证方法'
                                    },
                                    { type: 'phone', message: '请输入正确的手机号码' }
                                ]
                            },
                            {
                                type: 'input',
                                name: 'phone',
                                label: '手机号码',
                                props: {
                                    type: 'number'
                                },
                                validate: [
                                    { required: true, message: '请输入手机号码' },
                                    { type: 'phone', message: '请输入正确的手机号码' }
                                ]
                            },
                            formConfigProps.captcha,
                            {
                                type: 'switch',
                                name: 'switch',
                                label: '开关',
                                props: {
                                    options: [
                                        { label: '开', value: 1 },
                                        { label: '关', value: 0 }
                                    ]
                                }
                            },
                            {
                                type: 'radio',
                                name: 'sex',
                                label: '单选框',
                                props: {
                                    options: [
                                        { label: '男', value: 1 },
                                        { label: '女', value: 0 }
                                    ]
                                }
                            },
                            {
                                type: 'checkbox',
                                name: 'hobby',
                                label: '多选框',
                                props: {
                                    options: [
                                        { label: '男', value: 1 },
                                        { label: '女', value: 0 }
                                    ]
                                }
                            },
                            {
                                type: 'picker',
                                name: 'type2',
                                label: '选择器',
                                props: {
                                    mode: 'selector',
                                    options: [
                                        { label: '类型1', value: 1 },
                                        { label: '类型2', value: 2 },
                                        { label: '类型3', value: 3 }
                                    ],
                                    labelKey: 'label',
                                    valueKey: 'value',
                                    icon: 'sy-ui-icon-star-fill'
                                }
                            },
                            {
                                type: 'picker',
                                name: 'picker:date',
                                label: '日期选择器',
                                props: {
                                    mode: 'date'
                                }
                            },
                            {
                                type: 'picker',
                                name: 'picker:time',
                                label: '时间选择器',
                                props: {
                                    mode: 'time'
                                }
                            },
                            {
                                type: 'pickerDate',
                                name: 'pickerDate',
                                label: '日历选择器'
                            },
                            {
                                type: 'pickerDateTime',
                                name: 'pickerDateTime',
                                label: '日期时间选择器'
                            },
                            formConfigProps.districts,
                            formConfigProps.districtId,
                            {
                                type: 'pickerLocation',
                                name: 'address',
                                label: '地址选择器',
                                expandProps: {
                                    lat: 'latitude',
                                    lng: 'longitude'
                                }
                            },
                            {
                                type: 'textarea',
                                name: 'remark',
                                label: '多行文本框'
                            },
                            {
                                type: 'upload',
                                name: 'files'
                            },
                            {
                                type: 'upload',
                                name: 'files2',
                                readonly: true
                            },
                            {
                                type: 'upload',
                                name: 'files3',
                                readonly: true
                            },
                            {
                                type: 'upload',
                                name: 'files4'
                            }
                        ]
                    ],
                    button: [
                        { text: '取消', name: 'cancel' },
                        { text: '确定', type: 'primary', name: 'submit', validate: true }
                    ]
                }
            }
        },
        watch: {
        },
        provide() {
            return {
                provideComponent: this
            }
        },
        onLoad(param) {
            // 区域数据
            formConfigProps.districtId.props.loading = true
            setTimeout(() => {
                formConfigProps.districts.props.options = province
                formConfigProps.districtId.props.options = province
                formConfigProps.districtId.props.loading = false
            }, 300)
        },
        mounted() {
        },
        methods: {
            // 选项卡切换时触发
            handleTabsChange(data) {
                this.tabsActive = data.value
            },
            handleSubmit(data) {
                console.log(data)
            },
            handleInputCaptchaActive() {
                formConfigProps.captcha.props.cooling = true
            },
            handleInputCaptchaCooled() {
                formConfigProps.captcha.props.cooling = false
            },
            handlePickerTreeChange(res) {
                console.log(res)
            }
        }
    }
</script>
<style lang="scss" scoped>
.content{
    background: #d8d8d8;
    .tabs-wrap {
        position: fixed;
        top: var(--window-top);
        left: 0;
        right: 0;
        height: 72rpx;
        z-index: 99;
        padding: 20rpx 30rpx 0;
        background: $APP_COLOR;
        border-radius: 0 0 40rpx 40rpx;
        .body {
            background: #fff;
            height: 104rpx;
            border-radius: 40rpx;
            box-shadow: 0 4rpx 60rpx 0 rgba(180, 180, 180, 0.24);
        }
        .item {
            position: relative;
            flex: 1;
            color: #666;
            text-align: center;
            &.active {
                color: $APP_COLOR;
                .text {
                    font-weight: bold;
                }
                .iconfont {
                    opacity: 1;
                }
            }
        }
        .text {
            font-size: 32rpx;
        }
        .iconfont {
            position: absolute;
            left: 50%;
            bottom: -4rpx;
            transform: translate3d(-50%, 100%, 0);
            opacity: 0;
            font-size: 20rpx;
            line-height: 1em;
        }
    }
    .body-wrap {
        padding: 28rpx 0;
    }
    .slot-scope{
        padding: 30rpx;
        display: block;
        color: #333;
        font-size: 26rpx;
        margin-left: 14rpx;
        font-weight: bold;
        border-left: solid 6rpx #ddd;
    }
}
</style>
