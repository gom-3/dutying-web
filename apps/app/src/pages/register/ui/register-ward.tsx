import {type TCreateWardDTO} from '@dutying/api/ward';
import {yupResolver} from '@hookform/resolvers/yup';
import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {useNavigate} from 'react-router';
import {match} from 'ts-pattern';
import useRegister from '@/features/register';
import {registerWardSchema} from '@/features/register-ward/model/schema';
import {DEFAULT_WARD_SHIFT_TYPES, getWardShiftValidationMessage} from '@/features/register-ward/model/ward';
import RegisterWardShiftTeamsSection from '@/features/register-ward/ui/register-ward-shift-teams-section';
import RegisterWardShiftTypesSection from '@/features/register-ward/ui/register-ward-shift-types-section';
import {BackIcon, FullLogo, LogoSymbolFill} from '@/shared/assets/svg';
import ROUTE from '@/shared/constant/path';
import Button from '@/shared/ui/form-controls/Button';
import TextField from '@/shared/ui/form-controls/TextField';
import ValidationMessage from '@/shared/ui/ValidationMessage';

function RegisterWard() {
    const [shiftTeams, setShiftTeams] = useState<string[][]>([[]]);
    const [wardShiftTypes, setWardShiftTypes] = useState<TCreateWardDTO['wardShiftTypes']>(DEFAULT_WARD_SHIFT_TYPES);
    const [wardShiftError, setWardShiftError] = useState<string | null>(null);
    const {
        formState: {errors, isValid},
        register,
        handleSubmit,
    } = useForm({
        mode: 'onTouched',
        defaultValues: {
            name: '',
            hospitalName: '',
        },
        resolver: yupResolver(registerWardSchema),
    });
    const {
        state: {accountMe},
        actions: {createWard},
    } = useRegister();
    const navigate = useNavigate();

    useEffect(() => {
        if (accountMe?.status !== 'WARD_SELECT_PENDING') navigate(ROUTE.REGISTER);
    }, [accountMe, navigate]);

    useEffect(() => {
        setWardShiftError(null);
    }, [wardShiftTypes]);

    return (
        <div className="relative mx-auto mt-30.75 flex h-[calc(100%-7.6875rem)] w-[52%] flex-col items-center bg-[#FDFCFE]">
            <div className="fixed top-7.5 left-12.5 flex cursor-pointer gap-5" onClick={() => navigate(ROUTE.ROOT)}>
                <LogoSymbolFill className="h-7.5 w-7.5" />
                <FullLogo className="h-7.5 w-27.5" />
            </div>
            <form
                onSubmit={handleSubmit((d) => {
                    const validationMessage = getWardShiftValidationMessage(wardShiftTypes);

                    if (validationMessage) {
                        setWardShiftError(validationMessage);

                        return;
                    }

                    setWardShiftError(null);
                    createWard({
                        name: d.name,
                        hospitalName: d.hospitalName,
                        shiftTeams: shiftTeams.map((shiftTeam) => ({nurseNames: shiftTeam})),
                        wardShiftTypes,
                    });
                })}
                className="flex w-full flex-col"
            >
                <h1 className="font-apple text-[2rem] font-semibold text-text-1">병동 생성</h1>
                <BackIcon className="absolute top-0 -left-10 h-12 w-12 -translate-x-full cursor-pointer" onClick={() => navigate(-1)} />
                <div className="mt-7.5 flex w-full shrink-0 gap-12.5 rounded-[1.25rem] bg-white px-11.25 py-7.5 shadow-banner">
                    <div className="w-75">
                        <label htmlFor="name" className="mb-[.9375rem] block font-apple text-[1.25rem] text-sub-3">
                            병원
                        </label>
                        <TextField
                            id="name"
                            className="h-15 py-4.25 font-apple text-[1.5rem] font-medium text-sub-1"
                            error={match(errors.hospitalName?.type)
                                .with('matches', () => '이름은 1~50자 한/영문에 특수문자를 사용할 수 없습니다.')
                                .otherwise(() => undefined)}
                            {...register('hospitalName')}
                        />
                    </div>
                    <div className="w-57.5">
                        <label htmlFor="name" className="mb-[.9375rem] block font-apple text-[1.25rem] text-sub-3">
                            병동
                        </label>
                        <TextField
                            id="name"
                            className="h-15 py-4.25 font-apple text-[1.5rem] font-medium text-sub-1"
                            error={match(errors.name?.type)
                                .with('matches', () => '이름은 1~50자 한/영문에 특수문자를 사용할 수 없습니다.')
                                .otherwise(() => undefined)}
                            {...register('name')}
                        />
                    </div>
                </div>
                <RegisterWardShiftTypesSection wardShiftTypes={wardShiftTypes} setWardShiftTypes={setWardShiftTypes} />
                <ValidationMessage message={wardShiftError} className="mt-3 self-start" />
                <RegisterWardShiftTeamsSection shiftTeams={shiftTeams} setShiftTeams={setShiftTeams} />
                <Button type="submit" disabled={!isValid} className="mt-10 h-15 w-30 self-end text-center text-[2rem] font-semibold">
                    저장
                </Button>
            </form>
        </div>
    );
}

export default RegisterWard;
