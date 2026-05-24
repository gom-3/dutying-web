import toast from 'react-hot-toast';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {showActionErrorFeedback, showValidationFeedback} from '../feedback';

vi.mock('react-hot-toast', () => ({
    default: {
        error: vi.fn(),
    },
}));

describe('feedback util', () => {
    beforeEach(() => {
        vi.mocked(toast.error).mockReset();
    });

    it('shows validation feedback with a stable toast id', () => {
        showValidationFeedback('검증 오류');

        expect(toast.error).toHaveBeenCalledWith('검증 오류', {id: 'validation-feedback'});
    });

    it('skips duplicate action feedback when the api interceptor already handled the error', () => {
        showActionErrorFeedback({code: 400}, '액션 실패');

        expect(toast.error).not.toHaveBeenCalled();
    });

    it('shows action feedback for unhandled errors', () => {
        showActionErrorFeedback({code: 500}, '액션 실패');

        expect(toast.error).toHaveBeenCalledWith('액션 실패');
    });
});
