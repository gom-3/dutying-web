import {createWardApi} from '@dutying/api/ward';
import axiosInstance from '../client';

const WardAPI = createWardApi(axiosInstance);

export default WardAPI;
