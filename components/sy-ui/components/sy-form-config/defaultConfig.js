
import inputProps from '../sy-input/props'
import pickerInputProps from '../sy-picker-input/props'

export default {
    /**
     * form配置
     */
    // 表单项是否以横向排列
    'cell': [
        {
            'name': 'default',
            'rule': {
                'return': false
            }
        }
    ],
    // 表单项的左右对齐方式
    'align': [
        {
            'name': 'styleType',
            'rule': {
                'form': 'right',
                'filter': 'right'
            }
        },
        {
            'name': 'prop',
            'rule': [
                {
                    // 表单项 readonly = true 时返回 true
                    'name': 'readonly',
                    'value': true,
                    'return': 'left'
                }
            ]
        },
        {
            'name': 'type',
            'rule': [
                {
                    'regex': '^textarea$',
                    'return': 'left'
                }
            ]
        }
    ],
    // 标签容器和输入容器是否以纵向排列
    'column': [
        {
            'name': 'styleType',
            'rule': {
                'form': false,
                'filter': false
            }
        },
        {
            'name': 'type',
            'rule': [
                {
                    'regex': '^textarea$',
                    'return': true
                }
            ]
        },
        {
            'name': 'styleType',
            'rule': {
                'readonly': false
            }
        },
        {
            'name': 'type',
            'rule': [
                {
                    'regex': '^upload$',
                    'return': true
                }
            ]
        }
    ],
    // 表单项是否显示
    'visible': [
        {
            'name': 'default',
            'rule': {
                'return': true
            }
        }
    ],
    // 表单项是否必填
    'required': [
        {
            'name': 'styleType',
            'rule': {
                'readonly': false
            }
        }
    ],
    // 表单项是否只展示，不能编辑
    'readonly': [
        {
            'name': 'default',
            'rule': {
                'return': false
            }
        }
    ],
    // 表单项是否显示标签
    'showLabel': [
        {
            'name': 'default',
            'rule': {
                'return': true
            }
        },
        {
            'name': 'prop',
            'rule': [
                {
                    'name': 'readonly',
                    'value': true,
                    'return': true
                }
            ]
        },
        {
            'name': 'type',
            'rule': [
                {
                    'regex': '^uploadCard$',
                    'return': false
                }
            ]
        }
    ],
    // 标签文本垂直对齐方式
    'labelAlign': [
        {
            'name': 'styleType',
            'rule': {
                'form': 'center',
                'filter': 'center'
            }
        }
    ],
    // 表单项是否显示标签冒号
    'showLabelColon': [
        {
            'name': 'prop',
            'rule': [
                {
                    // 表单项 readonly = true 时返回 true
                    'name': 'readonly',
                    'value': true,
                    'return': true
                }
            ]
        }
    ],
    // 表单项上传组件是否是单文件模式
    'monofile': [
        {
            'name': 'default',
            'rule': {
                'return': false
            }
        },
        {
            'name': 'type',
            'rule': [
                {
                    'regex': '^uploadCard$',
                    'return': true
                }
            ]
        }
    ],
    /**
     * 组件配置
     */
    // 表单项的显示行数
    'props.rows': [
        {
            'name': 'default',
            'rule': {
                'return': 1
            }
        },
        {
            'name': 'prop',
            'rule': [
                {
                    'name': 'readonly',
                    'value': true,
                    'return': ''
                }
            ]
        },
        {
            'name': 'styleType',
            'rule': {
                'readonly': ''
            }
        }
    ],
    // 表单项组件的树结构深度
    'props.deep': [
        {
            'name': 'default',
            'rule': {
                'return': 999
            }
        }
    ],
    // 表单项组件的输入框类型
    'props.type': [
        {
            'name': 'type',
            'rule': [
                {
                    'regex': '^input$',
                    'return': 'text'
                },
                {
                    'regex': '^pickerDate$',
                    'return': 'date'
                },
                {
                    'regex': '^pickerDateTime$',
                    'return': 'date'
                }
            ]
        }
    ],
    // 表单项组件的高度
    'props.height': [
        {
            'name': 'type',
            'rule': [
                {
                    'regex': '^input$',
                    'return': inputProps.height.default
                },
                {
                    'regex': '^picker',
                    'return': pickerInputProps.height.default
                },
                {
                    'regex': '^textarea$',
                    'return': '150rpx'
                }
            ]
        },
        {
            'name': 'prop',
            'rule': [
                {
                    'name': 'readonly',
                    'value': true,
                    'return': 'auto'
                }
            ]
        }
    ],
    // 表单项组件是否可清空
    'props.clearable': [
        {
            'name': 'styleType',
            'rule': {
                'form': false,
                'filter': true
            }
        }
    ],
    // 表单项组件的占位符
    'props.placeholder': [
        {
            'name': 'type',
            'rule': [
                {
                    'regex': '^input$|^textarea$',
                    'return': '请输入'
                }
            ]
        },
        {
            'name': 'prop',
            'rule': [
                {
                    'name': 'readonly',
                    'value': true,
                    'return': '- -'
                }
            ]
        }
    ],
    // 表单项组件的最大输入字数
    'props.maxlength': [
        {
            'name': 'type',
            'rule': [
                {
                    'regex': '^input$',
                    'return': 140
                },
                {
                    'regex': '^textarea$',
                    'return': -1
                },
                {
                    'regex': '^inputCaptcha$',
                    'return': 6
                }
            ]
        }
    ],
    // 表单项组件的间隔符
    'props.separator': [
        {
            'name': 'default',
            'rule': {
                'return': '/'
            }
        },
        {
            'name': 'type',
            'rule': [
                {
                    'regex': '^inputRange$',
                    'return': '至'
                },
                {
                    'regex': '^pickerDate$',
                    'return': ' 至 '
                },
                {
                    'regex': '^checkbox$',
                    'return': '，'
                }
            ]
        }
    ],
    // 其他配置
    'props.trueLabel': [
        {
            'name': 'type',
            'rule': [
                {
                    'regex': '^switch$',
                    'return': '是'
                }
            ]
        }
    ],
    'props.trueValue': [
        {
            'name': 'type',
            'rule': [
                {
                    'regex': '^switch$',
                    'return': true
                }
            ]
        }
    ],
    'props.falseValue': [
        {
            'name': 'type',
            'rule': [
                {
                    'regex': '^switch$',
                    'return': false
                }
            ]
        }
    ],
    'props.falseLabel': [
        {
            'name': 'type',
            'rule': [
                {
                    'regex': '^switch$',
                    'return': '否'
                }
            ]
        }
    ],
    'props.labelKey': [
        {
            'name': 'default',
            'rule': {
                'return': 'label'
            }
        }
    ],
    'props.valueKey': [
        {
            'name': 'default',
            'rule': {
                'return': 'value'
            }
        }
    ],
    'props.childrenKey': [
        {
            'name': 'default',
            'rule': {
                'return': 'children'
            }
        }
    ],
    'props.prefixIcon': [
        {
            'name': 'type',
            'rule': [
                {
                    'regex': '^picker',
                    'return': pickerInputProps.prefixIcon.default
                },
                {
                    'regex': '^pickerLocation$',
                    'return': pickerInputProps.prefixIcon.default
                }
            ]
        },
        {
            'name': 'prop',
            'rule': [
                {
                    'name': 'readonly',
                    'value': false,
                    'return': ''
                }
            ]
        }
    ],
    'props.suffixIcon': [
        {
            'name': 'type',
            'rule': [
                {
                    'regex': '^picker',
                    'return': pickerInputProps.suffixIcon.default
                }
            ]
        }
    ],
    'props.button': [
        {
            'name': 'default',
            'rule': {
                'return': true
            }
        }
    ],
    'props.showAllLevels': [
        {
            'name': 'default',
            'rule': {
                'return': true
            }
        }
    ],
    'props.quickInput': [
        {
            'name': 'default',
            'rule': {
                'return': 0
            }
        }
    ]
}
