<template>
    <view class="content">
        <view class="container">
            <view class="title">
                选择器
            </view>
            <view class="toolbar">
                value：{{ picker.value }}
                <view class="item input">
                    <sy-picker
                        v-model="picker.value"
                        :min="picker.min"
                        :max="picker.max"
                        :mode="picker.mode"
                        :format="picker.format"
                        :options="options"
                        :allow-create="picker.allowCreate"
                        clearable
                        placeholder="请选择"
                        @input="handleConlog"
                    />
                </view>
                <view class="item">
                    <sy-radio-group
                        v-model="picker.mode"
                        :options="[
                            {label: '单列选择', value: 'selector'},
                            {label: '多列选择', value: 'multiSelector'},
                            {label: '联动选择', value: 'linkage'},
                            {label: '日期', value: 'date'},
                            {label: '时间', value: 'time'},
                        ]"
                        @change="picker.format = ''"
                    />
                </view>
                <view v-if="picker.mode === 'selector'" class="item" style="padding: 16rpx 0;">
                    <sy-checkbox v-model="picker.allowCreate" text="可创建新条目" />
                </view>
                <block v-if="picker.mode==='date'">
                    <view class="item sy-ui-border-top">
                        <sy-radio-group
                            v-model="picker.format"
                            :options="[
                                {label: '年月日', value: 'YYYY-MM-DD'},
                                {label: '年月', value: 'YYYY-MM'},
                                {label: '年', value: 'YYYY'},
                            ]"
                        />
                    </view>
                    <view class="item row">
                        <view class="cell input">
                            <sy-picker
                                v-model="picker.min"
                                :format="picker.format"
                                mode="date"
                                clearable
                                placeholder="开始日期"
                            />
                        </view>
                        <view class="cell input">
                            <sy-picker
                                v-model="picker.max"
                                :format="picker.format"
                                mode="date"
                                clearable
                                placeholder="结束日期"
                            />
                        </view>
                    </view>
                </block>
                <block v-else-if="picker.mode==='time'">
                    <view class="item sy-ui-border-top">
                        <sy-radio-group
                            v-model="picker.format"
                            :options="[
                                {label: '时分秒', value: 'HH:mm:ss'},
                                {label: '时分', value: 'HH:mm'},
                                {label: '时', value: 'HH'},
                            ]"
                        />
                    </view>
                    <view class="item row">
                        <view class="cell input">
                            <sy-picker
                                v-model="picker.min"
                                :format="picker.format"
                                mode="time"
                                clearable
                                placeholder="开始时间"
                            />
                        </view>
                        <view class="cell input">
                            <sy-picker
                                v-model="picker.max"
                                :format="picker.format"
                                mode="time"
                                clearable
                                placeholder="结束时间"
                            />
                        </view>
                    </view>
                </block>
            </view>
            <view class="title">
                日历选择器
            </view>
            <view class="toolbar">
                value：{{ pickerDate.value }}
                <view class="item input">
                    <sy-picker-date
                        v-model="pickerDate.value"
                        :mode="pickerDate.mode"
                        :type="pickerDate.type"
                        :format="pickerDate.format[pickerDate.type]"
                        clearable
                        placeholder="请选择日期"
                        provideKey="calendarConfig"
                    />
                </view>
                <view class="item">
                    <sy-radio-group
                        v-model="pickerDate.mode"
                        :options="[
                            {label: '默认', value: 'default'},
                            {label: '单选', value: 'radio'},
                            {label: '多选', value: 'multiple'},
                            {label: '范围', value: 'range'},
                        ]"
                    />
                </view>
                <view class="item sy-ui-border-top">
                    <sy-radio-group
                        v-model="pickerDate.type"
                        :options="[
                            {label: '日期', value: 'date'},
                            {label: '星期', value: 'week'},
                            {label: '月份', value: 'month'},
                            {label: '年份', value: 'year'},
                        ]"
                    />
                </view>
            </view>
            <view class="title">
                日期时间选择器
            </view>
            <view class="toolbar">
                <view class="item input">
                    <sy-picker-date-time
                        v-model="dateTime"
                        format="YYYY-MM-DD HH:mm:ss"
                        value-format="YYYY/MM/DD HH:mm:ss"
                        placeholder="请选择日期和时间"
                    />
                </view>
            </view>
            <view class="title">
                树形控件选择器
            </view>
            <view class="toolbar">
                value：{{ pickerTree.value }}
                <view class="item input">
                    <sy-picker-tree
                        v-model="pickerTree.value"
                        :props="pickerTree.props"
                        provide-key="treeData"
                        @input="handleConlog"
                    />
                </view>
                <view class="item" style="margin-top: 20rpx;">
                    <sy-checkbox
                        v-model="pickerTree.props.multiple"
                        text="是否可以多选"
                    />
                </view>
                <view class="item" style="margin-top: 20rpx;">
                    <sy-checkbox
                        v-model="pickerTree.props.showNodeCount"
                        text="是否显示可见的子节点数量"
                    />
                </view>
                <view class="item" style="margin-top: 20rpx;">
                    <sy-checkbox
                        v-model="pickerTree.props.showAllLevels"
                        text="输入框中是否显示选中值的完整路径"
                    />
                </view>
                <view class="item" style="margin-top: 20rpx;">
                    <sy-checkbox
                        v-model="pickerTree.props.checkStrictly"
                        text="是否严格的遵守父子节点不互相关联，默认只能选中叶子节点，设置为true时所有节点都可以选中"
                    />
                </view>
                <view class="item" style="margin-top: 20rpx;">
                    <sy-checkbox
                        v-model="pickerTree.props.emitPath"
                        text="节点选中状态改变时，是否返回由该节点所在的各级菜单的值所组成的数组，默认只返回该节点的值"
                    />
                </view>
                <view class="item" style="margin-top: 20rpx;">
                    <sy-checkbox
                        v-model="pickerTree.props.emptyOption"
                        true-label="全部"
                        false-label=""
                        text="当不需要选择任何节点，但是需要显示label，比如设置“全部”，组件会在第一级生成一个label为“全部”，value为null的节点"
                    />
                </view>
            </view>
            <view class="title">
                地理位置选择器
            </view>
            <view class="toolbar">
                <view class="item input">
                    <sy-picker-location
                        v-model="location1"
                        clearable
                        placeholder="请选择位置"
                        @input="handleConlog"
                    />
                </view>
            </view>
        </view>
    </view>
</template>
<script>
    import menuTree from '../menuTree'
    import dateTools from '@/components/sy-ui/utils/dateTools'

    export default {
        props: {},
        data() {
            let nowDay = new Date()
            let year = dateTools.format(nowDay, 'YYYY')
            let month = dateTools.format(nowDay, 'MM')
            let date = dateTools.format(nowDay, 'DD')
            let markerStyles = {
                lineHeight: '24rpx',
                top: '-10rpx',
                right: '-10rpx',
                color: '#fff',
                fontSize: '16rpx',
                background: 'red',
                padding: '0 6rpx',
                borderRadius: '12rpx'
            }
            return {
                picker: {
                    mode: 'selector',
                    value: '',
                    min: '',
                    max: '',
                    format: '',
                    allowCreate: false
                },
                pickerDate: {
                    value: '',
                    mode: 'default',
                    type: 'date',
                    format: {
                        date: 'YYYY-MM-DD',
                        month: 'YYYY-MM',
                        year: 'YYYY',
                        week: 'YYYY年 第WW周'
                    }
                },
                pickerTree: {
                    value: '',
                    props: {
                        deep: 10,
                        emitPath: false,
                        multiple: false,
                        emptyOption: null,
                        checkStrictly: false,
                        showNodeCount: false,
                        showAllLevels: false,
                        placeholder: '请选择'
                    }
                },
                dateTime: '2020',
                tree1: 'SYUI/Tree',
                tree2: ['view', 'SYUI/Tree'],
                tree3: ['view'],
                tree4: ['SYUI/Tree', 'SYUI/Steps', 'SYUI/Picker'],
                linkage1: 'test2',
                linkage2: ['form', 'SYUI/FormConfig', 'test3'],
                location1: '',
                treeData: menuTree,
                calendarConfig: {
                    markers: {
                        [`${year}-${month}-${date}`]: {
                            text: '99+',
                            styles: markerStyles
                        },
                        [`${year}-${month}`]: {
                            text: '99+',
                            styles: markerStyles
                        },
                        [year]: {
                            text: '99+',
                            styles: markerStyles
                        }
                    }
                }
            }
        },
        computed: {
            options() {
                switch (this.picker.mode) {
                case 'selector':
                    return [
                        { label: '第1行', value: '1' },
                        { label: '第2行', value: '2' },
                        { label: '第3行', value: '3' },
                        { label: '第4行', value: '4' },
                        { label: '第5行', value: '5' },
                        { label: '第6行', value: '6' },
                        { label: '第7行', value: '7' }
                    ]
                case 'multiSelector':
                    return [
                        [
                            { label: '第1列第1行', value: '1-1' },
                            { label: '第1列第2行', value: '1-2' },
                            { label: '第1列第3行', value: '1-3' },
                            { label: '第1列第4行', value: '1-4' },
                            { label: '第1列第5行', value: '1-5' },
                            { label: '第1列第6行', value: '1-6' },
                            { label: '第1列第7行', value: '1-7' }
                        ],
                        [
                            { label: '第2列第1行', value: '2-1' },
                            { label: '第2列第2行', value: '2-2' },
                            { label: '第2列第3行', value: '2-3' },
                            { label: '第2列第4行', value: '2-4' },
                            { label: '第2列第5行', value: '2-5' },
                            { label: '第2列第6行', value: '2-6' },
                            { label: '第2列第7行', value: '2-7' }
                        ]
                    ]
                case 'linkage':
                    return JSON.stringify(menuTree)
                default:
                    return []
                }
            }
        },
        provide() {
            return {
                provideComponent: this
            }
        },
        onLoad(param) {
        },
        methods: {
            handleConlog(value) {
                console.log(value)
            }
        }
    }
</script>
<style lang="scss" scoped>
.content{
    padding: 30rpx;
    background: #fff;
    .title{
        display: block;
        color: #333;
        font-size: 26rpx;
        font-weight: bold;
        border-left: solid 6rpx #ddd;
        padding-left: 12rpx;
        margin: 12rpx 0;
    }
    .container {
        position: relative;
        width: 100%;
        background: #fff;
        .toolbar {
            padding: 10rpx 0;
            .item{
                display: flex;
                flex-direction: column;
                &.row {
                    flex-direction: row;
                }
                .cell {
                    flex: 1;
                    & + .cell {
                        margin-left: 30rpx;
                    }
                }
                .input,
                &.input{
                    background: #eee;
                    padding: 0 20rpx;
                }
            }
        }
    }
}
</style>
