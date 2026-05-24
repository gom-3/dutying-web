import {createAccountApi} from '@dutying/api/account';
import axiosInstance from '../client';

export default createAccountApi(axiosInstance);
