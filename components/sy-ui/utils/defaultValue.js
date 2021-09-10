
import styleVars from '@/uni.scss'

export default {
    input: {
        rows: 1,
        height: '68rpx',
        maxlength: 140,
        iconStryls: {
            size: '30rpx',
            color: '#c5c5c5'
        }
    },
    radio: {
        size: '36rpx',
        color: styleVars.APP_COLOR
    },
    button: {
        styles: {
            height: '90rpx',
            borderRadius: '45rpx',
            fontSize: '30rpx'
        }
    },
    checkbox: {
        size: '36rpx',
        color: styleVars.APP_COLOR
    },
    textarea: {
        height: '140rpx',
        maxlength: 140
    },
    pickerInput: {
        height: '68rpx',
        suffixIcon: 'sy-ui-icon-arrow-right'
    },
    pickerLocation: {
        prefixIcon: 'sy-ui-icon-address',
        inputProps: {
            prefixIconStyles: {
                color: styleVars.APP_COLOR
            }
        }
    },
    pickerDate: {
        format: 'YYYY-MM-DD',
        separator: '至',
        valueFormat: 'YYYY-MM-DD',
        firstDayOfWeek: 1
    }
}
