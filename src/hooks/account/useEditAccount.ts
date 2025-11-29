import {useQueryClient} from '@tanstack/react-query';
import toast from 'react-hot-toast';
import useAuth from '@/hooks/auth/useAuth';
import useLoading from '@/hooks/ui/useLoading';
import useEditWard from '@/hooks/ward/useEditWard';
import {editAccount, eidtAccountStatus, deleteAccount as deleteAccountApi} from '@/libs/api/account';
import {updateNurse} from '@/libs/api/nurse';
import {quitWard as quitWardApi} from '@/libs/api/ward';
import {type Nurse} from '@/types/nurse';

const useEditAccount = () => {
    const {
        state: {accountMe},
        actions: {handleGetAccountMe, handleLogout},
    } = useAuth();
    const {
        queryKey: {getWardQueryKey},
    } = useEditWard();
    const {setLoading} = useLoading();
    const queryClient = useQueryClient();
    const handleEditProfile = async (nurse: Nurse, profileImage: string) => {
        if (!accountMe) return;

        try {
            setLoading(true);
            updateNurse(nurse.nurseId, nurse);
            await editAccount(accountMe.accountId, {
                name: nurse.name,
                profileImgBase64: profileImage,
            });
            await queryClient.invalidateQueries({queryKey: getWardQueryKey});
            await handleGetAccountMe();
        } catch (e) {
            console.error(e);
            toast.error('프로필 업데이트에 실패했습니다..');
        } finally {
            setLoading(false);
        }
    };
    const quitWard = async () => {
        if (!accountMe?.wardId) return;

        if (!confirm('정말 병동을 나가시겠습니까?')) return;

        try {
            setLoading(true);
            await quitWardApi(accountMe.wardId);
            await eidtAccountStatus(accountMe.accountId, 'WARD_SELECT_PENDING');
            await handleGetAccountMe();
        } catch (e) {
            console.error(e);
            toast.error('병동 나가기에 실패했습니다..');
        } finally {
            setLoading(false);
        }
    };
    const deleteAccount = async () => {
        if (!accountMe) return;

        if (!confirm('정말 탈퇴하시겠습니까?')) return;

        try {
            setLoading(true);
            deleteAccountApi(accountMe.accountId);
            handleLogout();
        } catch (e) {
            console.error(e);
            toast.error('계정 삭제에 실패했습니다..');
        } finally {
            setLoading(false);
        }
    };

    return {quitWard, handleEditProfile, deleteAccount};
};

export default useEditAccount;
