<template>
    <view class="content">
        <view class="container">
            <view class="title">
                选择器
            </view>
            <view class="toolbar">
                <view class="item input">
                    <sy-picker
                        v-model="picker.value"
                        :mode="picker.mode"
                        :min="picker.min"
                        :max="picker.max"
                        :format="picker.format"
                        :options="options"
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
                <block v-if="picker.mode==='date'">
                    <view class="item sy-ui-border-top">
                        <sy-radio-group
                            v-model="picker.format"
                            :options="[
                                {label: '年月日', value: 'YYYY-MM-DD'},
                                {label: '年月', value: 'YYYY-MM'},
                                {label: '年', value: 'YYYY'},
                            ]"
                        >
                            <sy-radio label="YYYY-MM-DD" text="年月日" />
                            <sy-radio label="YYYY-MM" text="年月" />
                            <sy-radio label="YYYY" text="年" />
                        </sy-radio-group>
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
                <view class="item input">
                    <sy-picker-date
                        v-model="pickerDate.value"
                        :mode="pickerDate.mode"
                        :type="pickerDate.type"
                        :format="pickerDate.format[pickerDate.type]"
                        clearable
                        placeholder="请选择日期"
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
                树形控件选择器（单选）
            </view>
            <view class="toolbar">
                <view class="item input">
                    <sy-picker-tree
                        v-model="tree1"
                        :options="treeData"
                        placeholder="请选择组件"
                        stringify-options
                        @input="handleConlog"
                    />
                </view>
            </view>
            <view class="title">
                树形控件选择器（单选，返回值为数组）
            </view>
            <view class="toolbar">
                <view class="item input">
                    <sy-picker-tree
                        v-model="tree2"
                        :options="treeData"
                        emit-path
                        placeholder="请选择组件"
                        stringify-options
                        @input="handleConlog"
                    />
                </view>
            </view>
            <view class="title">
                树形控件选择器（单选，限制节点深度）
            </view>
            <view class="toolbar">
                <view class="item input">
                    <sy-picker-tree
                        v-model="tree3"
                        :options="treeData"
                        deep="1"
                        emit-path
                        placeholder="请选择组件"
                        stringify-options
                        @input="handleConlog"
                    />
                </view>
            </view>
            <view class="title">
                树形控件选择器（多选）
            </view>
            <view class="toolbar">
                <view class="item input">
                    <sy-picker-tree
                        v-model="tree4"
                        :options="treeData"
                        clearable
                        multiple
                        stringify-options
                        placeholder="请选择组件"
                        @input="handleConlog"
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

    export default {
        props: {},
        data() {
            return {
                picker: {
                    mode: 'selector',
                    value: '',
                    min: '',
                    max: '',
                    format: ''
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
                dateTime: '2020',
                tree1: 'SYUI/Tree',
                tree2: ['view', 'SYUI/Tree'],
                tree3: ['view'],
                tree4: ['SYUI/Tree', 'SYUI/Steps', 'SYUI/Picker'],
                linkage1: 'test2',
                linkage2: ['form', 'SYUI/FormConfig', 'test3'],
                location1: '',
                treeData: menuTree
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
.test1 {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
    background: rgba(0,0,0,.6);
    .test2 {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 50vh;
        background: #fff;
    }
    .test3 {
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 101, 101, 0.6);
    }
}
</style>
