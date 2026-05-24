import {Check, Info, Plus, RefreshCcw, Save, Trash2, X} from 'lucide-react';
import {useState, type ReactNode} from 'react';
import Card from '@/shared/ui/Card';
import Button from '@/shared/ui/form-controls/Button';
import Select from '@/shared/ui/form-controls/Select';
import TextField from '@/shared/ui/form-controls/TextField';
import TimeInput from '@/shared/ui/form-controls/TimeInput';
import LoadingSpinner from '@/shared/ui/LoadingSpinner';
import PageState from '@/shared/ui/PageState';
import {Button as PrimitiveButton} from '@/shared/ui/primitives/button';
import {Input} from '@/shared/ui/primitives/input';
import {Separator} from '@/shared/ui/primitives/separator';
import {Skeleton} from '@/shared/ui/primitives/skeleton';
import {Switch} from '@/shared/ui/primitives/switch';
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from '@/shared/ui/primitives/tooltip';
import SectionHeader from '@/shared/ui/SectionHeader';
import StatusBadge from '@/shared/ui/StatusBadge';
import Toggle from '@/shared/ui/Toggle';
import ValidationMessage from '@/shared/ui/ValidationMessage';

type TPreviewSectionProps = {
    title: string;
    description?: string;
    children: ReactNode;
};

const badgeTones = ['neutral', 'brand', 'success', 'warning', 'danger'] as const;
const cardVariants = ['default', 'elevated', 'muted', 'success'] as const;

function PreviewSection({title, description, children}: TPreviewSectionProps) {
    return (
        <section className="border-b border-gray-6 bg-white px-6 py-8 last:border-b-0 lg:px-10">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
                <div>
                    <h2 className="font-apple text-[22px] font-semibold text-sub-1">{title}</h2>
                    {description ? <p className="mt-1 text-[14px] leading-6 text-gray-3">{description}</p> : null}
                </div>
                {children}
            </div>
        </section>
    );
}

function SampleBox({label, children}: {label: string; children: ReactNode}) {
    return (
        <div className="flex min-h-[112px] flex-col gap-3 rounded-[8px] border border-gray-6 bg-[#FDFCFE] p-4">
            <p className="text-[12px] font-semibold tracking-[0.04em] text-gray-3 uppercase">{label}</p>
            <div className="flex min-h-12 flex-wrap items-center gap-3">{children}</div>
        </div>
    );
}

function UiPreviewPage() {
    const [toggleOn, setToggleOn] = useState(true);
    const [switchOn, setSwitchOn] = useState(false);
    const [selectValue, setSelectValue] = useState('day');
    const [nameValue, setNameValue] = useState('김듀팅');
    const [inputValue, setInputValue] = useState('Sample input');

    return (
        <TooltipProvider>
            <main className="min-h-screen bg-gray-7 font-apple text-sub-1">
                <header className="border-b border-gray-6 bg-[#242428] px-6 py-8 text-white lg:px-10">
                    <div className="mx-auto flex w-full max-w-7xl flex-col gap-2">
                        <p className="text-[13px] font-semibold text-main-3">Shared UI Preview</p>
                        <h1 className="text-[32px] font-semibold">Dutying common components</h1>
                        <p className="max-w-3xl text-[14px] leading-6 text-gray-5">
                            Edit components in shared/ui, then use this page to check shape, spacing, color, and states together.
                        </p>
                    </div>
                </header>

                <PreviewSection title="Page states" description="Loading, error, and empty states rendered by PageState.">
                    <div className="grid gap-4 lg:grid-cols-3">
                        <PageState tone="loading" title="데이터를 불러오고 있어요" description="잠시만 기다려 주세요." layout="inline" />
                        <PageState
                            tone="error"
                            title="데이터를 불러오지 못했어요"
                            description="잠시 후 다시 시도해 주세요."
                            action={{label: '다시 시도', onClick: () => undefined}}
                            layout="inline"
                        />
                        <PageState
                            tone="empty"
                            title="표시할 항목이 없어요"
                            description="조건을 바꾸거나 새 항목을 추가해 보세요."
                            layout="inline"
                        />
                    </div>
                </PreviewSection>

                <PreviewSection title="Buttons" description="Form button wrapper and primitive button variants.">
                    <div className="grid gap-4 lg:grid-cols-2">
                        <SampleBox label="form-controls/Button">
                            <Button size="md">
                                <Save className="size-4" aria-hidden="true" />
                                Save
                            </Button>
                            <Button variant="outline" size="md">
                                <RefreshCcw className="size-4" aria-hidden="true" />
                                Retry
                            </Button>
                            <Button variant="secondary" size="md">
                                Secondary
                            </Button>
                            <Button variant="link" size="md">
                                Link
                            </Button>
                            <Button size="sm" disabled>
                                Disabled
                            </Button>
                        </SampleBox>
                        <SampleBox label="primitives/button">
                            <PrimitiveButton variant="brand">
                                <Plus className="size-4" aria-hidden="true" />
                                Brand
                            </PrimitiveButton>
                            <PrimitiveButton variant="brandOutline">Outline</PrimitiveButton>
                            <PrimitiveButton variant="soft">Soft</PrimitiveButton>
                            <PrimitiveButton variant="subtle">Subtle</PrimitiveButton>
                            <PrimitiveButton variant="destructive">
                                <Trash2 className="size-4" aria-hidden="true" />
                                Delete
                            </PrimitiveButton>
                        </SampleBox>
                    </div>
                </PreviewSection>

                <PreviewSection title="Form controls" description="Inputs, select, time input, validation text, toggle, and switch.">
                    <div className="grid gap-4 lg:grid-cols-3">
                        <SampleBox label="Input">
                            <Input
                                value={inputValue}
                                onChange={(event) => setInputValue(event.target.value)}
                                variant="foundation"
                                fieldSize="lg"
                            />
                            <Input placeholder="Disabled input" variant="foundation" fieldSize="lg" disabled />
                        </SampleBox>
                        <SampleBox label="TextField">
                            <TextField value={nameValue} onChange={(event) => setNameValue(event.target.value)} className="text-[24px]" />
                            <TextField defaultValue="Error value" error="필수 입력값이에요." className="text-[24px]" />
                        </SampleBox>
                        <SampleBox label="Select / TimeInput">
                            <Select
                                value={selectValue}
                                onChange={(event) => setSelectValue(event.target.value)}
                                options={[
                                    {value: 'day', label: 'Day'},
                                    {value: 'evening', label: 'Evening'},
                                    {value: 'night', label: 'Night'},
                                ]}
                            />
                            <TimeInput initTime="07:30" className="w-38 text-[24px]" aria-label="Sample time" />
                            <ValidationMessage message="저장하기 전에 값을 확인해 주세요." />
                        </SampleBox>
                        <SampleBox label="Toggle">
                            <Toggle isOn={toggleOn} setIsOn={setToggleOn} />
                            <span className="text-[14px] text-gray-3">{toggleOn ? 'On' : 'Off'}</span>
                        </SampleBox>
                        <SampleBox label="Switch">
                            <Switch checked={switchOn} onCheckedChange={setSwitchOn} className="data-[state=checked]:bg-main-1" />
                            <span className="text-[14px] text-gray-3">{switchOn ? 'Checked' : 'Unchecked'}</span>
                        </SampleBox>
                        <SampleBox label="Tooltip">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <PrimitiveButton variant="soft" size="icon" aria-label="Show tooltip">
                                        <Info className="size-4" aria-hidden="true" />
                                    </PrimitiveButton>
                                </TooltipTrigger>
                                <TooltipContent>Tooltip content</TooltipContent>
                            </Tooltip>
                        </SampleBox>
                    </div>
                </PreviewSection>

                <PreviewSection
                    title="Display components"
                    description="Cards, badges, section header, separators, skeletons, and spinners."
                >
                    <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                        <div className="grid gap-4 sm:grid-cols-2">
                            {cardVariants.map((variant) => (
                                <Card key={variant} variant={variant} className="min-h-[140px]">
                                    <p className="text-[13px] font-semibold text-gray-3">{variant}</p>
                                    <p className="mt-3 text-[18px] font-semibold">Card component</p>
                                    <p className="mt-1 text-[14px] leading-6 text-gray-3">
                                        Use this to check border, shadow, background, and padding.
                                    </p>
                                </Card>
                            ))}
                        </div>
                        <div className="flex flex-col gap-4">
                            <SampleBox label="StatusBadge">
                                {badgeTones.map((tone) => (
                                    <StatusBadge key={tone} tone={tone} label={tone} count={tone === 'brand' ? 12 : undefined} />
                                ))}
                            </SampleBox>
                            <SampleBox label="SectionHeader">
                                <SectionHeader
                                    title="공용 UI를 점검해요"
                                    description="간격, 색상, 폰트 크기를 한곳에서 확인합니다."
                                    className="space-y-3"
                                    titleClassName="text-[28px]"
                                    descriptionClassName="text-[16px] whitespace-normal"
                                />
                            </SampleBox>
                            <SampleBox label="Skeleton / Separator / Spinner">
                                <div className="flex w-full flex-col gap-3">
                                    <Skeleton className="h-4 w-48" />
                                    <Skeleton className="h-10 w-full" />
                                    <Separator className="bg-gray-6" />
                                    <div className="flex items-center gap-3">
                                        <LoadingSpinner size={28} />
                                        <span className="text-[14px] text-gray-3">LoadingSpinner</span>
                                    </div>
                                </div>
                            </SampleBox>
                        </div>
                    </div>
                </PreviewSection>

                <PreviewSection title="Icon states">
                    <div className="grid gap-4 sm:grid-cols-3">
                        <SampleBox label="success">
                            <span className="grid size-10 place-items-center rounded-full bg-[#F3FFF7] text-[#237548]">
                                <Check className="size-5" aria-hidden="true" />
                            </span>
                            <span className="text-[15px] font-semibold">Completed</span>
                        </SampleBox>
                        <SampleBox label="warning">
                            <span className="grid size-10 place-items-center rounded-full bg-[#FFF9EA] text-[#A56600]">
                                <Info className="size-5" aria-hidden="true" />
                            </span>
                            <span className="text-[15px] font-semibold">Needs review</span>
                        </SampleBox>
                        <SampleBox label="danger">
                            <span className="grid size-10 place-items-center rounded-full bg-[#FFF6F6] text-[#B42318]">
                                <X className="size-5" aria-hidden="true" />
                            </span>
                            <span className="text-[15px] font-semibold">Failed</span>
                        </SampleBox>
                    </div>
                </PreviewSection>
            </main>
        </TooltipProvider>
    );
}

export default UiPreviewPage;
