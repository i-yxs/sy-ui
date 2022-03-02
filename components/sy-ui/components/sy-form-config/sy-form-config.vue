<!--
* @description 表单配置
* @author yxs
!-->
<template>
    <view :class="[styleType, {fill: fill}]" class="sy-form-config">
        <view class="form-body">
            <template v-for="(group, index1) in provideData.items">
                <view
                    :key="index1"
                    class="group-wrap"
                >
                    <template v-for="(item, index2) in group">
                        <template v-if="item.type">
                            <view
                                v-if="_getProps(item, 'visible')"
                                :key="item.name"
                                :class="[
                                    item.type,
                                    {
                                        cell: _getProps(item, 'cell'),
                                        first: index2 === 0,
                                        await: _getProps(item, 'await'),
                                        column: _getProps(item, 'column'),
                                        readonly: _getProps(item, 'readonly')
                                    }
                                ]"
                                :style="{
                                    width: _getProps(item, 'width')
                                }"
                                class="form-item"
                                @click="_handleItemClick(item)"
                            >
                                <view v-if="item.prependSlot" class="extend">
                                    <!-- #ifdef MP-WEIXIN-->
                                    <slot name="{{item.$orig.name}}:prepend" />
                                    <!-- #endif -->
                                    <!-- #ifndef MP-WEIXIN -->
                                    <slot :name="`${item.name}:prepend`" />
                                    <!-- #endif -->
                                </view>
                                <view class="form-wrap sy-ui-border-top">
                                    <view
                                        v-if="_getProps(item, 'showLabel')"
                                        :style="{
                                            width: labelWidth,
                                            padding: `${itemPadding}px 0`,
                                            alignItems: _getProps(item, 'labelAlign')
                                        }"
                                        :class="{
                                            colon: _getProps(item, 'showLabelColon'),
                                            required: _getProps(item, 'required'),
                                        }"
                                        class="form-label"
                                    >
                                        {{ _getProps(item, 'label') }}
                                    </view>
                                    <view
                                        :style="{
                                            padding: _getProps(item, 'padding'),
                                            textAlign: _getProps(item, 'align')
                                        }"
                                        class="form-input"
                                    >
                                        <template v-if="item.type === 'slot'">
                                            <!-- #ifdef MP-WEIXIN-->
                                            <slot name="{{item.$orig.name}}" />
                                            <!-- #endif -->
                                            <!-- #ifndef MP-WEIXIN -->
                                            <slot :name="`${item.name}`" />
                                            <!-- #endif -->
                                        </template>
                                        <template v-else-if="item.type === 'input'">
                                            <sy-input
                                                :props="_getComponentProps(item)"
                                                @input="_setValue(item, $event)"
                                                @blur="_handleSendEvent(item, 'blur')"
                                                @focus="_handleSendEvent(item, 'focus')"
                                            />
                                        </template>
                                        <template v-else-if="item.type === 'inputRange'">
                                            <sy-input-range
                                                :props="_getComponentProps(item)"
                                                provide-key="formData"
                                                @input="_setValue(item, $event)"
                                            />
                                        </template>
                                        <template v-else-if="item.type === 'inputCaptcha'">
                                            <sy-input-captcha
                                                :props="_getComponentProps(item)"
                                                @input="_setValue(item, $event)"
                                                @active="_handleSendEvent(item, 'active')"
                                                @cooled="_handleSendEvent(item, 'cooled')"
                                            />
                                        </template>
                                        <template v-else-if="item.type === 'switch'">
                                            <sy-switch
                                                :props="_getComponentProps(item)"
                                                @input="_setValue(item, $event)"
                                                @change="_handleSendEvent(item, 'change')"
                                            />
                                        </template>
                                        <template v-else-if="item.type === 'radio'">
                                            <sy-radio-group
                                                :props="_getComponentProps(item)"
                                                @input="_setValue(item, $event)"
                                                @change="_handleSendEvent(item, 'change')"
                                            />
                                        </template>
                                        <template v-else-if="item.type === 'checkbox'">
                                            <sy-checkbox-group
                                                :props="_getComponentProps(item)"
                                                @input="_setValue(item, $event)"
                                                @change="_handleSendEvent(item, 'change')"
                                            />
                                        </template>
                                        <template v-else-if="item.type === 'textarea'">
                                            <sy-textarea
                                                :props="_getComponentProps(item)"
                                                @input="_setValue(item, $event)"
                                            />
                                        </template>
                                        <template v-else-if="item.type === 'picker'">
                                            <sy-picker
                                                :props="_getComponentProps(item)"
                                                :provide-key="`provideData.items.${index1}.${index2}.props.options`"
                                                @input="_setValue(item, $event)"
                                                @change="_handleSendEvent(item, 'change')"
                                                @cancel="_handleSendEvent(item, 'cancel')"
                                                @columnchange="_handleSendEvent(item, 'columnchange')"
                                            />
                                        </template>
                                        <template v-else-if="item.type === 'pickerUrl'">
                                            <sy-picker-input
                                                :props="_getComponentProps(item)"
                                                @click="_handlePickerUrlClick(item)"
                                            />
                                        </template>
                                        <template v-else-if="item.type === 'pickerTree'">
                                            <sy-picker-tree
                                                :props="_getComponentProps(item)"
                                                :provide-key="`provideData.items.${index1}.${index2}.props.options`"
                                                @input="_setValue(item, $event)"
                                                @change="_handleSendEvent(item, 'change')"
                                                @cancel="_handleSendEvent(item, 'cancel')"
                                                @checkchange="_handleSendEvent(item, 'checkchange')"
                                            />
                                        </template>
                                        <template v-else-if="item.type === 'pickerDate'">
                                            <sy-picker-date
                                                :props="_getComponentProps(item)"
                                                provide-key="formData"
                                                @input="_setValue(item, $event)"
                                                @change="_handleSendEvent(item, 'change')"
                                            />
                                        </template>
                                        <template v-else-if="item.type === 'pickerDateTime'">
                                            <sy-picker-date-time
                                                :props="_getComponentProps(item)"
                                                @input="_setValue(item, $event)"
                                                @change="_handleSendEvent(item, 'change')"
                                                @yearChange="_handleSendEvent(item, 'yearChange')"
                                                @monthChange="_handleSendEvent(item, 'monthChange')"
                                                @dateChange="_handleSendEvent(item, 'dateChange')"
                                            />
                                        </template>
                                        <template v-else-if="item.type === 'pickerLocation'">
                                            <sy-picker-location
                                                :props="_getComponentProps(item)"
                                                @input="_setValue(item, $event)"
                                                @change="_handleLocationChange(item, $event)"
                                            />
                                        </template>
                                        <template v-else-if="item.type === 'pickerDistrict'">
                                            <sy-picker-district
                                                :props="_getComponentProps(item)"
                                                @input="_setValue(item, $event)"
                                                @change="_handleLocationChange(item, $event)"
                                            />
                                        </template>
                                        <template v-else-if="item.type === 'upload'">
                                            <sy-upload
                                                :file-list="_getFileList(item)"
                                                :props="_getComponentProps(item)"
                                                round
                                                @fail="_handleSendEvent(item, 'fail')"
                                                @choose="_handleSendEvent(item, 'choose')"
                                                @change="_handleUploadChange(item, $event)"
                                                @remove="_handleUploadRemove(item, $event)"
                                                @success="_handleUploadSuccess(item, $event)"
                                                @drawbefore="_handleUploadDrawbefore(item, $event)"
                                                @drawafter="_handleUploadDrawafter(item, $event)"
                                            />
                                        </template>
                                        <template v-else-if="item.type === 'uploadCard'">
                                            <sy-upload-card
                                                :props="_getComponentProps(item)"
                                                @fail="_handleSendEvent(item, 'fail')"
                                                @choose="_handleSendEvent(item, 'choose')"
                                                @change="_handleUploadChange(item, $event)"
                                                @success="_handleUploadSuccess(item, $event)"
                                                @drawbefore="_handleUploadDrawbefore(item, $event)"
                                                @drawafter="_handleUploadDrawafter(item, $event)"
                                            />
                                        </template>
                                    </view>
                                </view>
                                <view v-if="item.appendSlot" class="extend">
                                    <!-- #ifdef MP-WEIXIN-->
                                    <slot name="{{item.$orig.name}}:append" />
                                    <!-- #endif -->
                                    <!-- #ifndef MP-WEIXIN -->
                                    <slot :name="`${item.name}:append`" />
                                    <!-- #endif -->
                                </view>
                            </view>
                        </template>
                        <template v-else>
                            <slot :item="item"/>
                        </template>
                    </template>
                </view>
            </template>
        </view>
        <view v-if="buttonVisible" class="form-button sy-ui-border-top">
            <sy-button-group
                :column="buttonColumn"
                :options="provideData.button"
                @click="_handleButtonActive"
            />
            <sy-safe-area-inset v-if="fill"/>
        </view>
    </view>
</template>
<script>
    // 工具
    import Form from './Form'
    import inputProps from '../sy-input/props'
    import { getProps } from '../../mixin/props'
    import mixinProvide from '../../mixin/provideComponent'
    // 组件简写名称枚举
    const simpleName = {
        'input': 'SyInput',
        'inputRange': 'SyInputRange',
        'inputCaptcha': 'SyInputCaptcha',
        'switch': 'SySwitch',
        'radio': 'SyRadioGroup',
        'checkbox': 'SyCheckboxGroup',
        'textarea': 'SyTextarea',
        'picker': 'SyPicker',
        'pickerUrl': 'SyPickerUrl',
        'pickerTree': 'SyPickerTree',
        'pickerDate': 'SyPickerDate',
        'pickerDateTime': 'SyPickerDateTime',
        'pickerLocation': 'SyPickerLocation',
        'pickerDistrict': 'SyPickerDistrict',
        'upload': 'SyUpload',
        'uploadCard': 'SyUploadCard'
    }
    /**
     * provideData 数据格式：
     {
        data: {...}, // 表单数据
        items: [...], // 表单配置项
        button: [...] // 表单按钮
     }
     */

    export default {
        name: 'SyFormConfig',
        mixins: [mixinProvide],
        props: {
            fill: Boolean, // 是否铺满容器，使用内部滚动条
            styleType: { type: String, default: 'form' }, // 样式类型 form, filter, readonly
            provideKey: { default: 'formConfig' }, // provide 数据key
            labelWidth: String, // label的宽度
            buttonColumn: Boolean// 底部按钮是否纵列显示
        },
        data() {
            return {
                formItem: [],
                itemHeight: inputProps.height.default,
                itemPadding: Math.ceil((uni.upx2px(inputProps.height.default.replace(/[^0-9]+/g, '')) - uni.upx2px(40)) / 2)
            }
        },
        provide() {
            return {
                provideComponent: this
            }
        },
        computed: {
            formData() {
                return this.provideData.data
            },
            formButton() {
                let button = this.provideData.button
                return button === false ? [] : button
            },
            buttonVisible() {
                return this.formButton.length && this.styleType !== 'readonly'
            }
        },
        created() {
            this.$form = new Form(this)
        },
        methods: {
            // 重置表单
            reset() {
                this.$form.reset()
            },
            // 验证表单
            validate(isToast = true) {
                return this.$form.items.findIndex(item => {
                    return !this.$form.validate(item, isToast)
                }) === -1
            },
            // 验证表单项
            validateField(props, isToast = true) {
                props = Array.isArray(props) ? props : [props]
                return props.findIndex(prop => {
                    let item = this.$form.items.find(v => v.name === prop)
                    if (item) {
                        return !this.$form.validate(item, isToast)
                    }
                }) === -1
            },
            // 设置value
            _setValue(item, value) {
                this.$set(this.formData, item.name, value)
            },
            // 获取指定名称的配置值
            _getProps(item, name) {
                return this.$form.getProps(item, name)
            },
            // 获取组件props
            _getComponentProps(item) {
                let props = {
                    value: this.provideData.data[item.name]
                }
                Object.keys(getProps({
                    name: simpleName[item.type],
                    isExclude: true
                })).forEach(key => {
                    let value = this.$form.getProps(item, 'props.' + key)
                    if (value !== void 0) {
                        props[key] = value
                    }
                })
                return props
            },
            // 获取上传组件的文件列表
            _getFileList(item) {
                let fileList = this.formData[item.name]
                if (this.isEmpty(fileList)) {
                    return []
                }
                if (this._getProps(item, 'monofile')) {
                    return [fileList]
                } else if (Array.isArray(fileList)) {
                    return fileList
                }
            },
            // 获取扩充数据
            _getExpandProps(item, name) {
                var expandProps = item.expandProps
                if (expandProps) {
                    var key = Object.keys(expandProps).find(key => expandProps[key] === name)
                    if (key) {
                        return this.formData[key]
                    }
                }
            },
            // 点击表单项时触发
            _handleItemClick(item) {
                this.$form._get_await(item, true)
            },
            // 发送事件
            _handleSendEvent(item, name, data) {
                let params = {
                    ...data,
                    name: item.name
                }
                if (name === 'change') {
                    this.$nextTick(() => {
                        this.$emit('change', params)
                    })
                }
                this.$emit(item.type + name.substring(0, 1).toLocaleUpperCase() + name.substring(1), params)
            },
            // 地址改变时触发
            _handleLocationChange(item, data) {
                let expandProps = item.expandProps
                if (expandProps) {
                    console.log(expandProps)
                    Object.keys(expandProps).forEach(key => {
                        this.$set(this.formData, key, data[expandProps[key]])
                    })
                }
                this._handleSendEvent(item, 'change')
            },
            // 点击pickerUrl时触发
            _handlePickerUrlClick(item) {
                if (item.url) {
                    uni.navigateTo({
                        url: item.url
                    })
                }
                this._handleSendEvent(item, 'click')
            },
            // 上传组件内部改变时触发
            _handleUploadChange(item, data) {
                this.$form.updateStatus[item.name] = {
                    uploading: data.uploading,
                    uploadfail: data.uploadfail
                }
                this._handleSendEvent(item, 'change')
            },
            // 上传组件删除列表时触发
            _handleUploadRemove(item, index) {
                uni.showModal({
                    title: '提示',
                    content: '是否删除该文件？',
                    success: ({ confirm }) => {
                        if (confirm) {
                            let value = this.formData[item.name]
                            if (this._getProps(item, 'monofile')) {
                                this._setValue(item, null)
                            } else if (Array.isArray(value)) {
                                value.splice(index, 1)
                            }
                            this._handleSendEvent(item, 'remove')
                        }
                    }
                })
            },
            // 上传组件上传成功时触发
            _handleUploadSuccess(item, data) {
                let fileData = data.result
                if (this._getProps(item, 'monofile')) {
                    // 单文件
                    this.$set(this.formData, item.name, fileData)
                } else {
                    // 多文件
                    let value = this.formData[item.name] || []
                    value.push(fileData)
                    this.$set(this.formData, item.name, value)
                }
                this.$form.updateStatus[item.name] = {
                    uploading: data.uploading,
                    uploadfail: data.uploadfail
                }
                this._handleSendEvent(item, 'success')
            },
            // 上传组件图片压缩绘制前触发
            _handleUploadDrawbefore(item, drawData) {
                this._handleSendEvent(item, 'drawbefore', {
                    data: drawData
                })
            },
            // 上传组件图片压缩绘制后触发
            _handleUploadDrawafter(item, drawData) {
                let watermark = {
                    show: false, // 是否绘制水印
                    text: '', // 指定的绘制内容
                    color: '#f00', // 水印文本的颜色
                    sourceType: ['camera', 'album'], // 只有列表内的图片选择方式才绘制
                    drawItem: [
                        'date', // 绘制当前设备的日期和时间
                        'location', // 绘制当前设备的经纬度
                        'address' // 绘制当前设备的详细地址 todo...
                    ],
                    ...item.wateramrk
                }
                // 是否在图片上绘制水印
                if (watermark.show) {
                    if (watermark.sourceType.indexOf(drawData.source) > -1) {
                        drawData.context2d.setTextBaseline('top')
                        drawData.context2d.setFillStyle(watermark.color)
                        drawData.context2d.setFontSize(16 / drawData.dpr)
                        // 绘制时间
                        if (watermark.drawItem.indexOf('date') > -1) {
                            const date = new Date()
                            drawData.context2d.fillText(
                                `拍摄时间：${date.getFullYear()}-${date.getMonth() +
                                    1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
                                20 / drawData.dpr,
                                20 / drawData.dpr
                            )
                        }
                        // 绘制经纬度
                        if (watermark.drawItem.indexOf('location') > -1 && drawData.otherData.location) {
                            drawData.context2d.fillText(
                                `经度：${drawData.otherData.location.longitude}`,
                                20 / drawData.dpr,
                                45 / drawData.dpr
                            )
                            drawData.context2d.fillText(
                                `纬度：${drawData.otherData.location.latitude}`,
                                20 / drawData.dpr,
                                70 / drawData.dpr
                            )
                        }
                    }
                }
                this._handleSendEvent(item, 'drawafter', {
                    data: drawData
                })
            },
            // 点击按钮时触发
            _handleButtonActive({ data }) {
                if (data.reset || data.name === 'cancel') this.reset()
                if ((data.validate || data.name === 'submit') && !this.validate()) return
                this.$emit('button', data.name)
            }
        }
    }
</script>
<style lang="scss" scoped>
.sy-form-config{
    font-size: 28rpx;
    line-height: 40rpx;
    &.fill {
        display: flex;
        flex-direction: column;
        height: 100%;
        box-sizing: border-box;
        overflow: auto;
        .form-body {
            flex: 1;
        }
    }
    &.form {
        padding: 0 28rpx;
        .group-wrap {
            padding: 0 14rpx;
            background: #fff;
            border-radius: 30rpx;
            & + .group-wrap {
                margin-top: 26rpx;
            }
        }
        .form-item {
            &.uploadCard {
                padding: 14rpx;
            }
        }
    }
    &.filter {
        padding: 0 14rpx;
        .form-item {
            &.uploadCard {
                padding: 14rpx;
            }
        }
    }
    &.readonly {
        padding: 0 28rpx;
        .group-wrap {
            padding: 0 14rpx;
            background: #fff;
            border-radius: 30rpx;
            & + .group-wrap {
                margin-top: 26rpx;
            }
        }
        .form-item {
            &.uploadCard {
                padding: 14rpx;
            }
        }
        .form-button {
            padding: 30rpx 15rpx 60rpx;
        }
    }
    .form-item {
        display: flex;
        padding: 0 14rpx;
        &.cell {
            display: inline-flex;
            vertical-align: top;
            box-sizing: border-box;
        }
        &.await{
            .form-input {
                pointer-events: none;
            }
        }
        &.first {
            .form-wrap {
                &::before {
                    display: none;
                }
            }
        }
        &.column{
            flex-direction: column;
            &.upload,
            &.textarea {
                .form-label + .form-input {
                    padding: 0 !important;
                }
            }
            .form-wrap{
                flex-direction: column;
            }
            .form-label{
                height: auto !important;
                padding-top: 20rpx;
                padding-bottom: 0;
            }
        }
        &.readonly {
            &.upload {
                .form-input {
                    display: flex;
                    align-items: center;
                }
            }
        }
        .label-text {
            width: auto!important;;
        }
    }
    .form-wrap{
        flex: 1;
        display: flex;
        position: relative;
        padding: 10rpx 0;
    }
    .form-label{
        display: flex;
        margin-right: 20rpx;
        &.colon {
            margin-right: 0;
            &::after {
                content: '：';
            }
        }
        &.required{
            &::before{
                content: '\e669';
                width: 14rpx;
                display: inline-block;
                font-family: 'sy-ui-iconfont';
                font-size: 16rpx;
                color: #EE6A5C;
                margin-right: 12rpx;
            }
        }
    }
    .form-input{
        flex: 1;
    }
    .form-button {
        padding: 28rpx 14rpx;
        &::before {
            left: 14rpx;
            right: 14rpx;
        }
    }
}
</style>

