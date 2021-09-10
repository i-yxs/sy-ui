<!--
* @description 表单配置
* @author yxs
!-->
<template>
    <view :class="[styleType, {fill: fill}]" class="sy-form-config">
        <view class="form-body">
            <template v-for="(group, index) in formItem">
                <view
                    :key="index"
                    class="group-wrap"
                >
                    <template v-for="item in group">
                        <template v-if="item.type">
                            <view
                                v-if="_getProps(item, 'visible')"
                                :key="item.name"
                                :class="[
                                    item.type,
                                    {
                                        cell: _getProps(item, 'cell'),
                                        await: _getProps(item, 'await'),
                                        column: _getProps(item, 'column'),
                                        readonly: _getProps(item, 'readonly')
                                    }
                                ]"
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
                                <view class="form-wrap">
                                    <view
                                        v-if="_getProps(item, 'showLabel')"
                                        :style="{
                                            width: labelWidth,
                                            padding: `${itemPadding}px 0`
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
                                                :rows="_getProps(item, 'rows')"
                                                :value="formData[item.name]"
                                                :type="_getProps(item, 'inputType')"
                                                :height="_getProps(item, 'height')"
                                                :password="item.password"
                                                :maxlength="_getProps(item, 'maxlength')"
                                                :confirm-type="item.confirmType"
                                                :show-password="item.showPassword"
                                                :show-word-limit="item.showWordLimit"
                                                :readonly="_getProps(item, 'readonly')"
                                                :disabled="item.disabled"
                                                :clearable="_getProps(item, 'clearable')"
                                                :money-mode="item.moneyMode"
                                                :quick-input="item.quickInput"
                                                :placeholder="_getProps(item, 'placeholder')"
                                                :icon-size="item.iconSize"
                                                :icon-color="item.iconColor"
                                                :prefix-icon="_getProps(item, 'prefixIcon')"
                                                :suffix-icon="_getProps(item, 'suffixIcon')"
                                                :native-props="item.nativeProps"
                                                @input="formData[item.name] = $event"
                                                @blur="_handleSendEvent(item, 'blur')"
                                                @focus="_handleSendEvent(item, 'focus')"
                                            />
                                        </template>
                                        <template v-else-if="item.type === 'inputCaptcha'">
                                            <sy-input-captcha
                                                :value="formData[item.name]"
                                                :type="_getProps(item, 'inputType')"
                                                :height="_getProps(item, 'height')"
                                                :cooling="item.cooling"
                                                :loading="item.loading"
                                                :readonly="_getProps(item, 'readonly')"
                                                :disabled="item.disabled"
                                                :duration="item.duration"
                                                :maxlength="_getProps(item, 'maxlength')"
                                                :clearable="_getProps(item, 'clearable')"
                                                :placeholder="_getProps(item, 'placeholder')"
                                                :icon-size="item.iconSize"
                                                :icon-color="item.iconColor"
                                                :prefix-icon="_getProps(item, 'prefixIcon')"
                                                @input="_setValue(item, $event)"
                                                @active="_handleSendEvent(item, 'active')"
                                                @cooled="_handleSendEvent(item, 'cooled')"
                                            />
                                        </template>
                                        <template v-else-if="item.type === 'switch'">
                                            <sy-switch
                                                :value="formData[item.name]"
                                                :readonly="_getProps(item, 'readonly')"
                                                :disabled="item.disabled"
                                                :true-value="_getProps(item, 'trueValue')"
                                                :true-label="_getProps(item, 'trueLabel')"
                                                :false-value="_getProps(item, 'falseValue')"
                                                :false-label="_getProps(item, 'falseLabel')"
                                                :placeholder="_getProps(item, 'placeholder')"
                                                @input="_setValue(item, $event)"
                                                @change="_handleSendEvent(item, 'change')"
                                            />
                                        </template>
                                        <template v-else-if="item.type === 'radio'">
                                            <sy-radio-group
                                                :value="formData[item.name]"
                                                :button="item.button"
                                                :options="item.options"
                                                :readonly="_getProps(item, 'readonly')"
                                                :disabled="item.disabled"
                                                :is-cancel="item.isCancel"
                                                :label-key="_getProps(item, 'labelKey')"
                                                :value-key="_getProps(item, 'valueKey')"
                                                :placeholder="_getProps(item, 'placeholder')"
                                                @input="_setValue(item, $event)"
                                                @change="_handleSendEvent(item, 'change')"
                                            />
                                        </template>
                                        <template v-else-if="item.type === 'checkbox'">
                                            <sy-checkbox-group
                                                :value="formData[item.name]"
                                                :button="item.button"
                                                :options="item.options"
                                                :readonly="_getProps(item, 'readonly')"
                                                :disabled="item.disabled"
                                                :label-key="_getProps(item, 'labelKey')"
                                                :value-key="_getProps(item, 'valueKey')"
                                                :placeholder="_getProps(item, 'placeholder')"
                                                @input="_setValue(item, $event)"
                                                @change="_handleSendEvent(item, 'change')"
                                            />
                                        </template>
                                        <template v-else-if="item.type === 'textarea'">
                                            <sy-textarea
                                                :value="formData[item.name]"
                                                :fixed="item.fixed"
                                                :height="_getProps(item, 'height')"
                                                :maxlength="_getProps(item, 'maxlength')"
                                                :show-word-limit="item.showWordLimit"
                                                :readonly="_getProps(item, 'readonly')"
                                                :disabled="item.disabled"
                                                :clearable="_getProps(item, 'clearable')"
                                                :placeholder="_getProps(item, 'placeholder')"
                                                :quick-input="item.quickInput"
                                                @input="_setValue(item, $event)"
                                            />
                                        </template>
                                        <template v-else-if="item.type === 'picker'">
                                            <sy-picker
                                                :rows="_getProps(item, 'rows')"
                                                :deep="_getProps(item, 'deep')"
                                                :value="formData[item.name]"
                                                :mode="item.mode"
                                                :start="item.start"
                                                :end="item.end"
                                                :height="_getProps(item, 'height')"
                                                :format="item.format"
                                                :options="item.options"
                                                :loading="item.loading"
                                                :readonly="_getProps(item, 'readonly')"
                                                :disabled="item.disabled"
                                                :emit-path="item.emitPath"
                                                :label-key="_getProps(item, 'labelKey')"
                                                :value-key="_getProps(item, 'valueKey')"
                                                :children-key="_getProps(item, 'childrenKey')"
                                                :clearable="_getProps(item, 'clearable')"
                                                :separator="_getProps(item, 'separator')"
                                                :placeholder="_getProps(item, 'placeholder')"
                                                :prefix-icon="_getProps(item, 'prefixIcon')"
                                                :suffix-icon="_getProps(item, 'suffixIcon')"
                                                :input-props="_getProps(item, 'inputProps')"
                                                :allow-create="item.allowCreate"
                                                @input="_setValue(item, $event)"
                                                @change="_handleSendEvent(item, 'change')"
                                                @cancel="_handleSendEvent(item, 'cancel')"
                                                @columnchange="_handleSendEvent(item, 'columnchange')"
                                            />
                                        </template>
                                        <template v-else-if="item.type === 'pickerUrl'">
                                            <view @click="_handlePickerUrlClick(item)">
                                                <sy-picker-input
                                                    :rows="_getProps(item, 'rows')"
                                                    :value="formData[item.name]"
                                                    :height="_getProps(item, 'height')"
                                                    :loading="item.loading"
                                                    :disabled="item.disabled"
                                                    :icon-size="item.iconSize"
                                                    :icon-color="item.iconColor"
                                                    :prefix-icon="_getProps(item, 'prefixIcon')"
                                                    :clearable="_getProps(item, 'clearable')"
                                                    :placeholder="_getProps(item, 'placeholder')"
                                                    :readonly="_getProps(item, 'readonly')"
                                                    suffix-icon="sy-ui-icon-arrow-right"
                                                />
                                            </view>
                                        </template>
                                        <template v-else-if="item.type === 'pickerTree'">
                                            <sy-picker-tree
                                                :rows="_getProps(item, 'rows')"
                                                :deep="_getProps(item, 'deep')"
                                                :value="formData[item.name]"
                                                :height="_getProps(item, 'height')"
                                                :loading="item.loading"
                                                :options="item.options"
                                                :emit-path="item.emitPath"
                                                :readonly="_getProps(item, 'readonly')"
                                                :disabled="item.disabled"
                                                :multiple="item.multiple"
                                                :accordion="item.accordion"
                                                :separator="_getProps(item, 'separator')"
                                                :label-key="_getProps(item, 'labelKey')"
                                                :value-key="_getProps(item, 'valueKey')"
                                                :children-key="_getProps(item, 'childrenKey')"
                                                :clearable="_getProps(item, 'clearable')"
                                                :placeholder="_getProps(item, 'placeholder')"
                                                :icon-size="item.iconSize"
                                                :icon-color="item.iconColor"
                                                :prefix-icon="_getProps(item, 'prefixIcon')"
                                                :suffix-icon="_getProps(item, 'suffixIcon')"
                                                :check-strictly="item.checkStrictly"
                                                @input="_setValue(item, $event)"
                                                @change="_handleSendEvent(item, 'change')"
                                                @cancel="_handleSendEvent(item, 'cancel')"
                                                @checkchange="_handleSendEvent(item, 'checkchange')"
                                            />
                                        </template>
                                        <template v-else-if="item.type === 'pickerDate'">
                                            <sy-picker-date
                                                :rows="_getProps(item, 'rows')"
                                                :mode="item.mode || 'radio'"
                                                :type="item.dateType || 'date'"
                                                :value="formData[item.name]"
                                                :marker="item.marker"
                                                :height="_getProps(item, 'height')"
                                                :loading="item.loading"
                                                :readonly="_getProps(item, 'readonly')"
                                                :disabled="item.disabled"
                                                :separator="_getProps(item, 'separator')"
                                                :clearable="_getProps(item, 'clearable')"
                                                :placeholder="_getProps(item, 'placeholder')"
                                                :format="item.format || 'YYYY-MM-DD'"
                                                :value-format="item.valueFormat || 'YYYY-MM-DD HH:mm:ss'"
                                                :default-time="item.defaultTime || ['00:00:00', '23:59:59']"
                                                :icon-size="item.iconSize"
                                                :icon-color="item.iconColor"
                                                :prefix-icon="_getProps(item, 'prefixIcon')"
                                                :suffix-icon="_getProps(item, 'suffixIcon')"
                                                :first-day-of-week="item.firstDayOfWeek || 1"
                                                @input="_setValue(item, $event)"
                                                @change="_handleSendEvent(item, 'change')"
                                                @yearChange="_handleSendEvent(item, 'yearChange')"
                                                @monthChange="_handleSendEvent(item, 'monthChange')"
                                                @dateChange="_handleSendEvent(item, 'dateChange')"
                                            />
                                        </template>
                                        <template v-else-if="item.type === 'pickerDateTime'">
                                            <sy-picker-date-time
                                                :rows="_getProps(item, 'rows')"
                                                :start="item.start"
                                                :end="item.end"
                                                :value="formData[item.name]"
                                                :marker="item.marker"
                                                :height="_getProps(item, 'height')"
                                                :format="item.format || 'YYYY-MM-DD HH:mm:ss'"
                                                :value-format="item.valueFormat || 'YYYY-MM-DD HH:mm:ss'"
                                                :loading="item.loading"
                                                :readonly="_getProps(item, 'readonly')"
                                                :disabled="item.disabled"
                                                :clearable="_getProps(item, 'clearable')"
                                                :placeholder="_getProps(item, 'placeholder')"
                                                :default-time="item.defaultTime"
                                                :icon-size="item.iconSize"
                                                :icon-color="item.iconColor"
                                                :prefix-icon="_getProps(item, 'prefixIcon')"
                                                :suffix-icon="_getProps(item, 'suffixIcon')"
                                                :first-day-of-week="item.firstDayOfWeek || 1"
                                                @input="_setValue(item, $event)"
                                                @change="_handleSendEvent(item, 'change')"
                                                @yearChange="_handleSendEvent(item, 'yearChange')"
                                                @monthChange="_handleSendEvent(item, 'monthChange')"
                                                @dateChange="_handleSendEvent(item, 'dateChange')"
                                            />
                                        </template>
                                        <template v-else-if="item.type === 'pickerLocation'">
                                            <sy-picker-location
                                                :rows="_getProps(item, 'rows')"
                                                :value="formData[item.name]"
                                                :height="_getProps(item, 'height')"
                                                :loading="item.loading"
                                                :readonly="_getProps(item, 'readonly')"
                                                :disabled="item.disabled"
                                                :latitude="_getExpandProps(item, 'latitude')"
                                                :longitude="_getExpandProps(item, 'longitude')"
                                                :clearable="_getProps(item, 'clearable')"
                                                :placeholder="_getProps(item, 'placeholder')"
                                                :transform="item.transform"
                                                :icon-size="item.iconSize"
                                                :icon-color="item.iconColor"
                                                :prefix-icon="_getProps(item, 'prefixIcon')"
                                                :suffix-icon="_getProps(item, 'suffixIcon')"
                                                @input="_setValue(item, $event)"
                                                @change="_handleLocationChange(item, $event)"
                                            />
                                        </template>
                                        <template v-else-if="item.type === 'upload'">
                                            <sy-upload
                                                :file-list="_getFileList(item)"
                                                :config="_getProps(item, 'config')"
                                                :readonly="_getProps(item, 'readonly')"
                                                :disabled="item.disabled"
                                                :placeholder="_getProps(item, 'placeholder')"
                                                :location-to-before-draw="item.locationToBeforeDraw"
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
                                                :value="formData[item.name]"
                                                :label="_getProps(item, 'label')"
                                                :style-type="item.styleType || 1"
                                                :config="_getProps(item, 'config')"
                                                :readonly="_getProps(item, 'readonly')"
                                                :disabled="item.disabled"
                                                :placeholder="_getProps(item, 'placeholder')"
                                                :location-to-before-draw="item.locationToBeforeDraw"
                                                @fail="_handleSendEvent(item, 'fail')"
                                                @choose="_handleSendEvent(item, 'choose')"
                                                @change="_handleUploadChange(item, $event)"
                                                @success="_handleUploadSuccess(item, $event)"
                                                @drawbefore="_handleUploadDrawbefore(item, $event)"
                                                @drawafter="_handleUploadDrawafter(item, $event)"
                                            />
                                        </template>
                                        <template v-else-if="item.type === 'pickerDistrict'">
                                            <sy-picker-district
                                                :rows="_getProps(item, 'rows')"
                                                :deep="_getProps(item, 'deep')"
                                                :type="item.pickerType || 'picker'"
                                                :value="formData[item.name]"
                                                :readonly="_getProps(item, 'readonly')"
                                                :disabled="item.disabled"
                                                :label-key="_getProps(item, 'labelKey')"
                                                :value-key="_getProps(item, 'valueKey')"
                                                :children-key="_getProps(item, 'childrenKey')"
                                                :icon-size="item.iconSize"
                                                :icon-color="item.iconColor"
                                                :prefix-icon="_getProps(item, 'prefixIcon')"
                                                :emit-path="item.emitPath"
                                                :separator="_getProps(item, 'separator')"
                                                :suffix-icon="_getProps(item, 'suffixIcon')"
                                                :clearable="_getProps(item, 'clearable')"
                                                :placeholder="_getProps(item, 'placeholder')"
                                                :multiple="item.multiple"
                                                :accordion="item.accordion"
                                                :check-strictly="item.checkStrictly"
                                                @input="_setValue(item, $event)"
                                                @change="_handleSendEvent(item, 'change')"
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
        <view v-if="button.length && styleType !== 'readonly'" class="form-button">
            <sy-button-group
                :options="button"
                :vertical="verticalButton"
                @click="_handleButtonActive"
            />
        </view>
    </view>
</template>
<script>

    import Form from './Form'
    import defaultValue from '@/components/sy-ui/utils/defaultValue'

    const WatermarkConfig = {
        show: false, // 是否绘制水印
        text: '', // 指定的绘制内容
        color: '#f00', // 水印文本的颜色
        sourceType: ['camera', 'album'], // 只有列表内的图片选择方式才绘制
        drawItem: [
            'date', // 绘制当前设备的日期和时间
            'location', // 绘制当前设备的经纬度
            'address' // 绘制当前设备的详细地址 todo...
        ]
    }

    export default {
        name: 'SyFormConfig',
        components: {
        },
        props: {
            // 是否铺满容器，使用内部滚动条
            fill: { type: Boolean, default: false },
            // 表单项
            item: { type: Array, default: () => [] },
            // 表单数据
            model: { type: Object, default: () => ({}) },
            // 按钮
            button: { type: Array, default: () => [] },
            // label的宽度
            labelWidth: String,
            // 样式类型 form, filter, readonly
            styleType: { type: String, default: 'form' },
            // 底部按钮的是否垂直排列
            verticalButton: { type: Boolean, default: false }
        },
        data() {
            return {
                formData: {},
                formItem: [],
                itemHeight: defaultValue.input.height,
                itemPadding: Math.ceil((uni.upx2px(defaultValue.input.height.replace(/[^0-9]+/g, '')) - uni.upx2px(40)) / 2)
            }
        },
        watch: {
            item: {
                deep: true,
                handler() {
                    this._updateConfig()
                }
            },
            model: {
                deep: true,
                handler() {
                    this.setFormData()
                }
            },
            formData: {
                deep: true,
                handler() {
                    this._updateConfig()
                }
            },
            styleType() {
                this._updateConfig()
            }
        },
        created() {
            this.$form = new Form(this)
            this._initialFormData = {}
            this._updateConfig()
            this.setFormData()
        },
        methods: {
            // 重置表单
            reset() {
                let formData = {}
                Object.keys(this.formData).forEach(key => {
                    formData[key] = this.isEmpty(this._initialFormData[key]) ? void 0 : this._initialFormData[key]
                })
                this.formData = formData
            },
            // 验证表单
            validate(isToast = true) {
                return this.$form.formItem.findIndex(item => {
                    return !this.$form.validate(item, isToast)
                }) === -1
            },
            // 验证表单项
            validateField(props, isToast = true) {
                props = Array.isArray(props) ? props : [props]
                return props.findIndex(prop => {
                    let item = this.$form.formItem.find(v => v.name === prop)
                    if (item) {
                        return !this.$form.validate(item, isToast)
                    }
                }) === -1
            },
            // 设置表单数据
            setFormData(data = this.model) {
                if (data instanceof Object) {
                    let formData = {}
                    this.$form.formItem.forEach(item => {
                        if (item.name) {
                            if (typeof item.expandProps === 'object') {
                                Object.keys(item.expandProps).forEach(key => {
                                    if (key in data) {
                                        formData[key] = data[key]
                                    }
                                })
                            }
                            formData[item.name] = data[item.name]
                        }
                    })
                    this.formData = formData
                    this._initialFormData = data
                }
                return this.formData
            },
            // 获取表单数据
            getFormData(validate = true) {
                return new Promise((resolve, reject) => {
                    if (validate) {
                        if (!this.validate()) {
                            return reject('验证失败')
                        }
                    }
                    let formData = JSON.parse(JSON.stringify(this.formData))
                    // 删除临时数据
                    this.$form.formItem.forEach(config => {
                        if (['upload', 'uploadCard'].includes(config.type)) {
                            if (formData[config.name]) {
                                if (this._getProps(config, 'monofile')) {
                                    delete formData[config.name].previewPath
                                } else if (Array.isArray(formData[config.name])) {
                                    // 删除预览用的源文件路径
                                    formData[config.name].forEach(item => {
                                        if (item.previewPath) {
                                            delete item.previewPath
                                        }
                                    })
                                }
                            }
                        }
                    })
                    resolve({
                        ...this._initialFormData,
                        ...formData
                    })
                })
            },
            // 设置value
            _setValue(item, value) {
                var name = ''
                switch (typeof item) {
                case 'string':
                    name = item
                    break
                case 'object':
                    name = item.name
                    break
                }
                this.formData[name] = value
            },
            // 获取指定名称的配置值
            _getProps(item, name) {
                return this.$form.getProps(item, name)
            },
            // 更新配置选项
            _updateConfig() {
                let formItem = []
                // 表单配置项二维转一维
                this.formItem = JSON.parse(JSON.stringify(this.item)).map(group => {
                    return group.map(data => {
                        formItem.push(data)
                        return data
                    })
                })
                this.$form.formItem = formItem
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
                this.$form._getAwait(item, true)
            },
            // 发送事件
            _handleSendEvent(item, name, data) {
                let params = {
                    name: item.name,
                    data: this.formData,
                    ...data
                }
                let eventName = item.type + name.substring(0, 1).toLocaleUpperCase() + name.substring(1)
                if (name === 'change') {
                    this.$nextTick(() => {
                        this.$emit('change', params)
                    })
                }
                this.$emit(eventName, params)
            },
            // 地址改变时触发
            _handleLocationChange(item, data) {
                let expandProps = item.expandProps
                if (expandProps) {
                    console.log(expandProps)
                    Object.keys(expandProps).forEach(key => {
                        this.formData[key] = data[expandProps[key]]
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
                item._uploading = data.uploading
                item._uploadfail = data.uploadfail
                this._handleSendEvent(item, 'change')
            },
            // 上传组件删除列表时触发
            _handleUploadRemove(item, index) {
                uni.showModal({
                    title: '提示',
                    content: '是否删除该文件？',
                    success: res => {
                        if (res.confirm) {
                            const value = this.formData[item.name]
                            if (this._getProps(item, 'monofile')) {
                                this.formData[item.name] = null
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
                let fileData = {
                    ...data.result,
                    previewPath: data.fileData.thumb
                }
                if (this._getProps(item, 'monofile')) {
                    // 单文件
                    this.$set(this.formData, item.name, fileData)
                } else {
                    // 多文件
                    let value = this.formData[item.name] || []
                    value.push(fileData)
                    this.$set(this.formData, item.name, value)
                }
                item._uploading = data.uploading
                item._uploadfail = data.uploadfail
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
                var watermark = Object.assign({}, item.wateramrk, WatermarkConfig)
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
                this.getFormData(data.validate !== false).then(formData => {
                    this.$emit('button', {
                        name: data.name,
                        data: formData
                    })
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
%sy-ui-border-bottom {
    position: relative;
    &::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        height: 1px;
        bottom: 0;
        transform: scaleY(.5);
        transform-origin: 0 100%;
        background: linear-gradient(90deg, #FFFFFF 0%,#EFEFF4 50%, #FFFFFF 100%);
        z-index: 1;
    }
}
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
        padding: 0 14rpx;
        .group-wrap {
            padding: 0 14rpx;
            background: #fff;
            border-radius: 30rpx;
            & + .group-wrap {
                margin-top: 26rpx;
            }
        }
        .form-item {
            @extend %sy-ui-border-bottom;
            &.uploadCard {
                padding: 14rpx;
            }
        }
        .form-button {
            padding: 30rpx 15rpx;
        }
    }
    &.filter {
        padding: 0 14rpx;
        .form-item {
            @extend %sy-ui-border-bottom;
            &.uploadCard {
                padding: 14rpx;
            }
        }
        .form-button {
            position: relative;
            padding: 60rpx 30rpx;
        }
    }
    &.readonly {
        padding: 0 14rpx;
        .form-item {
            @extend %sy-ui-border-bottom;
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
            width: 50%;
            box-sizing: border-box;
        }
        &.await{
            .form-input {
                pointer-events: none;
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
                font-size: 14rpx;
                color: #EE6A5C;
                margin-right: 12rpx;
            }
        }
    }
    .form-input{
        flex: 1;
    }
}
</style>

