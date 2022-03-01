<!--
* @description 地图
* @author yxs
!-->
<template>
    <view :style="{height: height}" class="sy-map">
        <view :style="headStryles_" class="head">
            <slot name="head" />
        </view>
        <view
            :style="{
                top: mapStyle.top,
                height: mapStyle.height
            }"
            class="body"
        >
            <map
                :id="id"
                :skew="mapProps.skew"
                :scale="mapProps.scale"
                :rotate="mapProps.rotate"
                :latitude="mapProps.latitude"
                :longitude="mapProps.longitude"
                :min-scale="mapProps.minScale"
                :max-scale="mapProps.maxScale"
                :enable-3D="mapProps.enable3D"
                :show-scale="mapProps.showScale"
                :markers="mapProps.markers"
                :circles="mapProps.circles"
                :polygons="mapProps.polygons"
                :polyline="mapProps.polyline"
                :include-points="mapProps.includePointsList"
                :show-compass="mapProps.showCompass"
                :show-location="mapProps.showLocation"
                :enable-zoom="mapProps.enableZoom"
                :enable-poi="mapProps.enablePoi"
                :enable-scroll="mapProps.enableScroll"
                :enable-rotate="mapProps.enableRotate"
                :enable-traffic="mapProps.enableTraffic"
                :enable-building="mapProps.enableBuilding"
                :enable-satellite="mapProps.enableSatellite"
                :enable-overlooking="mapProps.enableOverlooking"
                @click="$emit('maptap', $event)"
                @poitap="$emit('poitap', $event)"
                @updated="$emit('updated', $event)"
                @labeltap="$emit('labeltap', $event)"
                @callouttap="$emit('callouttap', $event)"
                @regionchange="$emit('regionchange', $event)"
                @anchorpointtap="$emit('anchorpointtap', $event)"
                @markertap="handleMarkerTap"
            />
            <control
                :options="control"
                @controltap="handleControlTap"
            />
            <slot/>
        </view>
        <view :style="footStryles_" class="foot">
            <slot name="foot" />
        </view>
    </view>
</template>
<script>
    import { objectToCss, getElementRect, getDirtyNumber, promiseTimeOut } from '../../utils'
    // 组件
    import Control from './control'

    export default {
        name: 'SyMap',
        components: {
            Control
        },
        props: {
            // 默认缩放级别
            scale: { type: Number, default: 17 },
            // 组件高度
            height: { default: '100%' },
            // hand容器自定义样式
            headStryles: Object,
            // foot容器自定义样式
            footStryles: Object,
            // 控件配置
            control: Object,
            // 默认坐标
            latitude: { default: 39.918 },
            longitude: { default: 116.397 },
            // 上下偏移（单位：rpx）
            offsetTop: { default: 0 },
            offsetBottom: { default: 0 },
            // 初始化组件时是否自动定位到当前位置
            autoLocation: { type: Boolean, default: true },
            // 点击marker后是否自动定位到marker位置
            markerTapAutoLocation: { type: Boolean, default: true }
        },
        data() {
            return {
                id: `sy-map${Date.now()}`,
                // 地图样式
                mapStyle: {},
                /**
                 * 地图属性，部分属性为了配合自定义控件，不在props上开放，
                 * 推荐使用ref获取组件实例，调用setMapProps方法进行设置
                 */
                mapProps: {
                    scale: this.scale,
                    minScale: 3,
                    maxScale: 20,
                    markers: [],
                    circles: [],
                    polygons: [],
                    polyline: [],
                    latitude: this.latitude,
                    longitude: this.longitude,
                    showScale: true, // 显示比例尺
                    showLocation: true, // 显示带有方向的当前定位点
                    enablePoi: true, // 是否展示 POI 点
                    enableZoom: true, // 是否支持缩放
                    enableScroll: true // 是否支持拖动
                }
            }
        },
        computed: {
            headStryles_() {
                return objectToCss(this.headStryles)
            },
            footStryles_() {
                return objectToCss(this.footStryles)
            }
        },
        watch: {
            scale(value) {
                this.mapProps.scale = value
            },
            latitude(value) {
                this.mapProps.latitude = value
            },
            longitude(value) {
                this.mapProps.longitude = value
            }
        },
        mounted() {
            this.mapContext = uni.createMapContext(this.id, this)
            // 用于保存使用MapContext.addMarkers方式添加的标记点
            this.contextMarkers = []
            // 获取用户位置
            if (this.autoLocation) {
                this.getLocation().then((location) => {
                    this.setMapProps({
                        latitude: location.latitude,
                        longitude: location.longitude
                    })
                }).finally(() => {
                    this.$emit('ready')
                })
            } else {
                this.$emit('ready')
            }
            this.updateHeight()
        },
        methods: {
            // 添加marker
            addMarker(options) {
                return new Promise((resolve) => {
                    options = {
                        markers: [], // 标记点列表
                        batch: true, // 是否分批次加载
                        threshold: 200, // 每批加载的数量
                        contextWay: false, // 是否以 MapContext.addMarkers 方式添加
                        includePoints: false, // 是否缩放视图以包含标记点
                        ...options
                    }
                    // 清空已添加的 marker
                    if (options.contextWay) {
                        this.mapContext.addMarkers({
                            clear: true,
                            markers: []
                        })
                        this.contextMarkers = options.markers
                    } else {
                        this.setMapProps({
                            markers: []
                        })
                    }
                    // 清除加载计时器
                    clearTimeout(this.substepTimer)
                    // 调整视野
                    if (options.includePoints) {
                        this.mapContext.includePoints({
                            points: options.markers,
                            padding: [40, 40, 40, 40]
                        })
                    }
                    // 分批次加载逻辑
                    if (options.batch && options.markers.length > options.threshold) {
                        let count = -1
                        let total = Math.ceil(options.markers.length / options.threshold)
                        let handle = () => {
                            count += 1
                            let markers = options.markers.slice(count * options.threshold, (count + 1) * options.threshold)
                            if (options.contextWay) {
                                this.mapContext.addMarkers({
                                    markers
                                })
                            } else {
                                this.setMapProps({
                                    markers: this.mapProps.markers.concat(markers)
                                })
                            }
                            if (count < total) {
                                this.substepTimer = setTimeout(handle, 1000)
                            } else {
                                resolve()
                            }
                        }
                        handle()
                    } else {
                        if (options.contextWay) {
                            this.mapContext.addMarkers({
                                markers: options.markers
                            })
                        } else {
                            this.setMapProps({
                                markers: [
                                    ...this.mapProps.markers,
                                    ...options.markers
                                ]
                            })
                        }
                        resolve()
                    }
                })
            },
            // 更新marker
            updateMarker(markerId, props) {
                let index = this.contextMarkers.findIndex(marker => {
                    if (marker.id === markerId) {
                        this.mapContext.addMarkers({
                            markers: [{
                                ...marker,
                                ...props
                            }]
                        })
                        return true
                    }
                })
                if (index === -1) {
                    index = this.mapProps.markers.findIndex((marker, index) => {
                        if (marker.id === markerId) {
                            this.mapProps.markers[index] = {
                                ...marker,
                                ...props
                            }
                            return true
                        }
                    })
                }
            },
            // 移除 marker
            removeMarker(markerIds) {
                markerIds = Array.isArray(markerIds) ? markerIds : [markerIds]
                this.mapContext.removeMarkers({ markerIds })
                this.contextMarkers = this.contextMarkers.filter(item => markerIds.indexOf(item.id) === -1)
                this.mapProps.markers = this.mapProps.markers.filter(item => markerIds.indexOf(item.id) === -1)
            },
            // 设置地图属性
            setMapProps(props) {
                this.mapProps = { ...this.mapProps, ...props }
            },
            // 获取用户当前坐标
            getLocation() {
                return promiseTimeOut(new Promise((resolve, reject) => {
                    uni.getLocation({
                        type: 'gcj02',
                        success: resolve,
                        fail: () => {
                            // 获取失败时，使用当前定位点
                            let { latitude, longitude } = this.mapProps
                            resolve({
                                latitude,
                                longitude
                            })
                        }
                    })
                }), process.env.NODE_ENV === 'development' ? 2000 : 10000)
            },
            // 根据markerId获取marker
            getMarker(markerId) {
                return this.mapProps.markers.find(item => item.id === markerId) || this.contextMarkers.find(item => item.id === markerId)
            },
            // 获取中心坐标和缩放大小
            getCenterAndScale() {
                return new Promise((resolve, reject) => {
                    Promise.all([
                        new Promise((resolve, reject) => {
                            this.mapContext.getScale({
                                success({ scale }) {
                                    resolve(scale)
                                },
                                fail: reject
                            })
                        }),
                        new Promise((resolve, reject) => {
                            this.mapContext.getCenterLocation({
                                success(res) {
                                    resolve(res)
                                },
                                fail: reject
                            })
                        })
                    ]).then(([scale, center]) => {
                        resolve({ scale, center })
                    }).catch(reject)
                })
            },
            // 设置中心坐标和缩放大小
            setCenterAndScale(options) {
                Object.keys(options).forEach(key => {
                    if (['scale', 'latitude', 'longitude'].includes(key)) {
                        this.mapProps[key] = this.mapProps[key] === options[key] ? getDirtyNumber(options[key]) : options[key]
                    }
                })
            },
            // 调整视野以包含所有覆盖物
            includeOverlays(options) {
                this.$nextTick(() => {
                    let points = [
                        ...this.contextMarkers,
                        ...this.mapProps.markers
                    ]
                    let recursion = function(list) {
                        if (list.length && Array.isArray(list[0])) {
                            list.forEach(item => recursion(item))
                        } else {
                            points = points.concat(list)
                        }
                    }
                    recursion(this.mapProps.circles.map(item => item.points))
                    recursion(this.mapProps.polygons.map(item => item.points))
                    recursion(this.mapProps.polyline.map(item => item.points))
                    this.mapContext.includePoints({
                        ...options,
                        points
                    })
                })
            },
            // 更新地图高度
            updateHeight(delay) {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        Promise.all([
                            getElementRect('.sy-map', this),
                            getElementRect('.head', this),
                            getElementRect('.foot', this)
                        ]).then(([res1, res2, res3]) => {
                            let main = res1[0].height
                            let head = res2[0].height + uni.upx2px(this.offsetTop)
                            let foot = res3[0].height + uni.upx2px(this.offsetBottom)
                            this.mapStyle = {
                                top: `${head}px`,
                                height: `${main - head - foot}px`
                            }
                            resolve()
                        }).catch(reject)
                    }, delay || 0)
                })
            },
            // 视图移动到指定marker的位置
            moveToMarker(markerId) {
                this.$nextTick(() => {
                    let marker = this.getMarker(markerId)
                    if (marker) {
                        this.setCenterAndScale({
                            latitude: marker.latitude,
                            longitude: marker.longitude,
                            scale: this.scale
                        })
                    }
                })
            },
            // 回到用户当前定位点
            moveToLocation() {
                this.getLocation().then((location) => {
                    this.setCenterAndScale({
                        latitude: location.latitude,
                        longitude: location.longitude,
                        scale: this.scale
                    })
                })
            },
            // 地图marker点击时触发
            handleMarkerTap({ detail }) {
                let markerId = detail.markerId
                if (this.markerTapAutoLocation) {
                    this.moveToMarker(markerId)
                }
                this.$emit('markertap', markerId)
            },
            // 地图控件点击时触发
            handleControlTap(control) {
                switch (control.name) {
                case 'mapType':
                    this.setMapProps({
                        enableSatellite: control.active
                    })
                    break
                case 'location':
                    this.moveToLocation()
                    break
                case 'add':
                    this.getCenterAndScale().then(({ scale, center }) => {
                        this.setCenterAndScale({
                            latitude: center.latitude,
                            longitude: center.longitude,
                            scale: Math.min(Math.round(scale) + 1, this.mapProps.maxScale)
                        })
                    })
                    break
                case 'sub':
                    this.getCenterAndScale().then(({ scale, center }) => {
                        this.setCenterAndScale({
                            latitude: center.latitude,
                            longitude: center.longitude,
                            scale: Math.max(Math.round(scale) - 1, this.mapProps.minScale)
                        })
                    })
                    break
                }
                this.$emit('controltap', control)
            }
        }
    }
</script>
<style lang="scss" scoped>
.sy-map {
    .head,
    .foot,
    .body {
        position: absolute;
        left: 0;
        right: 0;
    }
    .head {
        top: 0;
        z-index: 2;
    }
    .foot {
        bottom: 0;
        z-index: 2;
    }
    .body {
        z-index: 1;
        transition: all 0.3s;
        map {
            position: absolute;
            width: 100%;
            height: 100%;
        }
    }
    .control-position {
        position: absolute;
        z-index: 2;
    }
}
</style>

