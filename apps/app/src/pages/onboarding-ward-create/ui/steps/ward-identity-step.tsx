import {Input} from '@/shared/ui/primitives/input';

interface IWardIdentityStepProps {
    identityName: string;
    hasError?: boolean;
    onIdentityNameChange: (identityName: string) => void;
    onIdentityNameEnter: () => void;
}

const NAME_FIELD_MAX_LENGTH = 20;

function WardIdentityStep({identityName, hasError = false, onIdentityNameChange, onIdentityNameEnter}: IWardIdentityStepProps) {
    return (
        <div className="mx-auto w-full max-w-[620px] pt-[30px]">
            <div className="group transition-all duration-200 ease-out">
                <Input
                    id="onboarding-identity-name"
                    value={identityName}
                    placeholder="병원명 또는 병동명을 입력해 주세요"
                    maxLength={NAME_FIELD_MAX_LENGTH}
                    variant="foundation"
                    fieldSize="lg"
                    className={`h-[58px] rounded-[14px] border bg-white px-5 text-center font-apple text-[18px] caret-[#6A4AE1] transition-[border-color,box-shadow,background-color] duration-200 ease-out placeholder:text-gray-4 focus:bg-white focus-visible:bg-white ${
                        hasError
                            ? 'border-[#D14343] ring-[2px] ring-[#D14343] focus:border-[#D14343] focus-visible:border-[#D14343] focus:ring-[2px] focus:ring-[#D14343] focus-visible:ring-[2px] focus-visible:ring-[#D14343]'
                            : 'border-gray-5 hover:border-[#7A5AF8] hover:ring-[2px] hover:ring-[#7A5AF8] focus-visible:border-[#7A5AF8] focus-visible:ring-[2px] focus-visible:ring-[#7A5AF8]'
                    }`}
                    onChange={(event) => onIdentityNameChange(event.target.value)}
                    onKeyDown={(event) => {
                        // Keep Enter-to-next from firing while IME composition is active.
                        if (event.nativeEvent.isComposing || event.keyCode === 229) {
                            return;
                        }

                        if (event.key !== 'Enter') {
                            return;
                        }

                        event.preventDefault();
                        onIdentityNameEnter();
                    }}
                />
            </div>
        </div>
    );
}

export default WardIdentityStep;
