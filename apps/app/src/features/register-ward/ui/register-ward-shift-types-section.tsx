import {type TCreateShiftTypeDTO, type TCreateWardDTO} from '@dutying/api/ward';
import {produce} from 'immer';
import {type Dispatch, type SetStateAction, useState} from 'react';
import {type TWardShiftType} from '@/entities/ward';
import CreateShiftModal from '@/features/create-shift-modal';
import {PenIcon, PlusIcon} from '@/shared/assets/svg';
import {useTypedTranslation} from '@/shared/hook/use-typed-translation';

interface IRegisterWardShiftTypesSectionProps {
    wardShiftTypes: TCreateWardDTO['wardShiftTypes'];
    setWardShiftTypes: Dispatch<SetStateAction<TCreateWardDTO['wardShiftTypes']>>;
}

function RegisterWardShiftTypesSection({wardShiftTypes, setWardShiftTypes}: IRegisterWardShiftTypesSectionProps) {
    const {t} = useTypedTranslation();
    const [openModal, setOpenModal] = useState(false);
    const [tempShiftType, setTempShiftType] = useState<TWardShiftType | null>(null);

    return (
        <div className="mt-5 w-full shrink-0 rounded-[1.25rem] bg-white px-11.25 py-7.5 shadow-banner">
            <div className="flex items-center justify-between">
                <p className="font-apple text-[1.25rem] font-medium text-sub-3">{t('feature.registerWard.shiftTypes.title')}</p>
                <div
                    className="flex cursor-pointer gap-[.625rem]"
                    onClick={() => {
                        setOpenModal(true);
                    }}
                >
                    <PlusIcon className="h-6 w-6 stroke-main-2" />
                    <p className="font-apple text-[1rem] font-medium text-main-2">{t('feature.registerWard.shiftTypes.addAction')}</p>
                </div>
            </div>
            <div className="relative mt-5 rounded-[.625rem] bg-main-bg">
                <div className="flex items-center gap-12 pt-5 text-center font-apple text-[.875rem] font-medium text-sub-2.5">
                    <p className="flex-2">{t('feature.registerWard.shiftTypes.column.name')}</p>
                    <p className="flex-1">{t('feature.registerWard.shiftTypes.column.shortName')}</p>
                    <p className="flex-3">{t('feature.registerWard.shiftTypes.column.workTime')}</p>
                    <p className="flex-1">{t('feature.registerWard.shiftTypes.column.color')}</p>
                    <p className="flex-1">{t('feature.registerWard.shiftTypes.column.category')}</p>
                    <p className="flex-1">{t('feature.registerWard.shiftTypes.column.edit')}</p>
                </div>
                {wardShiftTypes.map((shiftType, index) => (
                    <div key={index} className="flex h-18.5 items-center gap-12 border-b-[.0313rem] border-sub-4.5 last:border-0">
                        <div className="flex flex-2 items-center justify-center font-apple text-[1.25rem] font-medium text-sub-1 underline">
                            {shiftType.name}
                        </div>
                        <div className="flex flex-1 items-center justify-center text-[1.25rem]">
                            <p className="h-8 w-8 rounded-[.3125rem] bg-white p-0 text-center text-[1.25rem] text-sub-1 outline-[.0313rem] outline-sub-4.5">
                                {shiftType.shortName}
                            </p>
                        </div>
                        <div className="flex flex-3 items-center justify-center gap-4.5">
                            {shiftType.isOff ? (
                                <p className="font-poppins text-[1.25rem] font-light text-sub-2.5">-</p>
                            ) : (
                                <>
                                    <p className="h-7.5 w-full rounded-[.3125rem] bg-white p-0 text-center text-[1.25rem] text-sub-1 outline-[.0313rem] outline-sub-4.5">
                                        {shiftType.startTime}
                                    </p>
                                    <p className="font-poppins text-[1.25rem] font-light text-sub-2.5">~</p>
                                    <p className="h-7.5 w-full rounded-[.3125rem] bg-white p-0 text-center text-[1.25rem] text-sub-1 outline-[.0313rem] outline-sub-4.5">
                                        {shiftType.endTime}
                                    </p>
                                </>
                            )}
                        </div>

                        <div className="relative flex flex-1 items-center justify-center font-apple text-[2.25rem] font-semibold text-sub-2.5">
                            <div
                                className="h-8 w-8 rounded-[.4375rem] border-[.0625rem] border-sub-4"
                                style={{backgroundColor: shiftType.color}}
                            />
                        </div>
                        <div className="flex flex-1 justify-center">
                            <div className="rounded-[1.875rem] border-[.0313rem] border-main-2 px-[.875rem] py-[.3125rem] font-apple text-[.875rem] text-main-2">
                                {shiftType.isOff ? t('feature.registerWard.shiftTypes.leave') : t('feature.registerWard.shiftTypes.work')}
                            </div>
                        </div>
                        <div className="flex flex-1 justify-center">
                            <PenIcon
                                className="h-9 w-9 cursor-pointer"
                                onClick={() => {
                                    setTempShiftType({...shiftType, wardShiftTypeId: index, isCounted: true});
                                    setOpenModal(true);
                                }}
                            />
                        </div>
                    </div>
                ))}
                <CreateShiftModal
                    open={openModal}
                    close={() => {
                        setTempShiftType(null);
                        setOpenModal(false);
                    }}
                    shiftType={tempShiftType}
                    onSubmit={(shiftType: TCreateShiftTypeDTO) => {
                        if (tempShiftType) {
                            setWardShiftTypes(
                                produce(wardShiftTypes, (draft) => {
                                    draft[tempShiftType.wardShiftTypeId] = shiftType;
                                }),
                            );
                        } else {
                            setWardShiftTypes(
                                produce(wardShiftTypes, (draft) => {
                                    draft.push(shiftType);
                                }),
                            );
                        }

                        setTempShiftType(null);
                    }}
                    onDelete={() =>
                        tempShiftType &&
                        setWardShiftTypes(
                            produce(wardShiftTypes, (draft) => {
                                draft.splice(tempShiftType.wardShiftTypeId, 1);
                            }),
                        )
                    }
                />
            </div>
        </div>
    );
}

export default RegisterWardShiftTypesSection;
