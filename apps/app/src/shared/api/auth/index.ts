import axiosInstance from '../client';
import {type IAuthAPI, type TDemoStartResponse} from './type';

class AuthAPI implements IAuthAPI {
    demoStart = async () => (await axiosInstance.post<TDemoStartResponse>('/demo/start')).data;
    logout = async (accessToken: string | null) => (await axiosInstance.post('/token/blacklist', {accessToken})).data;
}

export default new AuthAPI();
