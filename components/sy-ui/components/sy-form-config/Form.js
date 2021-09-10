/**
 * 表单类
 */
import { isEmpty } from '@/components/sy-ui/utils'
import defaultConfig from './defaultConfig'

// 表单验证规则类型
const ValidateRule = {
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
        // 表单项
        this.formItem = []
    }
    // 获取指定表单项指定属性值
    getProps(formItem, name) {
        let humpName = '_get' + name.substring(0, 1).toLocaleUpperCase() + name.substring(1)
        if (this[humpName] instanceof Function) {
            return this[humpName](formItem)
        }
        return this.getPorpsValue(formItem, name)
    }
    // 验证表单项
    validate(formItem, isToast) {
        // 表单项可见状态为true且有配置type才验证
        if (formItem.type && this._getVisible(formItem) && !this._getReadonly(formItem)) {
            // 上传组件需要特殊验证
            if (['upload', 'uploadCard'].includes(formItem.type)) {
                if (formItem._uploading) {
                    if (isToast) {
                        this.$vue.showToast('请等待文件上传完成')
                    }
                    return false
                } else if (formItem._uploadfail) {
                    if (isToast) {
                        this.$vue.showToast('有文件上传失败，请重新上传或删除后再试')
                    }
                    return false
                }
            }
            if (Array.isArray(formItem.validate)) {
                let failItem = formItem.validate.find(rule => {
                    let value = this.$vue.formData[formItem.name]
                    if (Array.isArray(rule.premise)) {
                        if (rule.premise.findIndex(item => {
                            if (Array.isArray(item.includes)) {
                                // 如果 includes 包含指定表单项的值才继续验证
                                return item.includes.indexOf(this.$vue.formData[item.name]) === -1
                            } else if (Array.isArray(item.excludes)) {
                                // 如果 excludes 不包含指定表单项的值才继续验证
                                return item.excludes.indexOf(this.$vue.formData[item.name]) > -1
                            }
                        }) > -1) {
                            return
                        }
                    }
                    if (rule.required) {
                        // 验证必填
                        return isEmpty(value)
                    }
                    if (!isEmpty(value)) {
                        // 不用必填，且value不为空，验证value是否通过规则
                        if (rule.same) {
                            // 对比其他项的值是否相同
                            if (value !== this.$vue.formData[rule.same]) {
                                return true
                            }
                        }
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
                        if (ValidateRule[rule.type]) {
                            // 使用内置的规则类型验证
                            let pass = ValidateRule[rule.type](value)
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
    getPorpsValue(formItem, name) {
        let defaultValue = formItem[name]
        if (isEmpty(defaultValue)) {
            let config = defaultConfig['default-' + name]
            // 配置选项数据格式必须为数组
            if (Array.isArray(config)) {
                // 按顺序遍历配置，后面的配置会覆盖前面的配置
                config.forEach(item => {
                    if (!isEmpty(item.rule)) {
                        switch (item.name) {
                        case 'default':
                            defaultValue = item.rule.return
                            break
                        // 按表单项类型返回
                        case 'type':
                            if (Array.isArray(item.rule)) {
                                item.rule.forEach(rule => {
                                    if (new RegExp(rule.regex).test(formItem.type)) {
                                        defaultValue = rule.return
                                    }
                                })
                            }
                            break
                        // 按表单项配置属性返回
                        case 'prop':
                            if (Array.isArray(item.rule)) {
                                item.rule.forEach(rule => {
                                    if (this.getProps(formItem, rule.name) === rule.value) {
                                        defaultValue = rule.return
                                    }
                                })
                            }
                            break
                        // 按 styleType 类型返回
                        case 'styleType':
                            if (this.$vue.styleType in item.rule) {
                                defaultValue = item.rule[this.$vue.styleType]
                            }
                            break
                        }
                    }
                })
            }
        }
        return defaultValue
    }
    // 获取表单项标签文本
    _getLabel(formItem) {
        let label = formItem.label || ''
        switch (formItem.type) {
        case 'upload':
            if (this._getReadonly(formItem)) {
                if (this.$vue._getFileList(formItem).length) {
                    return `附件：${label}`
                } else {
                    return label
                }
            } else {
                return `上传附件：${label}`
            }
        case 'uploadCard':
            if (this._getReadonly(formItem)) {
                if (!this.$vue._getFileList(formItem).length) {
                    return '暂未上传附件'
                }
            }
            break
        }
        return label
    }
    // 获取表单项的边距
    _getPadding(formItem) {
        // 部分组件不需要padding
        if (['uploadCard'].includes(formItem.type)) {
            return ''
        }
        if (this._getReadonly(formItem)) {
            // 只有在只读状态下才返回padding
            return `${this.$vue.itemPadding}px 0`
        } else if (['textarea'].includes(formItem.type)) {
            // 只有在非只读状态下才返回padding
            return `${this.$vue.itemPadding}px 0`
        }
    }
    // 获取表单项标签文本的显示状态
    _getShowLabel(formItem) {
        if (formItem.type === 'upload') {
            if (this._getReadonly(formItem)) {
                return this.$vue._getFileList(formItem).length > 0
            }
            return true
        }
        return this.getPorpsValue(formItem, 'showLabel')
    }
    // 表单项标签文本后面是否显示冒号
    _getShowLabelColon(formItem) {
        if (formItem.type === 'upload') {
            return false
        }
        return this.getPorpsValue(formItem, 'showLabelColon')
    }
    // 表单项是否需要等待其他表单项验证通过后才可以操作
    _getAwait(formItem, isToast) {
        if (!this._getReadonly(formItem) && Array.isArray(formItem.premise)) {
            return formItem.premise.findIndex(item => {
                if (item.type === 'handle') {
                    let awaitItem = this.formItem.find(v => v.name === item.name)
                    if (awaitItem) {
                        if (!this.validate(awaitItem, isToast)) {
                            return true
                        }
                    }
                }
            }) > -1
        }
    }
    // 获取表单项配置选项
    _getConfig(formItem) {
        let uploadConfig = {
            camera: formItem.camera,
            mediaType: formItem.mediaType,
            sourceType: formItem.sourceType,
            actionText: formItem.actionText || '点击上传',
            showRemove: isEmpty(formItem.showRemove) ? true : formItem.showRemove,
            maxFileCount: isEmpty(formItem.maxFileCount) ? 999 : formItem.maxFileCount,
            messageFileType: formItem.messageFileType,
            messageFileExtension: formItem.messageFileExtension
        }
        Object.keys(uploadConfig).forEach(key => {
            if (isEmpty(uploadConfig[key])) {
                delete uploadConfig[key]
            }
        })
        return uploadConfig
    }
    // 表单项是否显示的判断逻辑
    _getVisible(formItem) {
        if (Array.isArray(formItem.premise)) {
            // 该表单项的显示状态基于其他表单项的值是否匹配
            return formItem.premise.findIndex(item => {
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
            return this.getPorpsValue(formItem, 'visible')
        }
    }
    // 表单项是否只展示，不能编辑
    _getReadonly(formItem) {
        if (this.$vue.styleType === 'readonly') {
            return true
        } else {
            return this.getPorpsValue(formItem, 'readonly')
        }
    }
    // 表单项是否必填
    _getRequired(formItem) {
        if (this.$vue.styleType === 'readonly') {
            return false
        }
        return Array.isArray(formItem.validate) && formItem.validate.findIndex(item => item.required) > -1
    }
    // 表单项没有值时的占位符
    _getPlaceholder(formItem) {
        switch (formItem.type) {
        case 'upload':
            if (!this.$vue._getFileList(formItem).length) {
                return `暂未上传${this._getLabel(formItem) || '附件'}`
            }
            break
        case 'uploadCard':
            if (!this.$vue._getFileList(formItem).length) {
                return '暂未上传图片'
            }
            break
        default:
            if (this._getReadonly(formItem) && isEmpty(this.$vue.formData[formItem.name])) {
                let defaultValue = defaultConfig['default-placeholder'].find(v => v.name === 'prop')
                if (defaultValue) {
                    defaultValue = defaultValue.rule.find(v => v.name === 'readonly')
                    if (defaultValue) {
                        return defaultValue.return
                    }
                }
            }
            break
        }
        return this.getPorpsValue(formItem, 'placeholder')
    }
}
export default Form
