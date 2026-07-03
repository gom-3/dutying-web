import {zh as generatedZh} from '../i18n/resources.generated';
import {type TLocale} from './ko';

export const zh = {
    ...generatedZh,
    page: {
        ...generatedZh.page,
        notifications: {
            openAria: '打开通知',
            panelAria: '通知列表',
            title: '通知',
            unreadCount: '{{count}} 条未读通知',
            unreadShort: '未读 {{count}}',
            justNow: '刚刚',
            minutesAgo: '{{count}} 分钟前',
            hoursAgo: '{{count}} 小时前',
            loadFailed: '无法加载通知。',
            retry: '重试',
            empty: '没有新通知。',
        },
        makeShift: {
            ...generatedZh.page.makeShift,
            calendar: {
                ...generatedZh.page.makeShift.calendar,
                fixedStatusPin: '固定班次',
                requestStatusPin: '申请班次',
            },
            constraints: {
                ...generatedZh.page.makeShift.constraints,
                option: {
                    ...generatedZh.page.makeShift.constraints.option,
                    weekdays: '工作日',
                    weekendsAndHolidays: '周末/节假日',
                    preceptorBadge: '带教老师',
                    precepteeBadge: '被带教',
                },
                templates: {
                    CORE_MAX_CONTINUOUS_WORK: {
                        label: '重要基础条件',
                        sentence: '{target}不能连续工作{count}天或以上',
                    },
                    CORE_MIN_NIGHT_INTERVAL: {
                        label: '重要基础条件',
                        sentence: '{target}的N班之间至少需要间隔{count}天',
                    },
                    CORE_MAX_CONTINUOUS_NIGHT: {
                        label: '重要基础条件',
                        sentence: '{target}连续N班最多只能安排{count}次',
                    },
                    CORE_MIN_OFF_AFTER_NIGHT: {
                        label: '重要基础条件',
                        sentence: '{target}在N班后至少需要{count}天OFF',
                    },
                    CORE_EXCLUDE_NIGHT_BEFORE_REQ_OFF: {
                        label: '重要基础条件',
                        sentence: '{target}在申请OFF的前一天不能安排N班',
                    },
                    MIN_STAFF_BY_SHIFT: {
                        label: '人数条件',
                        sentence: '{shift}班至少需要{count}人',
                    },
                    MAX_STAFF_BY_SHIFT: {
                        label: '人数条件',
                        sentence: '{shift}班最多可安排{count}人',
                    },
                    MIN_STAFF_BY_DATE_SHIFT: {
                        label: '人数条件',
                        sentence: '每月{date}日的{shift}班至少需要{count}人',
                    },
                    MIN_STAFF_BY_DAY_TYPE_SHIFT: {
                        label: '人数条件',
                        sentence: '{date}的{shift}班至少需要{count}人',
                    },
                    MIN_STAFF_WEEKEND_HOLIDAY_SHIFT: {
                        label: '人数条件',
                        sentence: '周末和节假日的{shift}班至少需要{count}人',
                    },
                    MAX_CONSECUTIVE_WORK_DAYS: {
                        label: '工作休息条件',
                        sentence: '{target}不能连续工作{count}天或以上',
                    },
                    OFF_AFTER_CONSECUTIVE_WORK: {
                        label: '工作休息条件',
                        sentence: '{target}连续工作{count}天后需要OFF',
                    },
                    MIN_OFF_AFTER_N: {
                        label: '工作休息条件',
                        sentence: '{target}在N班后至少需要{count}天OFF',
                    },
                    MIN_MONTHLY_OFF: {
                        label: '工作休息条件',
                        sentence: '{target}每月至少需要{count}天OFF',
                    },
                    NURSE_FORBID_WEEKEND: {
                        label: '个人条件',
                        sentence: '{nurse}不能在周末工作',
                    },
                    NURSE_NOT_ALONE_N: {
                        label: '熟练度条件',
                        sentence: '{nurse}不能单独上N班',
                    },
                    NEW_NURSE_NOT_ALONE_N: {
                        label: '熟练度条件',
                        sentence: '{nurse}不能单独上N班',
                    },
                    PRECEPTEE_NOT_ALONE_N: {
                        label: '熟练度条件',
                        sentence: '{preceptee}不能单独上N班',
                    },
                    MIN_PROFICIENCY_STAFF_BY_SHIFT: {
                        label: '熟练度条件',
                        sentence: '{shift}班至少需要{count}名LV{level}以上护士',
                    },
                    IMPORTANT_MAX_WORK_STREAK: {
                        label: '重要基础条件',
                        sentence: '连续工作最多允许{days}天',
                    },
                    IMPORTANT_MAX_SAME_DUTY_STREAK: {
                        label: '重要基础条件',
                        sentence: '同一班次连续工作最多允许{days}天',
                    },
                    IMPORTANT_MIN_NIGHT_INTERVAL: {
                        label: '重要基础条件',
                        sentence: 'N班之间至少需要间隔{days}天',
                    },
                    IMPORTANT_MAX_NIGHT_STREAK: {
                        label: '重要基础条件',
                        sentence: '连续N班最多允许{days}天',
                    },
                    IMPORTANT_OFF_AFTER_NIGHT: {
                        label: '重要基础条件',
                        sentence: 'N班后至少需要{days}天OFF',
                    },
                    IMPORTANT_NO_NIGHT_BEFORE_REQUEST_OFF: {
                        label: '重要基础条件',
                        sentence: '申请OFF的前一天不能安排N班',
                    },
                    IMPORTANT_FORBIDDEN_DUTY_PATTERNS: {
                        label: '重要基础条件',
                        sentence: '避免ND / ED / NE / NOD组合',
                    },
                    SOFT_MIN_STAFF_BY_DUTY: {
                        label: '人数条件',
                        sentence: '{duty}班至少需要{count}人',
                    },
                    SOFT_MAX_STAFF_BY_DUTY: {
                        label: '人数条件',
                        sentence: '{duty}班最多可安排{count}人',
                    },
                    SOFT_MIN_STAFF_BY_DATE_DUTY: {
                        label: '人数条件',
                        sentence: '{date}的{duty}班至少需要{count}人',
                    },
                    SOFT_MIN_STAFF_WEEKEND_HOLIDAY: {
                        label: '人数条件',
                        sentence: '周末和节假日的{duty}班至少需要{count}人',
                    },
                    SOFT_NO_N_TO_D: {
                        label: '禁止模式条件',
                        sentence: '{target}避免N班次日安排D班',
                    },
                    SOFT_NO_N_TO_E: {
                        label: '禁止模式条件',
                        sentence: '{target}避免N班次日安排E班',
                    },
                    SOFT_NO_E_TO_D: {
                        label: '禁止模式条件',
                        sentence: '{target}避免E班次日安排D班',
                    },
                    SOFT_MAX_CONSECUTIVE_N: {
                        label: '禁止模式条件',
                        sentence: '{target}连续N班最多{count}次',
                    },
                    SOFT_MAX_CONSECUTIVE_WORK: {
                        label: '工作休息条件',
                        sentence: '{target}连续工作最多{days}天',
                    },
                    SOFT_NEED_OFF_AFTER_CONSECUTIVE: {
                        label: '工作休息条件',
                        sentence: '{target}连续工作{days}天后需要OFF',
                    },
                    SOFT_NEED_OFF_AFTER_N: {
                        label: '工作休息条件',
                        sentence: '{target}在N班后至少需要{days}天OFF',
                    },
                    SOFT_MIN_MONTHLY_OFF: {
                        label: '工作休息条件',
                        sentence: '{target}每月至少需要{days}天OFF',
                    },
                    SOFT_NO_WEEKEND_FOR_NURSE: {
                        label: '个人条件',
                        sentence: '{nurse}不能在周末工作',
                    },
                    SOFT_NEWBIE_NO_SOLO_N: {
                        label: '熟练度条件',
                        sentence: '{nurse}不能单独上N班',
                    },
                    SOFT_MIN_SKILL_IN_DUTY: {
                        label: '熟练度条件',
                        sentence: '{duty}班至少需要{count}名LV{level}以上护士',
                    },
                    SOFT_NO_SAME_DUTY_PAIR: {
                        label: '组合条件',
                        sentence: '{nurseA}和{nurseB}不能安排相同班次',
                    },
                    SOFT_PREFER_SAME_DUTY_PAIR: {
                        label: '组合条件',
                        sentence: '{nurseA}最好与{nurseB}安排相同班次',
                    },
                },
            },
        },
    },
} as unknown as TLocale;
