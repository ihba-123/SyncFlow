import {api} from "../api/axios_inteceptor";


export const chatRoomApi = async () => {
   const res = await api.get('chatrooms/create/');
    return res.data;    
}