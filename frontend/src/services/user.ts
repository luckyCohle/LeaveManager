import axios from "axios";

import type { userDataType } from "../utils/user-type";

/**
 * gets all the users from the backend
 * Sends a get request
 * 
 * @returns {Promise<userDataType[]>} A promise resolving to a userDataType array containing data for all the users
 */
export const getUsers = async():Promise<userDataType[]>=>{
    try {
        const response =await axios.get(`${import.meta.env.VITE_API_URL}/user/getAllUsers`);
        return response.data.allUsers || [];
    } catch (error) {
        console.log("error while fetching Data"+error)   
        return [];
    }
}
/**
 * gets data for a particuar users
 * sends a get requests along with the userId in params.
 * 
 * @param {string} userId - The id of the user.
 * @returns {Promise<userDataType|null>} A promise resolving to a object containing userdata.
 */
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