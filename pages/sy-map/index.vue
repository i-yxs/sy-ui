<template>
    <view class="content">
        <sy-map
            ref="SyMap"
            :control="control"
            offset-top="-40"
            offset-bottom="-40"
            @ready="handleReady"
            @markertap="handleMarkertap"
        >
            <view slot="head" class="head-wrap">
                头部
            </view>
            <view slot="foot" class="foot-wrap">
                底部
            </view>
        </sy-map>
    </view>
</template>
<script>
    import StyleVars from '@/uni.scss'

    const base64Icon = [
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAABCCAMAAADUivDaAAABF1BMVEUAAAAWm/9Crf8bnf8in/8upf86qv9Xt/9wwv9v0v9V//8+rP95x/8pov90xP96zP8Pl/8ypv9Ps/9Utv9ZuP9ovv9twf9zxP92xv93xv94yf8mof9kvP9wwf95zP9Lsf9Stf9mvf9qv/91xf92xP9Gr/9euv9fu/9ivP8AkP////8Ek/8HlP8Mlv/1/P/E5v+k2P9cuf/7/v/u+P/M6f96xv+Dyv9+x/8qo/8nov/i8//G5/+s2/9rwP9kvP/p9v/W7v+R0P+HzP9wwv9RtP87qv8Xm//y+v++5P+y3v+W0v9Drv8env8Smf+o2v+Lzv/k9P9Msv9Crf8upf8joP/f8v/H5/+24P+c1f9Vtv9JsP8zp/9Hr/9CSLpfAAAAKXRSTlMA/N/7+fLouWAHA+Qo9UwX/e/LvrOEaFM4MyP3k1sS0sKMe0ZB2qahman4728AAAM2SURBVFjDpdWHYtowEAbgMw0zzWqa2STd4z9sY6CBsEkgCVDI7u77P0cDtmQqLAz0e4CTbkhHWsnteGTFsNKWsRKJbydpXqk3EQvjrMibFM3j9RImLb2mmSWiCBZN0EzWItCLrFG43ReY5sVueBIGpjPCktkyEcbcomkO1Qjp/u9+Wo1xSHpPn2DMINtt8FCjmx1gzJOn+nncgK/v5NiXc/rwbWhn9Rkks2Dzv+yCCekZBXvnJ33xjSd9u/BL9I4C+SN18pWDfD3xR4yC7Ph3uOFgN/49dihATN4ywzoZmWuMJr2FcMp6pxDe0oRNeB5yrJd7gGeTJsgfwmGpdmGzwpG/B6n24CmxL4tL5h8nI012leDZI8UBPMfs6WazffzMXl99efSAz+w6hudAO5myHT9KJQulUp2HzmSIjJxQXUsHrCaihOCBaKuumucsXObzP1HO58vFR3d+iHNdPQ242iz8xohVwZAfog2XQQoLrhoLhXr9Fuf1WgW1z49s2Wm4LFKkZUOEXLWcGU5qBWfs81uSJoX4r+oslHGdQaF844boVdlTF38XKcT2+eU/KTjDBt67Ib5csOeX2EukWIbrnoUrdDL4c9yr4LzZrFqyVfdwLZMiLjLMy3KiPqpF3i1TgV15UbU4KRLwXI31vz16+J1Wrdbq5eTlPAlSpNbhysrT2gUg22k28nbOti8btphY13qKdMWwGjzyHQ47A/gq7k6x/FKotuBpsas4fB/N787pWaF4/Mi9RQueLZqQEpNhllmvbIqpSNGkODy3rHcLz/PAhSq3VZF1inLb7VOQlxCqHKwK4aVmr1tyk/Q4SE9uEUu32zchtXKsyrUgbZLGmgGp1FUidEuQjDXS+YAxd1WbBbt6hzEfSSsVxTizfe10mh3num1iXDRFeqsmwpmrNE0c4eI0VfIFwqwkabrDNKZL71CY55juOYWLYZoYzWDfgN6TfZrFdlpfiG2aTXzhQviWEWyZZna0EjwRazS7PQOTjD2aR8KEykzQfD5BdUDzeqVEeEXze49xEVpAMgZfLEmLOIpCiB7RYp4uwbW0T4vaNdy3tUuL21kHsL5K/2N1w9oIi/AXtDCMnaBXgigAAAAASUVORK5CYII=',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAABCCAMAAADUivDaAAABU1BMVEUAAADwd2rxem7xfnLygnbxhXr/vbH/qqrzjIL3raX0nZXvbF/zkIX0mY/4saj5tKz/tq3wc2byiHz0koj1nJL0nZP1n5b1qKD2rqf3sqn6s6vzjoPykYf2pZ31qqP3rqX4s6z/urDzlYv1pJv2pp73qKD3raX4r6j3san4tK3zjIH0oZjualz/////X1T//f3vb2LvbmD/Zlv/YlfvcWT/7+7/5uTvbV//+vr/9vX/9PP/rKf/3tz839v6z8r/zcr5y8b1opn0mY//cmj/1tP/ubX/o5z/mJD/jIT/hHz/b2X/a2H/+fn97ev/4uD92tf60s7/0M3/w77/vrn/tK/2san2qqLzj4Txg3b/fXTxfnH/eG/wem3/dWvwdmr/+Pf/6uj/kYnyh3z/yMT4wrz4vrj4u7X3uLH3tK32raX/p6HzlYv/iYDxgXXwdGf/8fD/nJa0LgjwAAAALHRSTlMA/fv59vIHA+dfuf7izEwpF/3v3sC8s4RTODPl35NpWyQS152Me2RGQSLppmk40vEAAAN6SURBVFjDpdbnVxpBEADwgVAMGkMssbf0MrPIHSBNQFCKaKyxRhNN7/n/P8WLzHLe3d4B+X3hPW7e3exsmQWl0GxkOuBLYMIXmI7MhqBb4ccDCTRLDDwOQzce3UK7W4+gY7eD6Cx4GzoSHUa14Sh4mwigm8CE9yB86M7nNZixRfSyOAZu5uJ4U/zk8sT23xyo3fWjya+V7SwZstsrv9DEfxdUQkPY9qYUo7ZY6Q22DYVA4Y5pwJ/TdFP6s6lMd8DZs35k58tkt3yOrP8ZOJpGdrRJTjaPkA2Dk/F2GZLkLNkuyDg46OOnS8uksrzEQX1g9xTZR1L7iOwp2Izws5MYqcVOOGwEbOQJUSJW/Wa8be94ldpK8vQAq0l+9FMmkdXrxnfPxF6xWNzhNH5y4CRYzPCT18TWhPH59+IfjVpec+CMcmXK6UhXGpR7n9fEbrGYEzU5KcoVylN6HpNJ6PktUWvqWiObap6+lQU952lVVfOQQ/NapVZp/m7srmpnFe0VSYeqevJhVebIV0JoYp/SRk1ELUZSmY8vsOBteCATzm/Um1fpp3O6vi5Od4gd8GYGiyU5IdKq2KXsfkWc5TdyuvjxzjIlS2DB59UKsfRpY3MtJ7RvWzGiVEPjvbfCZxdYcPf5LgdSF+u6ntnPpPT13FUGsqDfuS+BxRReuyRW0ep7RvKZvWMhfqSIXeK1KbCI8AgzHJpKX/8Ys1M9lusiw1UbtbUgbCmQlNy9uNgRZ7kUmRQ40NaSwvcs9UxerAuhV/PVq5/j/U1iXM17YbAa4ItEtpWwOK0WM0ZdV/80hai3FleWrx0DYDOGLV85DZJiO7U1uvaVw8bAJuznVZcktSSvYn8Y7CIot4lamYPuOzZU2X6/kMoX2ZrnPfphgZwVkD1Q9PWE7CQfyMkH2UUSqt4+itJBzH7+H6A0CgpRH0pH23TT9hFKviiovESTw8IGsY3CIZo8BKVwEM0Wy59KW6mt0qfyIpoFw6A2GEdv8UFwM4reIuAqFEAvgRC4m+tHd/3j4OU+ursP3vrQTR90YN6Pav7n0IlZl0I8gc5EeiyE/Ry1m4KOLQScV0QUOjfpQzvfJHTjSdy+NW5Ddx6i1Qx0awRvGoHuPUCzYehByLzSX4SgFwtBZMEF6M38Lb4fPodeTfjQ4J+A3o3fM24Sg/A/BocSQ15v+Avfe7FZNW4ZOQAAAABJRU5ErkJggg=='
    ]

    export default {
        props: {},
        data() {
            return {
                control: {
                    padding: { top: 40, bottom: 40 },
                    control: [
                        {
                            name: 'checkPoint',
                            icon: 'sy-ui-icon-download',
                            activeColor: StyleVars.APP_COLOR,
                            position: 'right-bottom'
                        },
                        {
                            name: 'workTrack',
                            icon: 'sy-ui-icon-address',
                            activeColor: StyleVars.APP_COLOR,
                            active: true,
                            position: 'right-bottom'
                        },
                        {
                            name: 'workGrids',
                            icon: 'sy-ui-icon-star',
                            activeIcon: 'sy-ui-icon-star-fill',
                            activeColor: StyleVars.APP_COLOR,
                            position: 'right-bottom'
                        },
                        // 修改默认控件
                        {
                            name: 'mapType',
                            position: 'left-top'
                        },
                        {
                            name: 'location',
                            activeColor: StyleVars.APP_COLOR
                        }
                    ]
                }
            }
        },
        mounted() {
        },
        methods: {
            handleReady() {
                let markers = [
                    { 'latitude': 22.535089477680426, 'longitude': 113.92884525338286 },
                    { 'latitude': 22.533268028989514, 'longitude': 113.9298419755296 },
                    { 'latitude': 22.53493109171383, 'longitude': 113.93154604894062 },
                    { 'latitude': 22.534030268574806, 'longitude': 113.9307743930085 },
                    { 'latitude': 22.532733468795417, 'longitude': 113.9315567663989 },
                    { 'latitude': 22.532337496971735, 'longitude': 113.9301742162861 },
                    { 'latitude': 22.53292155505647, 'longitude': 113.92907031967934 },
                    { 'latitude': 22.531595046964355, 'longitude': 113.92916677672201 },
                    { 'latitude': 22.531595046964355, 'longitude': 113.9314710268145 },
                    { 'latitude': 22.5338718814311, 'longitude': 113.93157820115175 },
                    { 'latitude': 22.534396537981056, 'longitude': 113.92930610335225 },
                    { 'latitude': 22.535158771474237, 'longitude': 113.93038856511293 }
                ].map((item, index) => {
                    let {longitude, latitude} = item
                    return {
                        id: index,
                        zIndex: 1,
                        latitude,
                        longitude,
                        iconPath: base64Icon[0],
                        width: 32,
                        height: 32
                    }
                })
                this.$refs.SyMap.addMarker({
                    markers,
                    threshold: 200,
                    // contextWay: true,
                    includePoints: true
                })
            },
            handleMarkertap(markerId) {
                if (!this.isEmpty(this.activeMarkerId)) {
                    // 还原选中的marker
                    this.$refs.SyMap.updateMarker(this.activeMarkerId, {
                        width: 32,
                        height: 32,
                        iconPath: base64Icon[0]
                    })
                }
                this.activeMarkerId = markerId
                this.$refs.SyMap.updateMarker(markerId, {
                    width: 40,
                    height: 40,
                    iconPath: base64Icon[1]
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
.content{
    height: 100%;
    .head-wrap,
    .foot-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 40rpx;
        font-weight: bold;
        background: #fff;
    }
    .head-wrap {
        height: 100rpx;
        border-radius: 0 0 40rpx 40rpx;
        box-shadow: 0 2rpx 7rpx 0 rgba(228, 227, 227, 0.5);
    }
    .foot-wrap {
        height: 200rpx;
        border-radius: 40rpx 40rpx 0 0;
        box-shadow: 0 -2rpx 7rpx 0 rgba(228, 227, 227, 0.5);
    }
}
</style>
