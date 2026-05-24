import toast from 'react-hot-toast';

const HANDLED_API_ERROR_CODES = new Set([400, 401, 404]);

export function showValidationFeedback(message: string) {
    toast.error(message, {id: 'validation-feedback'});
}

export function showActionErrorFeedback(error: unknown, message: string) {
    const code = typeof error === 'object' && error !== null && 'code' in error ? (error as {code?: number}).code : undefined;

    if (code !== undefined && HANDLED_API_ERROR_CODES.has(code)) {
        return;
    }

    toast.error(message);
}
