import type { formType } from "../utils/form-type";
import { Users } from "../utils/mock-db";
import type { userDataType } from "../utils/user-type";

export const login =(data:formType)=>{
    console.log("login attempt registered")
    console.log(data.username+" "+data.password);
    const userFromDB = Users.find((userInDB)=>userInDB.username === data.username);
    if(!userFromDB){
        console.log("user not found")
        return false;
    };
    const doesPasswordMatch = userFromDB.password == data.password;
    if(doesPasswordMatch){
        localStorage.setItem("userData",userFromDB.username+" "+userFromDB.role);
        return true;
    }else{
        console.log("password did not match")
        return false;
    }
}
export const signup =(data:formType)=>{
    console.log("signup attempt registered")
    console.log(data.username+" "+data.password+" "+data.role);
    const userFromDB = Users.find((userInDB)=>userInDB.username == data.username);
    if(userFromDB){
        console.log("user already exists")
        return false;
    }
    const newUser:userDataType={
        username:data.username,
        password:data.password,
        role:data.role,
        leavesBalance:{
        casual:15,
        sick:15,
        earned:15
        }
    }
    Users.push(newUser);
    localStorage.setItem("userData",data.username+" "+data.role);
    return true;

}