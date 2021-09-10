
export default [
    // 回到当前定位
    {
        sort: 1,
        name: 'location',
        icon: 'sy-ui-icon-location',
        position: 'right-bottom'
    },
    // 放大or缩小视野
    {
        sort: 2,
        name: 'scale',
        type: 'group',
        group: [
            {
                name: 'add',
                icon: 'sy-ui-icon-add',
                style: {
                    fontSize: '30rpx'
                }
            },
            {
                name: 'sub',
                icon: 'sy-ui-icon-sub',
                style: {
                    fontSize: '30rpx'
                }
            }
        ],
        position: 'right-bottom'
    },
    // 切换地图类型
    {
        sort: 1,
        name: 'mapType',
        icon: 'sy-ui-icon-map',
        activeIcon: 'sy-ui-icon-satellite-map',
        position: 'right-top'
    }
]
