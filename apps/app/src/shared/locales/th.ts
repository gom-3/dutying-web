import {th as generatedTh} from '../i18n/resources.generated';
import {type TLocale} from './ko';

export const th = {
    ...generatedTh,
    page: {
        ...generatedTh.page,
        notifications: {
            openAria: 'เปิดการแจ้งเตือน',
            panelAria: 'รายการแจ้งเตือน',
            title: 'การแจ้งเตือน',
            unreadCount: 'การแจ้งเตือนที่ยังไม่ได้อ่าน {{count}} รายการ',
            unreadShort: 'ยังไม่อ่าน {{count}}',
            justNow: 'เมื่อสักครู่',
            minutesAgo: '{{count}} นาทีที่แล้ว',
            hoursAgo: '{{count}} ชั่วโมงที่แล้ว',
            loadFailed: 'ไม่สามารถโหลดการแจ้งเตือนได้',
            retry: 'ลองอีกครั้ง',
            empty: 'ไม่มีการแจ้งเตือนใหม่',
        },
        makeShift: {
            ...generatedTh.page.makeShift,
            calendar: {
                ...generatedTh.page.makeShift.calendar,
                fixedStatusPin: 'เวรคงที่',
                requestStatusPin: 'เวรที่ขอ',
            },
            constraints: {
                ...generatedTh.page.makeShift.constraints,
                option: {
                    ...generatedTh.page.makeShift.constraints.option,
                    weekdays: 'วันธรรมดา',
                    weekendsAndHolidays: 'วันหยุดสุดสัปดาห์/วันหยุด',
                    preceptorBadge: 'พี่เลี้ยง',
                    precepteeBadge: 'ผู้รับการสอน',
                },
                templates: {
                    CORE_MAX_CONTINUOUS_WORK: {
                        label: 'เงื่อนไขพื้นฐานสำคัญ',
                        sentence: '{target}ห้ามทำงานติดต่อกันตั้งแต่{count}วันขึ้นไป',
                    },
                    CORE_MIN_NIGHT_INTERVAL: {
                        label: 'เงื่อนไขพื้นฐานสำคัญ',
                        sentence: '{target}ต้องมีระยะห่างอย่างน้อย{count}วันระหว่างเวร N',
                    },
                    CORE_MAX_CONTINUOUS_NIGHT: {
                        label: 'เงื่อนไขพื้นฐานสำคัญ',
                        sentence: '{target}ทำเวร N ติดต่อกันได้สูงสุด{count}ครั้ง',
                    },
                    CORE_MIN_OFF_AFTER_NIGHT: {
                        label: 'เงื่อนไขพื้นฐานสำคัญ',
                        sentence: '{target}ต้องมี OFF อย่างน้อย{count}วันหลังเวร N',
                    },
                    CORE_EXCLUDE_NIGHT_BEFORE_REQ_OFF: {
                        label: 'เงื่อนไขพื้นฐานสำคัญ',
                        sentence: '{target}ห้ามทำเวร N ในวันก่อน OFF ที่ขอไว้',
                    },
                    MIN_STAFF_BY_SHIFT: {
                        label: 'เงื่อนไขจำนวนคน',
                        sentence: 'เวร{shift}ต้องมีอย่างน้อย{count}คน',
                    },
                    MAX_STAFF_BY_SHIFT: {
                        label: 'เงื่อนไขจำนวนคน',
                        sentence: 'เวร{shift}จัดได้สูงสุด{count}คน',
                    },
                    MIN_STAFF_BY_DATE_SHIFT: {
                        label: 'เงื่อนไขจำนวนคน',
                        sentence: 'วันที่ {date} ของทุกเดือน เวร{shift}ต้องมีอย่างน้อย{count}คน',
                    },
                    MIN_STAFF_BY_DAY_TYPE_SHIFT: {
                        label: 'เงื่อนไขจำนวนคน',
                        sentence: '{date} เวร{shift}ต้องมีอย่างน้อย{count}คน',
                    },
                    MIN_STAFF_WEEKEND_HOLIDAY_SHIFT: {
                        label: 'เงื่อนไขจำนวนคน',
                        sentence: 'วันหยุดสุดสัปดาห์และวันหยุด เวร{shift}ต้องมีอย่างน้อย{count}คน',
                    },
                    MAX_CONSECUTIVE_WORK_DAYS: {
                        label: 'เงื่อนไขงานและพัก',
                        sentence: '{target}ห้ามทำงานติดต่อกันตั้งแต่{count}วันขึ้นไป',
                    },
                    OFF_AFTER_CONSECUTIVE_WORK: {
                        label: 'เงื่อนไขงานและพัก',
                        sentence: '{target}ต้องมี OFF หลังทำงานติดต่อกัน{count}วัน',
                    },
                    MIN_OFF_AFTER_N: {
                        label: 'เงื่อนไขงานและพัก',
                        sentence: '{target}ต้องมี OFF อย่างน้อย{count}วันหลังเวร N',
                    },
                    MIN_MONTHLY_OFF: {
                        label: 'เงื่อนไขงานและพัก',
                        sentence: '{target}ต้องมี OFF อย่างน้อย{count}วันต่อเดือน',
                    },
                    NURSE_FORBID_WEEKEND: {
                        label: 'เงื่อนไขรายบุคคล',
                        sentence: '{nurse}ห้ามทำงานวันหยุดสุดสัปดาห์',
                    },
                    NURSE_NOT_ALONE_N: {
                        label: 'เงื่อนไขทักษะ',
                        sentence: '{nurse}ห้ามทำเวร N คนเดียว',
                    },
                    NEW_NURSE_NOT_ALONE_N: {
                        label: 'เงื่อนไขทักษะ',
                        sentence: '{nurse}ห้ามทำเวร N คนเดียว',
                    },
                    PRECEPTEE_NOT_ALONE_N: {
                        label: 'เงื่อนไขทักษะ',
                        sentence: '{preceptee}ห้ามทำเวร N คนเดียว',
                    },
                    MIN_PROFICIENCY_STAFF_BY_SHIFT: {
                        label: 'เงื่อนไขทักษะ',
                        sentence: 'เวร{shift}ต้องมีพยาบาลระดับ LV{level} ขึ้นไปอย่างน้อย{count}คน',
                    },
                    IMPORTANT_MAX_WORK_STREAK: {
                        label: 'เงื่อนไขพื้นฐานสำคัญ',
                        sentence: 'ทำงานติดต่อกันได้สูงสุด{days}วัน',
                    },
                    IMPORTANT_MAX_SAME_DUTY_STREAK: {
                        label: 'เงื่อนไขพื้นฐานสำคัญ',
                        sentence: 'ทำเวรเดิมติดต่อกันได้สูงสุด{days}วัน',
                    },
                    IMPORTANT_MIN_NIGHT_INTERVAL: {
                        label: 'เงื่อนไขพื้นฐานสำคัญ',
                        sentence: 'เวร N ต้องเว้นอย่างน้อย{days}วัน',
                    },
                    IMPORTANT_MAX_NIGHT_STREAK: {
                        label: 'เงื่อนไขพื้นฐานสำคัญ',
                        sentence: 'เวร N ติดต่อกันได้สูงสุด{days}วัน',
                    },
                    IMPORTANT_OFF_AFTER_NIGHT: {
                        label: 'เงื่อนไขพื้นฐานสำคัญ',
                        sentence: 'หลังเวร N ต้องมี OFF อย่างน้อย{days}วัน',
                    },
                    IMPORTANT_NO_NIGHT_BEFORE_REQUEST_OFF: {
                        label: 'เงื่อนไขพื้นฐานสำคัญ',
                        sentence: 'ห้ามจัดเวร N ในวันก่อน OFF ที่ขอไว้',
                    },
                    IMPORTANT_FORBIDDEN_DUTY_PATTERNS: {
                        label: 'เงื่อนไขพื้นฐานสำคัญ',
                        sentence: 'หลีกเลี่ยงรูปแบบ ND / ED / NE / NOD',
                    },
                    SOFT_MIN_STAFF_BY_DUTY: {
                        label: 'เงื่อนไขจำนวนคน',
                        sentence: 'เวร{duty}ต้องมีอย่างน้อย{count}คน',
                    },
                    SOFT_MAX_STAFF_BY_DUTY: {
                        label: 'เงื่อนไขจำนวนคน',
                        sentence: 'เวร{duty}จัดได้สูงสุด{count}คน',
                    },
                    SOFT_MIN_STAFF_BY_DATE_DUTY: {
                        label: 'เงื่อนไขจำนวนคน',
                        sentence: '{date} เวร{duty}ต้องมีอย่างน้อย{count}คน',
                    },
                    SOFT_MIN_STAFF_WEEKEND_HOLIDAY: {
                        label: 'เงื่อนไขจำนวนคน',
                        sentence: 'วันหยุดสุดสัปดาห์และวันหยุด เวร{duty}ต้องมีอย่างน้อย{count}คน',
                    },
                    SOFT_NO_N_TO_D: {
                        label: 'เงื่อนไขห้ามรูปแบบ',
                        sentence: '{target}ควรหลีกเลี่ยงเวร D ในวันถัดจากเวร N',
                    },
                    SOFT_NO_N_TO_E: {
                        label: 'เงื่อนไขห้ามรูปแบบ',
                        sentence: '{target}ควรหลีกเลี่ยงเวร E ในวันถัดจากเวร N',
                    },
                    SOFT_NO_E_TO_D: {
                        label: 'เงื่อนไขห้ามรูปแบบ',
                        sentence: '{target}ควรหลีกเลี่ยงเวร D ในวันถัดจากเวร E',
                    },
                    SOFT_MAX_CONSECUTIVE_N: {
                        label: 'เงื่อนไขห้ามรูปแบบ',
                        sentence: '{target}ทำเวร N ติดต่อกันได้สูงสุด{count}ครั้ง',
                    },
                    SOFT_MAX_CONSECUTIVE_WORK: {
                        label: 'เงื่อนไขงานและพัก',
                        sentence: '{target}ทำงานติดต่อกันได้สูงสุด{days}วัน',
                    },
                    SOFT_NEED_OFF_AFTER_CONSECUTIVE: {
                        label: 'เงื่อนไขงานและพัก',
                        sentence: '{target}ต้องมี OFF หลังทำงานติดต่อกัน{days}วัน',
                    },
                    SOFT_NEED_OFF_AFTER_N: {
                        label: 'เงื่อนไขงานและพัก',
                        sentence: '{target}ต้องมี OFF อย่างน้อย{days}วันหลังเวร N',
                    },
                    SOFT_MIN_MONTHLY_OFF: {
                        label: 'เงื่อนไขงานและพัก',
                        sentence: '{target}ต้องมี OFF อย่างน้อย{days}วันต่อเดือน',
                    },
                    SOFT_NO_WEEKEND_FOR_NURSE: {
                        label: 'เงื่อนไขรายบุคคล',
                        sentence: '{nurse}ห้ามทำงานวันหยุดสุดสัปดาห์',
                    },
                    SOFT_NEWBIE_NO_SOLO_N: {
                        label: 'เงื่อนไขทักษะ',
                        sentence: '{nurse}ห้ามทำเวร N คนเดียว',
                    },
                    SOFT_MIN_SKILL_IN_DUTY: {
                        label: 'เงื่อนไขทักษะ',
                        sentence: 'เวร{duty}ต้องมีพยาบาลระดับ LV{level} ขึ้นไปอย่างน้อย{count}คน',
                    },
                    SOFT_NO_SAME_DUTY_PAIR: {
                        label: 'เงื่อนไขคู่',
                        sentence: '{nurseA}และ{nurseB}ห้ามทำเวรเดียวกัน',
                    },
                    SOFT_PREFER_SAME_DUTY_PAIR: {
                        label: 'เงื่อนไขคู่',
                        sentence: '{nurseA}ควรทำเวรเดียวกับ{nurseB}',
                    },
                },
            },
        },
    },
} as unknown as TLocale;
