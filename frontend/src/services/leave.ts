import type { approveLeaveType, leaveApplyType } from "../utils/leave-type";
import { Users } from "../utils/mock-db";
import { generateId } from "../utils/randomId";
import type { leaveType } from "../utils/user-type";
//function for staff to apply for a leave
export const applyForLeave = (leaveFormData: leaveApplyType): boolean => {
    //calculating today's date
    const today = new Date().toISOString().split("T")[0];
    //calculating total number of leaves
    const totalLeaves = getTotalLeaves(leaveFormData.fromDate, leaveFormData.toDate);
    //basic validation
    if (totalLeaves > 15 || totalLeaves< 0) {
        console.log("requested Leave is invalid");
        return false;
    }
    //finding particula user from the array and updating his/her data
    const user = Users.find(u => u.username === leaveFormData.requestedBy);
    if (!user) return false;
    let invalidLeave:boolean = false
    //checking if user has enough leaves balance to make this request
    if(leaveFormData.leaveType=="casual"){
        if (totalLeaves<user.leavesBalance.casual) {
            invalidLeave=true;
        }
    }else if(leaveFormData.leaveType=="earned"){
         if (totalLeaves<user.leavesBalance.earned) {
            invalidLeave=true;
        }
    }else{
         if (totalLeaves<user.leavesBalance.sick) {
            invalidLeave=true;
        }
    }
    if(invalidLeave){
        console.log("you don't have sufficient number of leaves left");
        return false;
    }
    
    const leaveHistoryItem: leaveType = {
        id: generateId(),
        requestedOn: today,
        fromDate: leaveFormData.fromDate,
        toDate: leaveFormData.toDate,
        totalLeaves,
        category: leaveFormData.leaveType,
        status: "requested",
        reason: leaveFormData.reason
    };

    if (!user.leaveHistory) {
        user.leaveHistory = [];
    }
    user.leaveHistory.push(leaveHistoryItem);

    return true;
};

//function to get total leaves
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
export const approveOrDenyLeave = (approveForm: approveLeaveType) => {
    
    const user = Users.find(u => u.username === approveForm.staffName);
    if (!user || !user.leaveHistory) return;

    const requestIndex = user.leaveHistory.findIndex(lh => lh.id === approveForm.requestId);
    if (requestIndex === -1) return;

    const leaveRequest = user.leaveHistory[requestIndex];

    if (approveForm.isApproved) {
        leaveRequest.status = "approved";
    } else {
        leaveRequest.status = "denied";
        leaveRequest.rejectionComment = approveForm.rejectionComment || "Not provided";
    }

    leaveRequest.decisionDate = approveForm.approvedOn;
    leaveRequest.reviewedBy = approveForm.approvedBy;
    console.log("approval success")
    return true;
};
