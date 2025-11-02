import { useEffect, useState } from "react"
import AdminDashboard from "../components/AdminDashboard"
import { useNavigate } from "react-router-dom"
import EmployeeDashboard from "../components/EmployeeDashboard";

function DashBoard() {
    const navigate = useNavigate();
    const [role,setRole] = useState<string>();//role of the user admiin or staff
    useEffect(()=>{
        if(!localStorage.getItem("userData")){
            navigate("/auth");//if no data found in localstorage navigate to login  page
            return;
        }
        const userData = localStorage.getItem("userData");
        if(!userData){
          navigate("/auth");
           return;
        }
        //retrive the user data from localstorage and get the user role
        const userDataJson = JSON.parse(userData);
        const userRole=userDataJson.role;
        setRole(userRole);
    },[])
     if (role === null) {
    // Still loading user data
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* dispaly DashBoard based on role  */}
      {role === "Admin" ? <AdminDashboard /> : <EmployeeDashboard />}
    </div>
  );
}

export default DashBoard