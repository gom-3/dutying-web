export interface IApiClient {
    get: <T>(url: string) => Promise<{data: T}>;
    post: <T>(url: string, data?: unknown) => Promise<{data: T}>;
    patch: <T>(url: string, data?: unknown) => Promise<{data: T}>;
    put: <T>(url: string, data?: unknown) => Promise<{data: T}>;
    delete: <T>(url: string) => Promise<{data: T}>;
}
