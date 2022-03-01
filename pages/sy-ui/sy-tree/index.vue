<template>
    <view class="content">
        <view class="title">
            默认
        </view>
        <sy-tree
            provide-key="treeData"
            @nodeclick="handleNodeClick"
            @checkchange="handleNodeClick"
        />
        <view class="title">
            默认全部展开
        </view>
        <sy-tree
            provide-key="treeData"
            default-expand-all
            @nodeclick="handleNodeClick"
            @checkchange="handleNodeClick"
        />
        <view class="title">
            展开部分节点
        </view>
        <sy-tree
            :default-checked-keys="['SYUI/Upload']"
            provide-key="treeData"
            accordion
            @nodeclick="handleNodeClick"
            @checkchange="handleNodeClick"
        />
        <view class="title">
            单选
        </view>
        <sy-tree
            provide-key="treeData"
            selectable
            @nodeclick="handleNodeClick"
            @checkchange="handleNodeClick"
        />
        <view class="title">
            多选
        </view>
        <sy-tree
            provide-key="treeData"
            multiple
            selectable
            show-node-count
            @nodeclick="handleNodeClick"
            @checkchange="handleNodeClick"
        />
        <view class="title">
            自定义节点图标
        </view>
        <sy-tree
            provide-key="treeData"
            node-icon="sy-ui-icon-arrow-right"
            @nodeclick="handleNodeClick"
            @checkchange="handleNodeClick"
        />
        <view class="title">
            禁用动画
        </view>
        <sy-tree
            :enable-animate="false"
            provide-key="treeData2"
            multiple
            selectable
            show-node-count
            @nodeclick="handleNodeClick"
            @checkchange="handleNodeClick"
        />
    </view>
</template>
<script>
    export default {
        props: {},
        data() {
            return {
                treeData: [
                    {
                        label: '表单组件',
                        value: '',
                        children: [
                            { label: 'Input 输入框', value: 'SYUI/Input', keyword: '表单组件' },
                            { label: 'Upload 上传', value: 'SYUI/Upload', keyword: '表单组件' }
                        ]
                    },
                    {
                        label: '数据展示组件',
                        value: '',
                        children: [
                            { label: 'Tree 树形控件', value: 'SYUI/Tree', keyword: '数据展示组件' }
                        ]
                    }
                ],
                treeData2: [
                    {
                        label: '表单组件',
                        value: '',
                        children: [
                            { label: 'Input 输入框输入框输入框输入框输入框输入框输入框输入框输入框输入框输入框输入框输入框输入框输入框输入框输入框输入框输入框输入框输入框输入框输入框输入框输入框输入框输入框输入框输入框输入框输入框输入框输入框', value: 'SYUI/Input', keyword: '表单组件' },
                            { label: 'Upload 上传上传上传上传上传上传上传上传上传上传上传上传上传上传上传上传上传上传上传上传上传上传上传上传上传上传上传上传上传上传上传上传上传上传上传上传上传上传上传上传上传上传上传上传上传', value: 'SYUI/Upload', keyword: '表单组件' }
                        ]
                    },
                    {
                        label: '数据展示组件',
                        value: '',
                        children: [
                            { label: 'Tree 树形控件', value: 'SYUI/Tree', keyword: '数据展示组件' }
                        ]
                    }
                ]
            }
        },
        provide() {
            return {
                provideComponent: this
            }
        },
        computed: {},
        onShow() {},
        onLoad(param) {},
        onUnload() {},
        methods: {
            handleNodeClick(node) {
                console.log(node)
            },
            handleCheckChange(node, nodes) {
                console.log(node, nodes)
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
}
</style>
