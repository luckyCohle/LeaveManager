import { useEffect, useState } from "react";
import LeavesHistory from "./LeaveHistory";
import LeavesDisplay from "./LeavesDisplay";
import UsersDisplay from "./UsersDisplay";
import { getLeaveRequests, type leaveArrayItem } from "../services/leave-requests";
import AdminNavbar from "./AdminNavbar";
import { toast, ToastContainer } from "react-toastify";

function AdminDashboard() {
    const [allLeaves, setAllLeaves] = useState<leaveArrayItem[]>([]);
    const [refresh, setRefresh] = useState<number>(0);
    const [activeSection, setActiveSection] = useState<string>("leave-requests");
    useEffect(() => {
        const leaves = getLeaveRequests();
        setAllLeaves(leaves);
    }, [refresh])

    const scrollToSection = (sectionId: string, offset: number = 0) => {
        setActiveSection(sectionId);
        const element = document.getElementById(sectionId);
        if (element) {

            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - offset; // subtract the offset

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    };

    const displayNotification = (message:string,type:"success"|"faliure")=>{
        if(type == "success"){
            toast.success(message);
        }else if(type == "faliure"){
            toast.error(message);
        }
    }

    return (
        <div className="min-h-screen bg-gray-200 ">
            <AdminNavbar activeSection={activeSection} scrollToSection={scrollToSection} />
            <div className="h-full p-6">
                {/* <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1> */}

                {/* leave requests display  */}
                <div id="leave-requests" className="mb-8">
                    <LeavesDisplay allLeaves={allLeaves} setAllLeaves={setAllLeaves} refresh={refresh} setRefresh={setRefresh} displayNotification={displayNotification} />
                </div>

                {/* user data display  */}
                <div id="employees" className="mb-8">
                    <UsersDisplay />
                </div>

                {/* leave history */}
                <div id="leave-history" className="mb-8">
                    <LeavesHistory allLeaves={allLeaves} setAllLeaves={setAllLeaves} />
                </div>
                {/* container for display message */}
                <ToastContainer
                    position="top-right"
                    autoClose={3000}          
                    hideProgressBar={false}
                    newestOnTop={true}
                    closeOnClick
                    theme="light"
                />
            </div>
        </div>

    )
}

export default AdminDashboard