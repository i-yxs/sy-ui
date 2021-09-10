<!--
* @description 选择器
* @author yxs
!-->
<template>
    <picker-view
        :style="{height: height}"
        :value="pickerValue"
        :indicator-style="indicatorStyle"
        class="sy-picker-view"
        @change="handleChange"
    >
        <picker-view-column v-for="(column, index) in columnList" :key="index" @change="handleChange">
            <view v-for="(item, idx) in column" :key="idx" class="item">
                <view class="sy-ui-folded f1">
                    {{ item[labelKey] }}
                </view>
            </view>
        </picker-view-column>
    </picker-view>
</template>
<script>
    // 方法
    import { numberPad } from '@/components/sy-ui/utils'
    import dateTools from '@/components/sy-ui/utils/dateTools'

    export default {
        name: 'SyPickerView',
        props: {
            mode: { type: String, default: 'selector' }, // 选择器的模式 selector、multiSelector、time、date、linkage
            value: null,
            height: { type: String, default: '200rpx' }, // 选择器的高度
            options: null, // 数据源
            labelKey: { type: String, default: 'label' }, // 指定选择器的标签为数据源的某个属性
            valueKey: { type: String, default: 'value' }, // 指定选择器的值为数据源的某个属性
            // time、date选择器属性
            min: String, // 可选的最晚时间
            max: String, // 可选的最早时间
            format: { type: String, default: '' }, // 日期格式YYYY-MM-DD 时间格式hh(HH):mm:ss
            indicatorStyle: { type: String, default: 'height:44px;' }, // 选中框的样式
            // linkage选择器参数
            deep: { type: [Number, String], default: 999 }, // 最大节点深度
            emitPath: { type: Boolean, default: false }, // 在选中节点改变时，是否返回由该节点所在的各级菜单的值所组成的数组，若设置 false，则只返回该节点的值
            childrenKey: { type: String, default: 'children' } // 指定节点子节点列表为节点对象的某个属性值
        },
        data() {
            return {
                // 列数据
                columnList: [],
                // 选择器下标
                pickerValue: []
            }
        },
        computed: {
        },
        watch: {
            value() {
                this.updateValueToIndex()
            },
            options: {
                deep: true,
                handler() {
                    this.updateColumn()
                }
            },
            deep() {
                if (['linkage'].includes(this.mode)) {
                    this.updateColumn()
                }
            }
        },
        mounted() {
            this.updateColumn()
            this.updateValueToIndex()
        },
        methods: {
            // 判断平年闰年[四年一闰，百年不闰，四百年再闰]
            isLeapYear(year) {
                return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)
            },
            // 设置选项数据
            setOptions(options = this.options) {
                if (typeof options === 'string') {
                    try {
                        options = JSON.parse(options) || []
                    } catch (err) {
                        options = []
                        console.error(err)
                    }
                }
                switch (this.mode) {
                case 'selector':
                    this.columnList = [options]
                    break
                case 'multiSelector':
                    this.columnList = options
                    break
                case 'linkage':
                    this.rootNodes = []
                    this.nodesData = []
                    if (Array.isArray(options) && options.length) {
                        let maxDeep = 0
                        let recursion = (data, parentNode, path, deep) => {
                            if (data.length && deep <= this.deep) {
                                maxDeep = Math.max(maxDeep, deep)
                                return data.filter(item => item).map((item, index) => {
                                    let nowPath = `${path}${index}`
                                    let children = item[this.childrenKey] || []
                                    let node = {
                                        data: item,
                                        path: nowPath,
                                        label: item[this.labelKey],
                                        value: item[this.valueKey]
                                    }
                                    node.children = recursion(children, node, `${nowPath}.`, deep + 1)
                                    return node
                                })
                            } else if (parentNode) {
                                this.rootNodes.push(parentNode)
                            }
                        }
                        this.nodesData = recursion(options, null, '', 1)
                        this.maxDeep = Math.min(maxDeep, this.deep)
                        this.updateLinkageColumn()
                    }
                    break
                }
            },
            // 根据value获取选择器下标
            getIndex(value = this.value) {
                var indexs = []
                var values = []
                var date = new Date()
                if (this.columnList.length) {
                    switch (this.mode) {
                    case 'selector':
                        values = [value]
                        break
                    case 'multiSelector':
                        values = value || []
                        break
                    case 'linkage':
                        if (this.emitPath) {
                            values = value || []
                        } else {
                            var path = (this.rootNodes.find(item => item.value === value) || this.rootNodes[0]).path
                            var node = {
                                children: this.nodesData
                            }
                            path.split('.').forEach(index => {
                                node = node.children[index]
                                values.push(node.value)
                            })
                        }
                        break
                    case 'date':
                        if (value && typeof value === 'string') {
                            date = dateTools.parse(value) || date
                        }
                        values = [date.getFullYear(), date.getMonth() + 1, date.getDate()]
                        break
                    case 'time':
                        if (value && typeof value === 'string') {
                            date = dateTools.parse(value) || date
                        }
                        values = [date.getHours(), date.getMinutes(), date.getSeconds()]
                        break
                    }
                    indexs = this.columnList.map((item, index) => item.findIndex(v => v[this.valueKey] === values[index])).map(index => index > -1 ? index : 0)
                }
                return indexs
            },
            // 根据选择器下标获取value
            getValue(indexs = this.pickerValue) {
                var value = []
                this.columnList.map((item, index) => {
                    item = item[indexs[index] || 0]
                    if (item) {
                        value.push(item[this.valueKey])
                    }
                })
                switch (this.mode) {
                case 'selector':
                    value = value[0]
                    break
                case 'linkage':
                    value = this.emitPath ? value : value.slice(-1)[0]
                    break
                case 'date':
                    value = value.map(v => numberPad(v)).join('-')
                    break
                case 'time':
                    value = value.map(v => numberPad(v)).join(':')
                    break
                }
                return value
            },
            // 获取日期数据
            getDateColumn() {
                var column = []
                var fields = (this.format || 'YYYY-MM-DD').split('-')
                // 根据格式设置选择器的粒度
                if (fields[0] === 'YYYY') {
                    // 年份
                    column[0] = []
                    // 当前年份的上下一百年
                    var year = (new Date()).getFullYear() + 100
                    for (var i = year - 200; i < year; i++) {
                        column[0].push({
                            [this.labelKey]: i + '年',
                            [this.valueKey]: i
                        })
                    }
                    if (fields[1]) {
                        // 月份
                        column[1] = []
                        for (i = 1; i <= 12; i++) {
                            column[1].push({
                                [this.labelKey]: numberPad(i) + '月',
                                [this.valueKey]: i
                            })
                        }
                        if (fields[2]) {
                            // 日期
                            column[2] = []
                            // 根据选中的月份联动
                        }
                    }
                }
                this.columnList = column
            },
            // 获取时间数据
            getTimeColumn() {
                var column = []
                var fields = (this.format || 'HH:mm:ss').split(':')
                // 根据格式设置选择器的粒度
                // 判断是12小时制还是24小时制
                if (/^H+$/.test(fields[0])) {
                    column[0] = []
                    for (let i = 0; i < 24; i++) {
                        column[0][i] = {
                            [this.labelKey]: numberPad(i) + '时',
                            [this.valueKey]: i
                        }
                    }
                } else if (/^h+$/.test(fields[0])) {
                    column[0] = []
                    for (let i = 0; i < 12; i++) {
                        column[0][i] = {
                            [this.labelKey]: numberPad(i + 1) + '时',
                            [this.valueKey]: i + 1
                        }
                    }
                }
                if (fields[1] === 'mm') {
                    // 分
                    column[1] = []
                    for (let i = 0; i < 60; i++) {
                        column[1][i] = {
                            [this.labelKey]: numberPad(i) + '分',
                            [this.valueKey]: i
                        }
                    }
                    if (fields[2] === 'ss') {
                        // 秒
                        column[2] = []
                        for (let i = 0; i < 60; i++) {
                            column[2][i] = {
                                [this.labelKey]: numberPad(i) + '秒',
                                [this.valueKey]: i
                            }
                        }
                    }
                }
                this.columnList = column
            },
            // 更新列数据
            updateColumn() {
                switch (this.mode) {
                case 'linkage':
                case 'selector':
                case 'multiSelector':
                    this.setOptions()
                    break
                case 'time':
                    this.getTimeColumn()
                    break
                case 'date':
                    this.getDateColumn()
                    break
                }
                this.updateValueToIndex()
            },
            // 更新日期列数据
            updateDateColumn() {
                var format = this.format || 'YYYY-MM-DD'
                if (format === 'YYYY-MM-DD' && this.columnList.length) {
                    var year = this.pickerValue[0] ? this.columnList[0][this.pickerValue[0]][this.valueKey] : (new Date()).getFullYear()
                    var month = this.pickerValue[1] || 0
                    var date = [31, this.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month]
                    var column = []
                    for (var i = 1; i <= date; i++) {
                        column.push({
                            [this.labelKey]: numberPad(i) + '日',
                            [this.valueKey]: i
                        })
                    }
                    this.columnList = [
                        this.columnList[0],
                        this.columnList[1],
                        column
                    ]
                }
            },
            // 更新联动选择器数据
            updateLinkageColumn(indexs) {
                if (this.rootNodes && this.rootNodes.length) {
                    if (!indexs) {
                        var value
                        if (this.emitPath) {
                            value = Array.isArray(this.value) ? this.value.slice(-1)[0] : ''
                        } else {
                            value = this.value
                        }
                        var path = (this.rootNodes.find(item => item.value === value) || this.rootNodes[0]).path
                        indexs = path.split('.').map(index => Number(index))
                    }
                    var node = {
                        children: this.nodesData
                    }
                    var deep = -1
                    var data = []
                    while (++deep < this.maxDeep) {
                        if (node && node.children) {
                            data.push(node.children)
                            node = node.children[indexs[deep] || 0]
                        } else {
                            data.push([])
                        }
                    }
                    this.columnList = data.map(column => {
                        return column.map(item => {
                            return {
                                [this.labelKey]: item.label,
                                [this.valueKey]: item.value
                            }
                        })
                    })
                }
            },
            // 根据value更新index
            updateValueToIndex() {
                switch (this.mode) {
                case 'date':
                    this.updateDateColumn()
                    break
                case 'linkage':
                    this.updateLinkageColumn()
                    break
                }
                this.pickerValue = this.getIndex()
                this.updateIndexToValue()
            },
            // 根据index更新value
            updateIndexToValue() {
                if (this.columnList.length) {
                    switch (this.mode) {
                    case 'date':
                        this.updateDateColumn()
                        break
                    case 'linkage':
                        this.updateLinkageColumn(this.pickerValue)
                        break
                    }
                    this.pickerValue = this.pickerValue.map((item, index) => {
                        return Math.min(item || 0, this.columnList[index].length - 1)
                    })
                }
            },
            // 选择器改变时触发
            handleChange(res) {
                // 发送columnchange事件
                let column = res.detail.value.findIndex((item, index) => item !== void 0 && item === this.pickerValue[index])
                let index = res.detail.value[column]
                this.$emit('columnchange', {
                    index, // 改变的行下标
                    column // 改变的列下标
                })
                this.pickerValue = res.detail.value.map((item) => Math.max(item || 0, 0))
                if (['date', 'time'].includes(this.mode)) {
                    // 根据开始时间和结束时间修正选中的值
                    this.$nextTick(() => {
                        if (this.min) {
                            let sdate = dateTools.parse(this.min)
                            if (dateTools.parse(this.getValue()) < sdate) {
                                this.pickerValue = this.getIndex(this.min)
                            }
                        }
                        if (this.max) {
                            let edate = dateTools.parse(this.max)
                            if (dateTools.parse(this.getValue()) > edate) {
                                this.pickerValue = this.getIndex(this.max)
                            }
                        }
                        this.updateIndexToValue()
                        this.handleEmitChange()
                    })
                } else {
                    this.updateIndexToValue()
                    this.handleEmitChange()
                }
            },
            // 发送change事件
            handleEmitChange() {
                var value = this.getValue()
                var index = this.getIndex()
                if (this.mode === 'selector') {
                    index = index[0]
                }
                this.$emit('input', value)
                this.$emit('change', {
                    value,
                    index
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
.sy-picker-view {
    width: 100%;
    .item {
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        font-size: 16px;
        line-height: 1.4em;
    }
}
</style>

