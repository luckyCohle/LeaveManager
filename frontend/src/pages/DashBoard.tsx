import { useEffect } from "react"
import AdminDashboard from "../components/AdminDashboard"
import { useNavigate } from "react-router-dom"

function DashBoard() {
    const navigate = useNavigate();
    useEffect(()=>{
        if(!localStorage.getItem("userData")){
            navigate("/auth");
        }
    },[])
  return (
    <div>
        <AdminDashboard/>
    </div>
  )
}

export default DashBoard