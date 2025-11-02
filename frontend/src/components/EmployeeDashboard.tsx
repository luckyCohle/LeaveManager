import { useEffect, useState } from "react";
import type { userDataType } from "../utils/user-type";
import EmpolyeeLeaves from "./EmployeeLeaves";
import { getUserData } from "../services/user";
import { LogOut, CalendarCheck, Home } from "lucide-react";
import ApplyLeaveModal from "./ApplyLeaveModal";
import { applyForLeave } from "../services/leave";
import type { leaveApplyType } from "../utils/leave-type";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

function EmployeeDashboard() {
  //store userData
  const [userData, setUserData] = useState<userDataType>();
  //toggle aopend and close apply leave modal
  const [openModal,setOpenModal] = useState<boolean>(false);
  //to refetch data from server
  const [refresh,setRefresh] = useState<number>(0);
  const naviagate = useNavigate();
  async function getData() {
    const stored = localStorage.getItem("userData");
    if (!stored){
      naviagate("/auth");
      return;
    };
    const userId = JSON.parse(stored).userId;
    const data = await getUserData(userId);
    if (!data) return;
    setUserData(data);
  }

  useEffect(() => {
    getData();
  }, [refresh]);

  //handle submit of leave application form
  async function handleApplyLeaveSubmit(fromDate: string, toDate: string, reason: string,category:"casual"|"sick"|"earned"):Promise<void> {
    const reqBody:leaveApplyType={
      fromDate,
      toDate,
      requestedBy:userData?._id||"",
      reason,
      leaveType:category,
      requestedOn:new Date().toISOString()

    }
    const isSuccess =await applyForLeave(reqBody);
    //display message based on server response
    if(isSuccess){
      setRefresh((prev)=>prev+1);
      toast.success("Applied for Leave Successfully")
    }else{
      toast.error("Leave application failed")
    }
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white h-screen sticky top-0 left-0 shadow-lg border-r flex flex-col p-6">
        <h2 className="text-2xl font-bold text-blue-600 mb-6">
          Leave Manager
        </h2>

        <nav className="flex flex-col gap-3 text-gray-700">
          <div className="flex gap-3 items-center p-2 rounded-md hover:bg-blue-50 cursor-pointer transition">
            <Home className="w-5 h-5" />
            Dashboard
          </div>
          <div className="flex gap-3 items-center p-2 rounded-md hover:bg-blue-50 cursor-pointer transition"
          onClick={()=>setOpenModal(true)}>
            <CalendarCheck className="w-5 h-5" />
            Apply Leave
          </div>
        </nav>

        <div className="mt-auto">
          <button className="flex items-center gap-2 w-full p-2 text-red-600 rounded-md hover:bg-red-100 transition">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 space-y-10">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">
              Welcome back, <span className="text-blue-600">{userData?.username}</span>
            </h1>
            <p className="text-gray-500 text-sm">Hope you're having a productive day </p>
          </div>
        </div>

        {/* leave Balance Section */}
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Leave Balance</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            <div className="bg-sky-300 border-blue-400 border-2 shadow-md p-6 rounded-xl text-center ">
              <p className="text-gray-500 text-2xl font-medium">Casual</p>
              <p className="text-3xl font-bold text-blue-600">{userData?.leavesBalance.casual}</p>
            </div>

            <div className="bg-orange-300 shadow-md border-amber-500 p-6 rounded-xl text-center border-2">
              <p className="text-gray-500 text-2xl font-medium">Sick</p>
              <p className="text-3xl font-bold text-yellow-600">{userData?.leavesBalance.sick}</p>
            </div>

            <div className="bg-emerald-300 shadow-md p-6 border-green-500 rounded-xl text-center border-2">
              <p className="text-gray-500 text-2xl font-medium">Earned</p>
              <p className="text-3xl font-bold text-green-600">{userData?.leavesBalance.earned}</p>
            </div>

          </div>
        </section>

        {/* Leave Table */}
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Leave History</h3>
          <EmpolyeeLeaves allLeaves={userData?.leaveHistory || []} />
        </section>

        {/* Apply Button */}
        <div className="text-right">
          <button className="bg-blue-600 text-white font-semibold px-6 py-3 text-sm rounded-lg shadow-md hover:bg-blue-700 transition active:scale-95"
          onClick={()=>setOpenModal(true)}>
            Apply for Leave
          </button>
        </div>

      </div>
       <ApplyLeaveModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleApplyLeaveSubmit}
      />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default EmployeeDashboard;
