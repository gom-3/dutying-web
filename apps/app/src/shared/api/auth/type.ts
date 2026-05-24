import type {TAccountResponse} from '@dutying/api/account';
import type {TWardResponse} from '@dutying/api/ward';

export type TDemoStartResponse = {
    wardResDto: TWardResponse;
    accountResDto: TAccountResponse;
    accessToken: string;
};

export interface IAuthAPI {
    // POST
    demoStart: () => Promise<TDemoStartResponse>;
    logout: (accessToken: string | null) => Promise<void>;
}
