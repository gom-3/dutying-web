import {cn} from '@dutying/utils/style';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {Hospital} from 'lucide-react';
import {useEffect, useState} from 'react';
import toast from 'react-hot-toast';
import {getWardDisplayCode, wardQueryKeys, wardQueryOptions} from '@/entities/ward';
import {useEditAccount} from '@/features/account/model';
import useAuth from '@/features/auth';
import WardAdminsPage from '@/pages/ward-admins';
import {WardAPI} from '@/shared/api';
import {useTypedTranslation} from '@/shared/hook/use-typed-translation';
import Card from '@/shared/ui/Card';
import PageState from '@/shared/ui/PageState';
import {Button} from '@/shared/ui/primitives/button';
import {showActionErrorFeedback} from '@/shared/util/feedback';

type TWardInfoField = 'hospitalName' | 'name';
type TWardInfoForm = Record<TWardInfoField, string>;
type TWardInfoErrors = Partial<Record<TWardInfoField, string>>;
type TWardInfoTouched = Partial<Record<TWardInfoField, boolean>>;

const WARD_NAME_MAX_LENGTH = 20;
const WARD_NAME_ALLOWED_REGEXP = /^[A-Za-z\u3131-\u318E\uAC00-\uD7A3\u3040-\u30FF\u3400-\u9FFF0-9\s]+$/u;
const WARD_NAME_INPUT_SANITIZE_REGEXP = /[^A-Za-z\u3131-\u318E\uAC00-\uD7A3\u3040-\u30FF\u3400-\u9FFF0-9\s]/gu;
const FIELD_CLASS =
    'h-11 w-full rounded-[12px] border border-transparent bg-gray-7 px-3.5 text-[15px] font-medium text-sub-1 outline-none transition-colors placeholder:text-gray-4 focus-visible:bg-main-light';
const sanitizeWardNameInput = (rawValue: string) => rawValue.replace(WARD_NAME_INPUT_SANITIZE_REGEXP, '').slice(0, WARD_NAME_MAX_LENGTH);

function WardInfoSettingsPage() {
    const {t} = useTypedTranslation();
    const {
        state: {wardId},
    } = useAuth();
    const {quitWard} = useEditAccount();
    const queryClient = useQueryClient();
    const wardQuery = useQuery({
        ...wardQueryOptions.id(wardId ?? 0),
        enabled: Boolean(wardId),
    });
    const ward = wardQuery.data;
    const [draft, setDraft] = useState<TWardInfoForm>({hospitalName: '', name: ''});
    const [fieldErrors, setFieldErrors] = useState<TWardInfoErrors>({});
    const [fieldTouched, setFieldTouched] = useState<TWardInfoTouched>({});
    const [isSaving, setIsSaving] = useState(false);
    const wardCode = getWardDisplayCode(ward);
    const originalDraft: TWardInfoForm = {
        hospitalName: ward?.hospitalName ?? '',
        name: ward?.name ?? '',
    };
    const isDirty = draft.hospitalName.trim() !== originalDraft.hospitalName.trim() || draft.name.trim() !== originalDraft.name.trim();
    const isSaveDisabled = isSaving || !isDirty;
    const getFieldLabel = (field: TWardInfoField) =>
        field === 'hospitalName' ? t('page.wardInfoSettings.hospitalName') : t('page.wardInfoSettings.wardName');
    const validateWardName = (field: TWardInfoField, value: string) => {
        const label = getFieldLabel(field);
        const trimmed = value.trim();

        if (!trimmed) return t('page.wardInfoSettings.validation.required', {label});

        if (trimmed.length > WARD_NAME_MAX_LENGTH || !WARD_NAME_ALLOWED_REGEXP.test(trimmed)) {
            return t('page.wardInfoSettings.validation.invalid', {label, count: WARD_NAME_MAX_LENGTH});
        }

        return undefined;
    };
    const setFieldError = (field: TWardInfoField, value: string) => {
        const message = validateWardName(field, value);

        setFieldErrors((prev) => ({...prev, [field]: message}));

        return message;
    };
    const handleChange = (field: TWardInfoField, value: string) => {
        const nextValue = sanitizeWardNameInput(value);

        setDraft((prev) => ({...prev, [field]: nextValue}));

        if (fieldTouched[field]) setFieldError(field, nextValue);
    };
    const validateForm = () => {
        const nextErrors: TWardInfoErrors = {
            hospitalName: validateWardName('hospitalName', draft.hospitalName),
            name: validateWardName('name', draft.name),
        };

        setFieldErrors(nextErrors);
        setFieldTouched({hospitalName: true, name: true});

        return !nextErrors.hospitalName && !nextErrors.name;
    };
    const save = async () => {
        if (!wardId) return;

        if (!validateForm()) return;

        try {
            setIsSaving(true);

            const nextWard = await WardAPI.editWard(wardId, {
                hospitalName: draft.hospitalName.trim(),
                name: draft.name.trim(),
            });

            setDraft({
                hospitalName: nextWard.hospitalName ?? draft.hospitalName.trim(),
                name: nextWard.name ?? draft.name.trim(),
            });
            queryClient.setQueryData(wardQueryKeys.id(wardId), nextWard);
            await queryClient.invalidateQueries({queryKey: wardQueryKeys.id(wardId)});
            toast.success(t('page.wardInfoSettings.toast.saveSuccess'));
        } catch (error) {
            showActionErrorFeedback(error, t('page.wardInfoSettings.toast.saveFailed'));
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        if (!ward) return;

        setDraft({
            hospitalName: ward.hospitalName ?? '',
            name: ward.name ?? '',
        });
        setFieldErrors({});
        setFieldTouched({});
    }, [ward]);

    if (!wardId) {
        return (
            <div className="mx-auto flex h-full w-full max-w-306 items-center justify-center px-8">
                <PageState
                    tone="empty"
                    title={t('page.wardInfoSettings.state.noWardTitle')}
                    description={t('page.wardInfoSettings.state.noWardDescription')}
                    className="py-0"
                />
            </div>
        );
    }

    if (wardQuery.isPending) {
        return (
            <div className="mx-auto flex h-full w-full max-w-306 items-center justify-center px-8">
                <PageState tone="loading" title={t('page.wardInfoSettings.state.loadingTitle')} className="py-0" />
            </div>
        );
    }

    if (wardQuery.isError || !ward) {
        return (
            <div className="mx-auto flex h-full w-full max-w-306 items-center justify-center px-8">
                <PageState
                    tone="error"
                    title={t('page.wardInfoSettings.state.loadFailedTitle')}
                    description={t('page.wardInfoSettings.state.retryDescription')}
                    action={{label: t('page.wardInfoSettings.state.retry'), onClick: () => void wardQuery.refetch()}}
                    className="py-0"
                />
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-[560px] px-4 py-8 md:px-0">
            <div className="mx-auto flex max-w-[480px] items-start justify-between gap-4">
                <div>
                    <h1 className="font-apple text-[32px] font-semibold tracking-normal text-sub-1">{t('page.wardInfoSettings.title')}</h1>
                </div>
            </div>

            <div className="mx-auto mt-6 max-w-[480px] space-y-4">
                <Card className="rounded-[24px] border-transparent p-6">
                    <h2 className="mb-5 flex items-center gap-2 font-apple text-[20px] font-semibold text-sub-1">
                        <Hospital aria-hidden="true" className="h-5 w-5 shrink-0 text-main-1" />
                        <span>{t('page.wardInfoSettings.sectionTitle')}</span>
                    </h2>
                    <div className="grid grid-cols-1 gap-3">
                        <div className="max-w-[440px]">
                            <label htmlFor="hospitalName" className="mb-1.5 block font-apple text-sm font-medium text-sub-2">
                                {t('page.wardInfoSettings.hospitalName')}
                            </label>
                            <input
                                id="hospitalName"
                                className={cn(FIELD_CLASS, fieldErrors.hospitalName && 'border-red bg-[#FFF7F8] focus-visible:bg-white')}
                                maxLength={WARD_NAME_MAX_LENGTH}
                                placeholder={t('page.wardInfoSettings.hospitalNamePlaceholder')}
                                value={draft.hospitalName}
                                onChange={(event) => handleChange('hospitalName', event.target.value)}
                                onBlur={(event) => {
                                    setFieldTouched((prev) => ({...prev, hospitalName: true}));
                                    setFieldError('hospitalName', event.target.value);
                                }}
                                aria-invalid={Boolean(fieldErrors.hospitalName)}
                                aria-describedby={fieldErrors.hospitalName ? 'ward-hospital-name-error' : undefined}
                            />
                            {fieldErrors.hospitalName ? (
                                <p id="ward-hospital-name-error" className="mt-1 font-apple text-xs text-red">
                                    {fieldErrors.hospitalName}
                                </p>
                            ) : null}
                        </div>
                        <div className="max-w-[440px]">
                            <label htmlFor="wardName" className="mb-1.5 block font-apple text-sm font-medium text-sub-2">
                                {t('page.wardInfoSettings.wardName')}
                            </label>
                            <input
                                id="wardName"
                                className={cn(FIELD_CLASS, fieldErrors.name && 'border-red bg-[#FFF7F8] focus-visible:bg-white')}
                                maxLength={WARD_NAME_MAX_LENGTH}
                                placeholder={t('page.wardInfoSettings.wardNamePlaceholder')}
                                value={draft.name}
                                onChange={(event) => handleChange('name', event.target.value)}
                                onBlur={(event) => {
                                    setFieldTouched((prev) => ({...prev, name: true}));
                                    setFieldError('name', event.target.value);
                                }}
                                aria-invalid={Boolean(fieldErrors.name)}
                                aria-describedby={fieldErrors.name ? 'ward-name-error' : undefined}
                            />
                            {fieldErrors.name ? (
                                <p id="ward-name-error" className="mt-1 font-apple text-xs text-red">
                                    {fieldErrors.name}
                                </p>
                            ) : null}
                        </div>
                        <div className="max-w-[440px]">
                            <p id="wardCode-label" className="mb-1.5 block font-apple text-sm font-medium text-sub-2">
                                {t('page.wardInfoSettings.wardCode')}
                            </p>
                            <div aria-labelledby="wardCode-label" className="flex min-h-8 w-full items-center">
                                <span className="inline-flex max-w-full min-w-0 items-center rounded-full bg-main-light px-3 py-1 font-poppins text-[13px] leading-none font-semibold text-main-1 ring-1 ring-main-3/70">
                                    <span className="truncate">{wardCode}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="mx-auto mt-6 max-w-[480px]">
                <WardAdminsPage />
            </div>

            <div className="mx-auto mt-4 flex max-w-[480px] items-center justify-end px-1">
                <button
                    type="button"
                    className="cursor-pointer bg-transparent p-0 font-apple text-sm font-medium text-gray-3 underline-offset-4 transition-colors hover:text-sub-2 hover:underline"
                    onClick={quitWard}
                >
                    {t('page.wardInfoSettings.quitWard')}
                </button>
            </div>

            <div className="sticky bottom-3 mx-auto mt-4 flex max-w-[480px] items-center justify-end py-2">
                <Button type="button" onClick={() => void save()} disabled={isSaveDisabled} className="h-11 rounded-[12px] px-5 text-sm">
                    {isSaving ? t('page.wardInfoSettings.saving') : t('page.wardInfoSettings.save')}
                </Button>
            </div>
        </div>
    );
}

export default WardInfoSettingsPage;
