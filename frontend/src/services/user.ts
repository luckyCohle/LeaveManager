import axios from "axios";

import type { userDataType } from "../utils/user-type";

export const getUsers = async():Promise<userDataType[]>=>{
    try {
        const response =await axios.get(`${import.meta.env.VITE_API_URL}/user/getAllUsers`);
        return response.data.allUsers || [];
    } catch (error) {
        console.log("error while fetching Data"+error)   
        return [];
    }
}

export const getUserData =async (userId:string):Promise<userDataType|null>=>{
    try {
        const response=await axios.get(`${import.meta.env.VITE_API_URL}/user/data/${userId}`)
        return response.data.userData;
    } catch (error) {
        console.log("data retrival failed");
        console.log(error);
        return null;
    }
}