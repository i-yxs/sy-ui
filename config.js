console.log.apply(void 0, [`%c environment %c ${process.env.NODE_ENV} `, 'padding: 1px; border-radius: 10px 0 0 10px; color: #fff; background: #606060;', 'padding: 1px; border-radius: 0 10px 10px 0; color: #fff; background: #1475b2;'])

export default {
    development: {
        // 本地环境
        BASE_API: 'xxx'
    },
    production: { // 生产
        BASE_API: 'xxx'
    }
}[process.env.NODE_ENV]
