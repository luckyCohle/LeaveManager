import axios from "axios";
import type { formType } from "../utils/form-type";
import type {responseType } from "../utils/response";

export const login =async(data:formType):Promise<responseType>=>{
    console.log("login attempt registered")
    console.log(data.username+" "+data.password);
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/login`,data);
        
            localStorage.setItem("token",response.data.token);
            localStorage.setItem('userData',JSON.stringify(response.data.user));
            return{
                isSuccess:true,
                message:response.data.message
            }
        
    } catch (error:any) {
        console.log("login failed");
        return{
            isSuccess:false,
            message:error.response?.data?.message || error.message
        }
    }
}
export const signup =async (data:formType):Promise<responseType>=>{
    console.log("signup attempt registered")
    console.log(data.username+" "+data.password+" "+data.role);
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/signup`,data);
        localStorage.setItem("token",response.data.token);  
        localStorage.setItem("userData",JSON.stringify(response.data.user)); 
        return{
            isSuccess:true,
            message:response.data.message
        }
    } catch (error:any) {
        return{
            isSuccess:false,
            message:error.response?.data?.message || error.message
        }
    }
}