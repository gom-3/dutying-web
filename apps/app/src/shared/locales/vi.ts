import {vi as generatedVi} from '../i18n/resources.generated';
import {type TLocale} from './ko';

export const vi = {
    ...generatedVi,
    page: {
        ...generatedVi.page,
        notifications: {
            openAria: 'Mở thông báo',
            panelAria: 'Danh sách thông báo',
            title: 'Thông báo',
            unreadCount: '{{count}} thông báo chưa đọc',
            unreadShort: 'Chưa đọc {{count}}',
            justNow: 'Vừa xong',
            minutesAgo: '{{count}} phút trước',
            hoursAgo: '{{count}} giờ trước',
            loadFailed: 'Không thể tải thông báo.',
            retry: 'Thử lại',
            empty: 'Không có thông báo mới.',
        },
        makeShift: {
            ...generatedVi.page.makeShift,
            calendar: {
                ...generatedVi.page.makeShift.calendar,
                fixedStatusPin: 'Ca cố định',
                requestStatusPin: 'Ca đã đăng ký',
            },
            constraints: {
                ...generatedVi.page.makeShift.constraints,
                option: {
                    ...generatedVi.page.makeShift.constraints.option,
                    weekdays: 'Ngày trong tuần',
                    weekendsAndHolidays: 'Cuối tuần/ngày lễ',
                    preceptorBadge: 'Preceptor',
                    precepteeBadge: 'Preceptee',
                },
                templates: {
                    CORE_MAX_CONTINUOUS_WORK: {
                        label: 'Điều kiện cơ bản quan trọng',
                        sentence: '{target} không được làm việc liên tiếp từ {count} ngày trở lên',
                    },
                    CORE_MIN_NIGHT_INTERVAL: {
                        label: 'Điều kiện cơ bản quan trọng',
                        sentence: '{target} cần cách nhau ít nhất {count} ngày giữa các ca N',
                    },
                    CORE_MAX_CONTINUOUS_NIGHT: {
                        label: 'Điều kiện cơ bản quan trọng',
                        sentence: '{target} chỉ được làm tối đa {count} ca N liên tiếp',
                    },
                    CORE_MIN_OFF_AFTER_NIGHT: {
                        label: 'Điều kiện cơ bản quan trọng',
                        sentence: '{target} cần ít nhất {count} ngày OFF sau ca N',
                    },
                    CORE_EXCLUDE_NIGHT_BEFORE_REQ_OFF: {
                        label: 'Điều kiện cơ bản quan trọng',
                        sentence: '{target} không được làm ca N vào ngày trước OFF đã đăng ký',
                    },
                    MIN_STAFF_BY_SHIFT: {
                        label: 'Điều kiện nhân sự',
                        sentence: 'Ca {shift} cần ít nhất {count} người',
                    },
                    MAX_STAFF_BY_SHIFT: {
                        label: 'Điều kiện nhân sự',
                        sentence: 'Ca {shift} được xếp tối đa {count} người',
                    },
                    MIN_STAFF_BY_DATE_SHIFT: {
                        label: 'Điều kiện nhân sự',
                        sentence: 'Ngày {date} hằng tháng, ca {shift} cần ít nhất {count} người',
                    },
                    MIN_STAFF_BY_DAY_TYPE_SHIFT: {
                        label: 'Điều kiện nhân sự',
                        sentence: '{date}, ca {shift} cần ít nhất {count} người',
                    },
                    MIN_STAFF_WEEKEND_HOLIDAY_SHIFT: {
                        label: 'Điều kiện nhân sự',
                        sentence: 'Cuối tuần và ngày lễ, ca {shift} cần ít nhất {count} người',
                    },
                    MAX_CONSECUTIVE_WORK_DAYS: {
                        label: 'Điều kiện làm việc-nghỉ',
                        sentence: '{target} không được làm việc liên tiếp từ {count} ngày trở lên',
                    },
                    OFF_AFTER_CONSECUTIVE_WORK: {
                        label: 'Điều kiện làm việc-nghỉ',
                        sentence: '{target} cần OFF sau {count} ngày làm việc liên tiếp',
                    },
                    MIN_OFF_AFTER_N: {
                        label: 'Điều kiện làm việc-nghỉ',
                        sentence: '{target} cần ít nhất {count} ngày OFF sau ca N',
                    },
                    MIN_MONTHLY_OFF: {
                        label: 'Điều kiện làm việc-nghỉ',
                        sentence: '{target} cần ít nhất {count} ngày OFF mỗi tháng',
                    },
                    NURSE_FORBID_WEEKEND: {
                        label: 'Điều kiện cá nhân',
                        sentence: '{nurse} không được làm việc cuối tuần',
                    },
                    NURSE_NOT_ALONE_N: {
                        label: 'Điều kiện kỹ năng',
                        sentence: '{nurse} không được làm ca N một mình',
                    },
                    NEW_NURSE_NOT_ALONE_N: {
                        label: 'Điều kiện kỹ năng',
                        sentence: '{nurse} không được làm ca N một mình',
                    },
                    PRECEPTEE_NOT_ALONE_N: {
                        label: 'Điều kiện kỹ năng',
                        sentence: '{preceptee} không được làm ca N một mình',
                    },
                    MIN_PROFICIENCY_STAFF_BY_SHIFT: {
                        label: 'Điều kiện kỹ năng',
                        sentence: 'Ca {shift} cần ít nhất {count} điều dưỡng LV{level} trở lên',
                    },
                    IMPORTANT_MAX_WORK_STREAK: {
                        label: 'Điều kiện cơ bản quan trọng',
                        sentence: 'Làm việc liên tiếp tối đa {days} ngày',
                    },
                    IMPORTANT_MAX_SAME_DUTY_STREAK: {
                        label: 'Điều kiện cơ bản quan trọng',
                        sentence: 'Cùng một ca được làm liên tiếp tối đa {days} ngày',
                    },
                    IMPORTANT_MIN_NIGHT_INTERVAL: {
                        label: 'Điều kiện cơ bản quan trọng',
                        sentence: 'Giữa các ca N cần cách nhau ít nhất {days} ngày',
                    },
                    IMPORTANT_MAX_NIGHT_STREAK: {
                        label: 'Điều kiện cơ bản quan trọng',
                        sentence: 'Ca N liên tiếp tối đa {days} ngày',
                    },
                    IMPORTANT_OFF_AFTER_NIGHT: {
                        label: 'Điều kiện cơ bản quan trọng',
                        sentence: 'Sau ca N cần ít nhất {days} ngày OFF',
                    },
                    IMPORTANT_NO_NIGHT_BEFORE_REQUEST_OFF: {
                        label: 'Điều kiện cơ bản quan trọng',
                        sentence: 'Không được xếp ca N vào ngày trước OFF đã đăng ký',
                    },
                    IMPORTANT_FORBIDDEN_DUTY_PATTERNS: {
                        label: 'Điều kiện cơ bản quan trọng',
                        sentence: 'Tránh các mẫu ND / ED / NE / NOD',
                    },
                    SOFT_MIN_STAFF_BY_DUTY: {
                        label: 'Điều kiện nhân sự',
                        sentence: 'Ca {duty} cần ít nhất {count} người',
                    },
                    SOFT_MAX_STAFF_BY_DUTY: {
                        label: 'Điều kiện nhân sự',
                        sentence: 'Ca {duty} được xếp tối đa {count} người',
                    },
                    SOFT_MIN_STAFF_BY_DATE_DUTY: {
                        label: 'Điều kiện nhân sự',
                        sentence: '{date}, ca {duty} cần ít nhất {count} người',
                    },
                    SOFT_MIN_STAFF_WEEKEND_HOLIDAY: {
                        label: 'Điều kiện nhân sự',
                        sentence: 'Cuối tuần và ngày lễ, ca {duty} cần ít nhất {count} người',
                    },
                    SOFT_NO_N_TO_D: {
                        label: 'Điều kiện cấm mẫu',
                        sentence: '{target} nên tránh ca D vào ngày sau ca N',
                    },
                    SOFT_NO_N_TO_E: {
                        label: 'Điều kiện cấm mẫu',
                        sentence: '{target} nên tránh ca E vào ngày sau ca N',
                    },
                    SOFT_NO_E_TO_D: {
                        label: 'Điều kiện cấm mẫu',
                        sentence: '{target} nên tránh ca D vào ngày sau ca E',
                    },
                    SOFT_MAX_CONSECUTIVE_N: {
                        label: 'Điều kiện cấm mẫu',
                        sentence: '{target} chỉ được làm tối đa {count} ca N liên tiếp',
                    },
                    SOFT_MAX_CONSECUTIVE_WORK: {
                        label: 'Điều kiện làm việc-nghỉ',
                        sentence: '{target} được làm việc liên tiếp tối đa {days} ngày',
                    },
                    SOFT_NEED_OFF_AFTER_CONSECUTIVE: {
                        label: 'Điều kiện làm việc-nghỉ',
                        sentence: '{target} cần OFF sau {days} ngày làm việc liên tiếp',
                    },
                    SOFT_NEED_OFF_AFTER_N: {
                        label: 'Điều kiện làm việc-nghỉ',
                        sentence: '{target} cần ít nhất {days} ngày OFF sau ca N',
                    },
                    SOFT_MIN_MONTHLY_OFF: {
                        label: 'Điều kiện làm việc-nghỉ',
                        sentence: '{target} cần ít nhất {days} ngày OFF mỗi tháng',
                    },
                    SOFT_NO_WEEKEND_FOR_NURSE: {
                        label: 'Điều kiện cá nhân',
                        sentence: '{nurse} không được làm việc cuối tuần',
                    },
                    SOFT_NEWBIE_NO_SOLO_N: {
                        label: 'Điều kiện kỹ năng',
                        sentence: '{nurse} không được làm ca N một mình',
                    },
                    SOFT_MIN_SKILL_IN_DUTY: {
                        label: 'Điều kiện kỹ năng',
                        sentence: 'Ca {duty} cần ít nhất {count} điều dưỡng LV{level} trở lên',
                    },
                    SOFT_NO_SAME_DUTY_PAIR: {
                        label: 'Điều kiện kết hợp',
                        sentence: '{nurseA} và {nurseB} không được làm cùng ca',
                    },
                    SOFT_PREFER_SAME_DUTY_PAIR: {
                        label: 'Điều kiện kết hợp',
                        sentence: '{nurseA} nên làm cùng ca với {nurseB}',
                    },
                },
            },
        },
    },
} as unknown as TLocale;
