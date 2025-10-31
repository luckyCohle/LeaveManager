export  interface leaveApplyType{
    requestedBy:string,
    requestedOn:string,
    leaveType:"earned"|"sick"|"casual"
    fromDate:string,
    toDate:string,
    reason:string
}

export interface approveLeaveType{
    approvedBy?:string,
    approvedOn:string,
    isApproved:boolean,
    rejectionComment?:string,
    staffName:string,
    requestId:string
}