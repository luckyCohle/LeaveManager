import { useEffect, useState } from "react"
import AdminDashboard from "../components/AdminDashboard"
import { useNavigate } from "react-router-dom"
import EmployeeDashboard from "../components/EmployeeDashboard";

function DashBoard() {
    const navigate = useNavigate();
    const [role,setRole] = useState<string>();
    useEffect(()=>{
        if(!localStorage.getItem("userData")){
            navigate("/auth");
            return;
        }
        const userData = localStorage.getItem("userData");
        if(!userData){
          navigate("/auth");
           return;
        }
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
      {role === "Admin" ? <AdminDashboard /> : <EmployeeDashboard />}
    </div>
  );
}

export default DashBoard