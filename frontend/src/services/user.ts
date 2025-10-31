import { Users } from "../utils/mock-db"

export const getUsers = ()=>{
    return Users;
}

export const getUserData =(username:string)=>{
    const data =Users.find(item => item.username= username);
    return data;
}