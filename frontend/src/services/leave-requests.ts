import axios from "axios";
import type { leaveType } from "../utils/user-type";
export interface leaveArrayItem extends leaveType{
    username:string;
}
export const getLeaveRequests = async (): Promise<leaveArrayItem[]> => {
    let requestArray: leaveArrayItem[] = [];
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/leaves/getAllRequests`);
        requestArray = response.data.data ;
        // console.log("response=>")
        // console.log(requestArray)
    } catch (error) {
        console.log("Error while fetching data: " + error);
        requestArray = [];
    }
    return requestArray;
};