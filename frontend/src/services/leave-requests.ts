import axios from "axios";
import type { leaveType } from "../utils/user-type";
export interface leaveArrayItem extends leaveType{
    username:string;
}
/**
 * fetches leave requests data form the backend 
 * 
 * @returns {Promise<responseType>} A promise resolving to a array of leaveRequests.
 */
export const getLeaveRequests = async (): Promise<leaveArrayItem[]> => {
    let requestArray: leaveArrayItem[] = [];
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/leaves/getAllRequests`);
        requestArray = response.data.data ;
    } catch (error) {
        console.log("Error while fetching data: " + error);
        requestArray = [];
    }
    return requestArray;
};