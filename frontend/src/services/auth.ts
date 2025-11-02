import axios from "axios";
import type { formType } from "../utils/form-type";
import type {responseType } from "../utils/response";

/**
 * Logs in a user with provided credentials.
 * Sends a POST request to the backend and stores authentication details in localStorage.
 * 
 * @param {formType} data - The login form data containing username and password.
 * @returns {Promise<responseType>} A promise resolving to a response object indicating success or failure along with message.
 */
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
/**
 * signs up new user with provided credentials.
 * Sends a POST request to the backend and stores authentication details in localStorage.
 * 
 * @param {formType} data - The login form data containing username and password and role.
 * @returns {Promise<responseType>} A promise resolving to a response object indicating success or failure along with a message.
 */
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