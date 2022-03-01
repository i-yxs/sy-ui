import { getMileage } from '@/components/sy-ui/utils'
// 每个轨迹点相对于第一个轨迹点所处的距离，用于同步开始播放时的时间
var segments = []
// 当前播放进度处于第几个线段中
var progressIndex = 0
// 一共有多少个线段
var segmentCount = 0
// 开始播放时的时间戳
var startPlayTime = 0
// 暂停播放时的时间戳
var pausePlayTime = 0
// 保存每一次loop的时间戳
var previousTime = 0
// 相对于播放时已经过去的时间
var relativeTime = 0
// 循环计时器
var loopTimer = null

class TrackPlay {
    constructor(polyline) {
        // 轨迹总里程
        this.mileage = 0
        // 轨迹数据
        this.polyline = []
        // 播放的速度（每秒前进多少米）
        this.speed = 1
        // 更新间隔
        this.interval = 42
        // 当前已播放的点
        this.playedPoint = []
        // 更新回调
        this.updateCallBack = null
        // 播放结束回调
        this.overCallBack = null

        this.loop = this.loop.bind(this)

        this.setPoints(polyline)
    }
    loop() {
        loopTimer = setTimeout(this.loop, this.interval)
        this.update()
    }
    // 开始播放
    start() {
        if (pausePlayTime) {
            startPlayTime += Date.now() - pausePlayTime
        } else {
            this.playedPoint = []
            startPlayTime = Date.now()
        }
        previousTime = startPlayTime
        this.loop()
    }
    // 暂停
    pause() {
        pausePlayTime = Date.now()
        clearTimeout(loopTimer)
    }
    // 停止
    stop() {
        relativeTime = 0
        progressIndex = 0
        pausePlayTime = 0
        clearTimeout(loopTimer)
    }
    // 更新帧
    update() {
        let nowTime = Date.now()
        // 计算已经过去的时间，并根据播放速度修正
        relativeTime += (nowTime - previousTime) * this.speed
        previousTime = nowTime
        // 根据已播放时间计算出当前应移动的里程
        let mileage = relativeTime / 1e3
        // 如果当前移动的里程大于当前线段的里程，progressIndex + 1
        while (mileage >= segments[progressIndex]) {
            let point1 = this.polyline[progressIndex]
            let point2 = this.polyline[progressIndex - 1]
            this.playedPoint[progressIndex] = {
                latitude: point1.latitude,
                longitude: point1.longitude
            }
            this.playedPoint.push({
                latitude: point1.latitude,
                longitude: point1.longitude
            })
            if (++progressIndex > segmentCount) {
                point1 = this.polyline[Math.max(progressIndex - 2, 0)]
                // 播放完毕
                this.stop()
                this.updateCallBack && this.updateCallBack({
                    date: new Date(this.polyline.slice(-1)[0].timestamp),
                    point: this.playedPoint,
                    rotate: this.getAngle(point1.longitude, point1.latitude, point2.longitude, point2.latitude),
                    progress: 1
                })
                loopTimer = setTimeout(this.overCallBack, this.interval)
                return
            }
        }
        // 根据过去的时间减当前线段第一个点的时间得到相对于当前线段时间的比例
        let progress = mileage / this.mileage
        let segmentScale = (mileage - segments[progressIndex - 1]) / (segments[progressIndex] - segments[progressIndex - 1])
        // 根据当前时间比例计算出当前线段上相同比例的点
        let point1 = this.polyline[progressIndex - 1]
        let point2 = this.polyline[progressIndex]
        this.playedPoint[progressIndex] = {
            latitude: (point2.latitude - point1.latitude) * segmentScale + point1.latitude,
            longitude: (point2.longitude - point1.longitude) * segmentScale + point1.longitude
        }
        this.updateCallBack && this.updateCallBack({
            date: new Date((point2.timestamp - point1.timestamp) * segmentScale + point1.timestamp),
            point: this.playedPoint,
            rotate: this.getAngle(point1.longitude, point1.latitude, point2.longitude, point2.latitude),
            progress
        })
    }
    // 设置点
    setPoints(polyline = []) {
        if (polyline.length) {
            segments = []
            segmentCount = polyline.length - 1
            polyline.forEach((point, index) => {
                if (index > 0) {
                    let point2 = polyline[index - 1]
                    let mileage = getMileage(point.longitude, point.latitude, point2.longitude, point2.latitude, false)
                    segments.push(mileage + segments[index - 1])
                } else {
                    segments.push(0)
                }
            })
            this.mileage = segments.slice(-1)[0]
            this.polyline = polyline
        }
    }
    // 获取两个坐标点之间的角度
    getAngle(lng1, lat1, lng2, lat2) {
        var ret
        var w1 = lat1 / 180 * Math.PI
        var j1 = lng1 / 180 * Math.PI
        var w2 = lat2 / 180 * Math.PI
        var j2 = lng2 / 180 * Math.PI
        ret = 4 * Math.pow(Math.sin((w1 - w2) / 2), 2) - Math.pow(Math.sin((j1 - j2) / 2) * (Math.cos(w1) - Math.cos(w2)), 2)
        ret = Math.sqrt(ret)
        var temp = Math.sin((j1 - j2) / 2) * (Math.cos(w1) + Math.cos(w2))
        if (temp) {
            ret = ret / temp
            ret = Math.atan(ret) / Math.PI * 180
            ret += 90
            if (j1 - j2 < 0) {
                if (w1 - w2 < 0) {
                    ret
                } else {
                    ret = -ret + 180
                }
            } else {
                if (w1 - w2 < 0) {
                    ret = 180 + ret
                } else {
                    ret = -ret
                }
            }
            return ret
        } else {
            return 0
        }
    }
}
export default TrackPlay
