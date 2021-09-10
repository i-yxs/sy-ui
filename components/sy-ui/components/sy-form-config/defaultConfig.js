
import defaultValue from '@/components/sy-ui/utils/defaultValue'

export default {
    /**
     * default- 开头的配置用于配置项没有值时的默认值
     */
    // 表单项是否以横向排列
    'default-cell': [
        {
            'name': 'default',
            'rule': {
                'return': false
            }
        }
    ],
    // 标签容器和输入容器是否以纵向排列
    'default-column': [
        {
            'name': 'styleType',
            'rule': {
                'form': false,
                'filter': true
            }
        },
        {
            'name': 'type',
            'rule': [
                {
                    'regex': '^upload$|^textarea$',
                    'return': true
                }
            ]
        },
        {
            'name': 'styleType',
            'rule': {
                'readonly': false
            }
        }
    ],
    // 表单项是否显示
    'default-visible': [
        {
            'name': 'default',
            'rule': {
                'return': true
            }
        }
    ],
    // 表单项是否必填
    'default-required': [
        {
            'name': 'styleType',
            'rule': {
                'readonly': false
            }
        }
    ],
    // 表单项是否只展示，不能编辑
    'default-readonly': [
        {
            'name': 'default',
            'rule': {
                'return': false
            }
        }
    ],
    // 表单项是否显示标签
    'default-showLabel': [
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
    // 表单项是否显示标签冒号
    'default-showLabelColon': [
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
    // 表单项的左右对齐方式
    'default-align': [
        {
            'name': 'styleType',
            'rule': {
                'form': 'right',
                'filter': 'left'
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
    // 表单项的显示行数
    'default-rows': [
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
        }
    ],
    // 表单项组件的树结构深度
    'default-deep': [
        {
            'name': 'default',
            'rule': {
                'return': 999
            }
        }
    ],
    // 表单项组件的高度
    'default-height': [
        {
            'name': 'type',
            'rule': [
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
    'default-clearable': [
        {
            'name': 'styleType',
            'rule': {
                'form': false,
                'filter': true
            }
        }
    ],
    // 表单项组件的占位符
    'default-placeholder': [
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
    'default-maxlength': [
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
    // 表单项组件的输入框类型
    'default-inputType': [
        {
            'name': 'default',
            'rule': {
                'return': 'text'
            }
        }
    ],
    // 表单项组件的间隔符
    'default-separator': [
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
                    'regex': '^pickerDate$',
                    'return': '至'
                }
            ]
        }
    ],
    // 表单项上传组件是否是单文件模式
    'default-monofile': [
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
    // 其他配置
    'default-trueLabel': [
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
    'default-trueValue': [
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
    'default-falseValue': [
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
    'default-falseLabel': [
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
    'default-labelKey': [
        {
            'name': 'default',
            'rule': {
                'return': 'label'
            }
        }
    ],
    'default-valueKey': [
        {
            'name': 'default',
            'rule': {
                'return': 'value'
            }
        }
    ],
    'default-childrenKey': [
        {
            'name': 'default',
            'rule': {
                'return': 'children'
            }
        }
    ],
    'default-prefixIcon': [
        {
            'name': 'type',
            'rule': [
                {
                    'regex': '^picker',
                    'return': defaultValue.pickerInput.prefixIcon
                },
                {
                    'regex': '^pickerLocation$',
                    'return': defaultValue.pickerLocation.prefixIcon
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
    'default-suffixIcon': [
        {
            'name': 'type',
            'rule': [
                {
                    'regex': '^picker',
                    'return': defaultValue.pickerInput.suffixIcon
                }
            ]
        }
    ],
    'default-inputProps': [
        {
            'name': 'type',
            'rule': [
                {
                    'regex': '^pickerLocation$',
                    'return': defaultValue.pickerLocation.inputProps
                }
            ]
        }
    ]
}
