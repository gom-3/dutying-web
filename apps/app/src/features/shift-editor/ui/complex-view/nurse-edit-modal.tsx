import {useCallback, useEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import {type TNurse} from '@/entities/nurse';
import useEditShiftTeam from '@/features/edit-shift-team';
import {NurseEditForm} from './nurse-edit-modal/nurse-edit-form';

function NurseEditModal() {
    const {
        state: {selectedNurse},
        actions: {selectNurse, updateNurse},
    } = useEditShiftTeam();
    const [writeNurse, setWriteNurse] = useState<TNurse | null>(null);
    const nameRef = useRef<HTMLInputElement>(null);
    const handleChange = useCallback(<K extends keyof TNurse>(key: K, value: TNurse[K]) => {
        setWriteNurse((prev) => (prev ? {...prev, [key]: value} : prev));
    }, []);

    useEffect(() => {
        if (selectedNurse) {
            nameRef.current?.focus();
            setWriteNurse(selectedNurse);
        }
    }, [selectedNurse]);

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Escape') selectNurse(null);
        },
        [selectNurse],
    );

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    return createPortal(
        <div
            className={`ignore-onclickoutside fixed top-[50%] z-999 scrollbar-hide h-[90vh] w-100 translate-y-[-50%] overflow-y-scroll rounded-[1.25rem] border-l-[.0625rem] border-sub-4.5 bg-white shadow-shadow-2 transition-all duration-500 ease-out ${
                selectedNurse ? 'right-12.5' : '-right-100'
            }`}
        >
            <NurseEditForm
                selectedNurse={selectedNurse ?? null}
                writeNurse={writeNurse}
                nameRef={nameRef}
                onClose={() => selectNurse(null)}
                onChange={handleChange}
                onSubmit={() => writeNurse && updateNurse(writeNurse.nurseId, writeNurse)}
            />
        </div>,
        document.getElementById('nurse-modal-root')!,
    );
}

export default NurseEditModal;
