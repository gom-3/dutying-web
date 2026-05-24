import {Upload} from 'lucide-react';
import {useRef} from 'react';
import Card from '@/shared/ui/Card';
import Button from '@/shared/ui/form-controls/Button';
import type {TOnboardingWardDraft} from '../../model';

interface IUploadStepProps {
    draft: TOnboardingWardDraft;
    onUpload: (file: File) => void;
    isUploading: boolean;
    uploadError: string | null;
    uploadWarnings: string[];
}

function UploadStep({draft, onUpload, isUploading, uploadError, uploadWarnings}: IUploadStepProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="space-y-6">
            <Card
                variant="muted"
                padding="none"
                className="flex min-h-[204px] flex-col items-center justify-center bg-white px-10 py-[60px]"
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                    event.preventDefault();

                    const file = event.dataTransfer.files?.[0];

                    if (file) {
                        onUpload(file);
                    }
                }}
            >
                <p className="font-apple text-[20px] font-medium text-gray-3">근무표 파일을 여기에 놓아 주세요</p>
                <input
                    ref={inputRef}
                    data-testid="upload-input"
                    hidden
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={(event) => {
                        const file = event.target.files?.[0];

                        if (file) {
                            onUpload(file);
                            event.target.value = '';
                        }
                    }}
                />
                <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    className="mt-5 h-10 rounded-[10px] px-4 text-[20px] font-medium enabled:cursor-pointer"
                    disabled={isUploading}
                    onClick={() => inputRef.current?.click()}
                >
                    {isUploading ? '파일 해석 중...' : '파일 업로드'}
                    <Upload className="h-5 w-5" />
                </Button>
            </Card>
            {draft.uploadedFileName ? (
                <Card variant="success" padding="none" className="rounded-[10px] px-5 py-4 font-apple text-[18px]">
                    업로드됨: {draft.uploadedFileName}
                </Card>
            ) : null}
            {uploadWarnings.length > 0 ? (
                <Card
                    data-testid="upload-warning"
                    padding="none"
                    className="rounded-[10px] border border-[#FFE0A3] bg-[#FFF9EA] px-5 py-4 font-apple text-[16px] text-[#A56600]"
                >
                    <p className="text-[18px] font-semibold">일부 데이터만 반영했어요</p>
                    <ul className="mt-2 list-disc space-y-1 pl-5">
                        {uploadWarnings.map((warning) => (
                            <li key={warning}>{warning}</li>
                        ))}
                    </ul>
                </Card>
            ) : null}
            {uploadError ? (
                <Card
                    data-testid="upload-error"
                    padding="none"
                    className="rounded-[10px] border border-[#F3C6C6] bg-[#FFF5F5] px-5 py-4 font-apple text-[16px] text-[#7A4F4F]"
                >
                    <p className="text-[18px] font-semibold text-[#C55252]">파일 업로드에 실패했어요</p>
                    <p className="mt-2">{uploadError}</p>
                </Card>
            ) : null}
        </div>
    );
}

export default UploadStep;
