import {createNurseApi} from '@dutying/api/nurse';
import axiosInstance from '../client';

export default createNurseApi(axiosInstance);
