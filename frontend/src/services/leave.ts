import axios from "axios";
import type { approveLeaveType, leaveApplyType } from "../utils/leave-type";
import type { leaveType } from "../utils/user-type";
import { getUserData } from "./user";
import { generateId } from "../utils/randomId";


/**
 * sends leave application to create new leave requests
 * Sends a POST request to the backend
 * @param {leaveApplyType} leaveFormData - contains feilds like fromDate, toDate and reason , for leave application
 * @returns {Promise<boolean>} A promise resolving to a boolean indicating success or failure.
 */
export const applyForLeave = async (leaveFormData: leaveApplyType): Promise<boolean> => {
    //calculating today's date
    const today = leaveFormData.requestedOn.split("T")[0];
    //calculating total number of leaves
    const totalLeaves = getTotalLeaves(leaveFormData.fromDate, leaveFormData.toDate);
    //basic validation
    if (totalLeaves< 0) {
        console.log("requested Leave is invalid");
        return false;
    }
    let invalidLeave;
    //finding particula user from the array and updating his/her data
    const user = await getUserData(leaveFormData.requestedBy);
    if(!user)return false;
    //checking if user has enough leaves balance to make this request
    if(leaveFormData.leaveType=="casual"){
        if (totalLeaves>user.leavesBalance.casual) {
            invalidLeave=true;
        }
    }else if(leaveFormData.leaveType=="earned"){
         if (totalLeaves>user.leavesBalance.earned) {
            invalidLeave=true;
        }
    }else{
         if (totalLeaves>user.leavesBalance.sick) {
            invalidLeave=true;
        }
    }
    if(invalidLeave){
        console.log("you don't have sufficient number of leaves left");
        return false;
    }
    //requset body
    const leaveHistoryItem: leaveType = {
        id:generateId(),
        requestedOn: today,
        fromDate: leaveFormData.fromDate,
        toDate: leaveFormData.toDate,
        totalLeaves,
        category: leaveFormData.leaveType,
        status: "requested",
        reason: leaveFormData.reason
    };
    const userId = leaveFormData.requestedBy;

    try {
        const response= await axios.post(`${import.meta.env.VITE_API_URL}/leaves/create`,{userId,leaveRequest:leaveHistoryItem})
        console.log(response.data)
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};
// helper function to get total leaves based on from and todate excluding holidays
const getTotalLeaves = (from:string,to:string)=>{ 
    const d2 = new Date(to);
    const d1 = new Date(from);
    const diffTime = d2.getTime() - d1.getTime();
    const diffDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24))+1;
    let current = d1;
    let weekendCount =0;
    // running a while loop to count no of weekends
    while(current<=d2){
        const day = getDayFromDate(current);
        if(day == "Sun" || day == "Sat"){
            weekendCount++;
        }
        current.setDate(current.getDate()+1);
    }
    //subtracting no of weekends from total leaves
    return diffDay-weekendCount;
}

const getDayFromDate = (date:Date) => {
  return date.toLocaleDateString("en-US", { weekday: "short" });
};

//function for admin to approve or deny leave request
/**
 * sends approve or deny leave request for a particular to the backend
 * Sends a POST request to the backend and returns the output as boolean
 * @param {approveLeaveType} approveForm - have filds like rejection comment, requestId etc
 * @returns {Promise<boolean>} A promise resolving to a boolean indicating success or failure.
 */
export const approveOrDenyLeave = async (approveForm: approveLeaveType):Promise<boolean> => {
    try {
        await axios.post(`${import.meta.env.VITE_API_URL}/leaves/approveOrDeny`,approveForm)
        return true;
    } catch (error) {
        return false;
    }
};
