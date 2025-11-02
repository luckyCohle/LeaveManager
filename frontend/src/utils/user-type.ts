export interface userDataType{
    _id:string,
    username:string,
    password:string,
    role?:"Admin"|"Staff",
    leaveHistory?:leaveType[],
    leavesBalance:{
    casual:number,
    sick:number,
    earned:number
    }
}

export interface leaveType{
    id?:string,
    category:"sick"|"casual"|"earned",
    status:"requested"|"approved"|"denied",
    requestedOn:string,
    fromDate:string,
    toDate:string,
    totalLeaves:number,
    decisionDate?:string,
    reviewedBy?:string
    reason?:string,
    rejectionComment?:string
}