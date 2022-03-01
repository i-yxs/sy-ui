/**
 * 表单类
 */
import defaultConfig from './defaultConfig'
import { isEmpty, getProperty } from '../../utils'

// 表单验证规则类型
const validateRule = {
    'number': (value) => {
        return /^\d+$/.test(value)
    },
    'phone': (value) => {
        return /^[1][1-9][0-9]{9}$/.test(value)
    },
    'email': (value) => {
        return /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(value)
    },
    'idcard': (value) => {
        return /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(value)
    }
}

class Form {
    constructor($vue) {
        // vue实例
        this.$vue = $vue
        // 一维表单配置项
        this.items = []
        // 记录文件上传的状态
        this.updateStatus = {}
        // watch表单项变化，二维转一维
        $vue.$watch('provideData.items', () => {
            this.items = this.$vue.provideData.items.reduce((a, b) => {
                return a.concat(b)
            }, [])
        }, {
            deep: true,
            immediate: true
        })
        this.initial()
    }
    // 重置表单
    reset() {
        this.$vue.provideData.data = JSON.parse(JSON.stringify(this.initialData))
    }
    // 初始化
    initial() {
        this.initialData = JSON.parse(JSON.stringify(this.$vue.provideData.data))
    }
    // 获取指定表单项指定属性值
    getProps(items, name) {
        let humpName = '_get_' + name.replace('.', '_')
        if (this[humpName] instanceof Function) {
            return this[humpName](items)
        }
        return this.getPorpsValue(items, name)
    }
    // 验证表单项
    validate(items, isToast) {
        // 表单项可见状态为true且有配置type才验证
        if (items.type && this._get_visible(items) && !this._get_readonly(items)) {
            // 上传组件需要特殊验证
            if (['upload', 'uploadCard'].includes(items.type)) {
                let status = this.updateStatus[items.name]
                if (status) {
                    if (status.uploading) {
                        if (isToast) {
                            this.$vue.showToast('请等待文件上传完成')
                        }
                        return false
                    } else if (status.uploadfail) {
                        if (isToast) {
                            this.$vue.showToast('有文件上传失败，请重新上传或删除后再试')
                        }
                        return false
                    }
                }
            }
            if (Array.isArray(items.validate)) {
                let failItem = items.validate.find(rule => {
                    let value = this.$vue.formData[items.name]
                    // 验证前提，配置表单项的值包含or不包含指定值时才继续验证
                    if (Array.isArray(rule.premise)) {
                        if (rule.premise.findIndex(item => {
                            if (!isEmpty(item.includes)) {
                                // 如果 includes 包含指定表单项的值才继续验证
                                if (Array.isArray(item.includes)) {
                                    return item.includes.indexOf(this.$vue.formData[item.name]) === -1
                                } else {
                                    return item.includes === this.$vue.formData[item.name]
                                }
                            } else if (!isEmpty(item.excludes)) {
                                // 如果 excludes 不包含指定表单项的值才继续验证
                                if (Array.isArray(item.excludes)) {
                                    return item.excludes.indexOf(this.$vue.formData[item.name]) > -1
                                } else {
                                    return item.excludes === this.$vue.formData[item.name]
                                }
                            }
                        }) > -1) return
                    }
                    // 自定义验证方法
                    if (rule.validator) {
                        return !rule.validator(rule, value, items)
                    }
                    if (rule.required) {
                        // 验证必填
                        return isEmpty(value)
                    }
                    if (!isEmpty(value)) {
                        // 不用必填，且value不为空，验证value是否通过规则
                        if (typeof rule.min === 'number') {
                            // 长度不能小于指定值
                            if (String(value).length < rule.min) {
                                return true
                            }
                        }
                        if (typeof rule.max === 'number') {
                            // 长度不能大于指定值
                            if (String(value).length > rule.max) {
                                return true
                            }
                        }
                        if (rule.same) {
                            // 对比其他项的值是否相同
                            let pass = value === this.$vue.formData[rule.same]
                            if (rule.reverse) {
                                if (pass) {
                                    return true
                                }
                            } else if (!pass) {
                                return true
                            }
                        }
                        if (validateRule[rule.type]) {
                            // 使用内置的规则类型验证
                            let pass = validateRule[rule.type](value)
                            if (rule.reverse) {
                                if (pass) {
                                    return true
                                }
                            } else if (!pass) {
                                return true
                            }
                        }
                        if (rule.regex) {
                            // 使用自定义正则验证
                            let pass = new RegExp(rule.regex).test(value)
                            if (rule.reverse) {
                                if (pass) {
                                    return true
                                }
                            } else if (!pass) {
                                return true
                            }
                        }
                    }
                })
                if (failItem) {
                    if (isToast) {
                        this.$vue.showToast(failItem.message)
                    }
                    return false
                }
                return true
            }
        }
        return true
    }
    // 获取配置属性的值
    getPorpsValue(items, name) {
        let defaultProps = getProperty(items, name)
        if (isEmpty(defaultProps)) {
            let config = defaultConfig[name]
            // 配置选项数据格式必须为数组
            if (Array.isArray(config)) {
                // 按顺序遍历配置，后面的配置会覆盖前面的配置
                config.forEach(item => {
                    if (!isEmpty(item.rule)) {
                        switch (item.name) {
                        case 'default':
                            defaultProps = item.rule.return
                            break
                        // 按表单项类型返回
                        case 'type':
                            if (Array.isArray(item.rule)) {
                                item.rule.forEach(rule => {
                                    if (new RegExp(rule.regex).test(items.type)) {
                                        defaultProps = rule.return
                                    }
                                })
                            }
                            break
                        // 按表单项配置属性返回
                        case 'prop':
                            if (Array.isArray(item.rule)) {
                                item.rule.forEach(rule => {
                                    if (this.getProps(items, rule.name) === rule.value) {
                                        defaultProps = rule.return
                                    }
                                })
                            }
                            break
                        // 按 styleType 类型返回
                        case 'styleType':
                            if (this.$vue.styleType in item.rule) {
                                defaultProps = item.rule[this.$vue.styleType]
                            }
                            break
                        }
                    }
                })
            }
        }
        return defaultProps
    }
    /**
     * form配置项
     */
    // 获取表单项标签文本
    _get_label(items) {
        let label = items.label || ''
        switch (items.type) {
        case 'upload':
            if (this._get_readonly(items)) {
                if (this.$vue._getFileList(items).length) {
                    return `附件：${label}`
                } else {
                    return label
                }
            } else {
                return `上传附件：${label}`
            }
        case 'uploadCard':
            if (this._get_readonly(items)) {
                if (!this.$vue._getFileList(items).length) {
                    return '暂未上传附件'
                }
            }
            break
        }
        return label
    }
    // 表单项是否需要等待其他表单项验证通过后才可以操作
    _get_await(items, isToast) {
        if (!this._get_readonly(items) && Array.isArray(items.premise)) {
            return items.premise.findIndex(item => {
                if (item.type === 'handle') {
                    let awaitItem = this.items.find(v => v.name === item.name)
                    if (awaitItem) {
                        if (!this.validate(awaitItem, isToast)) {
                            return true
                        }
                    }
                }
            }) > -1
        }
    }
    // 获取表单项的边距
    _get_padding(items) {
        // 部分组件不需要padding
        if (['uploadCard'].includes(items.type)) {
            return ''
        }
        if (this._get_readonly(items)) {
            // 只有在只读状态下才返回padding
            return `${this.$vue.itemPadding}px 0`
        } else if (['textarea'].includes(items.type)) {
            // 只有在非只读状态下才返回padding
            return `${this.$vue.itemPadding}px 0`
        } else if (this.getProps(items, 'column')) {
            return `0 0 ${this.$vue.itemPadding}px 0`
        }
    }
    // 表单项是否显示的判断逻辑
    _get_visible(items) {
        if (Array.isArray(items.premise)) {
            // 该表单项的显示状态基于其他表单项的值是否匹配
            return items.premise.findIndex(item => {
                if (item.type === 'visible') {
                    if (Array.isArray(item.includes)) {
                        // 如果 includes 包含指定表单项的值才显示
                        return item.includes.indexOf(this.$vue.formData[item.name]) === -1
                    } else if (Array.isArray(item.excludes)) {
                        // 如果 excludes 不包含指定表单项的值才显示
                        return item.excludes.indexOf(this.$vue.formData[item.name]) > -1
                    }
                    // 指定表单项的值不为空才显示
                    return isEmpty(this.$vue.formData[item.name])
                }
            }) === -1
        } else {
            return this.getPorpsValue(items, 'visible')
        }
    }
    // 表单项是否只展示，不能编辑
    _get_readonly(items) {
        if (this.$vue.styleType === 'readonly') {
            return true
        } else {
            return this.getPorpsValue(items, 'readonly')
        }
    }
    // 表单项是否必填
    _get_required(items) {
        if (this._get_readonly(items)) {
            return false
        }
        return Array.isArray(items.validate) && items.validate.findIndex(item => item.required) > -1
    }
    // 获取表单项标签文本的显示状态
    _get_showLabel(items) {
        if (items.type === 'upload') {
            if (this._get_readonly(items)) {
                return this.$vue._getFileList(items).length > 0
            }
            return true
        }
        return this.getPorpsValue(items, 'showLabel')
    }
    // 表单项标签文本后面是否显示冒号
    _get_showLabelColon(items) {
        if (items.type === 'upload') {
            return false
        }
        return this.getPorpsValue(items, 'showLabelColon')
    }
    /**
     * 组件配置项
     */
    _get_props_config(items) {
        let props = items.props || {}
        let uploadConfig = {
            camera: props.camera,
            mediaType: props.mediaType,
            sourceType: props.sourceType,
            actionText: props.actionText || '点击上传',
            showRemove: isEmpty(props.showRemove) ? true : props.showRemove,
            maxFileCount: isEmpty(props.maxFileCount) ? 999 : props.maxFileCount,
            messageFileType: props.messageFileType,
            messageFileExtension: props.messageFileExtension
        }
        Object.keys(uploadConfig).forEach(key => {
            if (isEmpty(uploadConfig[key])) {
                delete uploadConfig[key]
            }
        })
        return uploadConfig
    }
    _get_props_readonly(items) {
        return this._get_readonly(items)
    }
    _get_props_placeholder(items) {
        switch (items.type) {
        case 'upload':
            if (!this.$vue._getFileList(items).length) {
                return `暂未上传${this._get_label(items) || '附件'}`
            }
            break
        case 'uploadCard':
            if (!this.$vue._getFileList(items).length) {
                return '暂未上传图片'
            }
            break
        }
        if (this._get_readonly(items)) {
            return '- -'
        }
        return this.getPorpsValue(items, 'props.placeholder')
    }
}
export default Form
