import { Users } from "../utils/mock-db";
import type { leaveType } from "../utils/user-type";
export interface leaveArrayItem extends leaveType{
    username:string;
}
export const getLeaveRequests = ():leaveArrayItem[]=>{
    const requestArray = Users.flatMap((user) =>
    user.leaveHistory?.map((leave) => ({
      ...leave,
      username: user.username, 
    })) || []
  );
    return requestArray;
}