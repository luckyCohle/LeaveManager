import { useState } from "react"
import type { formType } from "../utils/form-type";
import { login, signup } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import type { responseType } from "../utils/response";
import { Eye, EyeOff } from "lucide-react";

function Login() {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [loginForm, setLoginForm] = useState<formType>({ username: "", password: "" })
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();
  const handleForm = (e: any) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  }
  const handleSubmit = async () => {
    let res:responseType;
    if (isLogin) {
      res = await login(loginForm);
    } else {
      res = await signup(loginForm);
    }
    if (res.isSuccess){
      toast.success(res.message);
      setTimeout(() => {
        navigate("/");
      }, 1500);
    }else{
      toast.error(res.message);
    }
  }
  return (
    <div className="bg-white shadow-lg rounded-2xl p-8 w-96 ">
      {/* Toggle Buttons */}
      <div className="flex justify-center mb-6 space-x-4">
        <button
          className={`px-4 py-2 rounded-md ${isLogin ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setIsLogin(true)}
        >
          Login
        </button>
        <button
          className={`px-4 py-2 rounded-md ${!isLogin ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setIsLogin(false)}
        >
          Signup
        </button>

      </div>

      {/* Form Fields */}
      <div className="flex flex-col space-y-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            type="text"
            name="username"
            value={loginForm.username}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            placeholder="Enter username"
            onChange={handleForm}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"} // <-- toggle type
              name="password"
              value={loginForm.password}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Enter password"
              onChange={handleForm}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5"/>}
            </button>
          </div>
        </div>

        {!isLogin && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select role</label>
            <div className="flex justify-around">
              <label className="flex items-center space-x-2">
                <input type="radio" name="role" value={"Admin"} checked={loginForm.role === "Admin"} onChange={handleForm} id="Admin" />
                <span>Admin</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="role" value={"Staff"} checked={loginForm.role === "Staff"} onChange={handleForm} id="Staff" />
                <span>Staff</span>
              </label>
            </div>
          </div>
        )}

        <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          onClick={handleSubmit}>
          {isLogin ? "Login" : "Signup"}
        </button>
      </div>

      {/* credentials for login  */}
      <div className=" p-2 bg-gray-400 mt-2 text-black rounded-xl">
        <p className="font-semibold italic text-md">*Mock Users for Login</p>
        <div className="p-1 flex flex-row justify-between items-center">
          <div className="p-0.5 flex flex-col justify-around items-center text-sm bg-sky-300 rounded-lg ">
            <p>Admin</p>
            <p>username : emma.smith</p>
            <p>password : Test@321</p>
          </div>
          <div className=" p-0.5 text-sm flex flex-col justify-around items-center  bg-sky-300 rounded-lg">
            <p>Staff</p>
            <p>username : john.doe</p>
            <p>password : Pass@123</p>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        theme="light"
      />
    </div>
  )
}

export default Login