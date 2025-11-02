import { useEffect, useState } from "react";
import LeavesHistory from "./LeaveHistory";
import LeavesDisplay from "./LeavesDisplay";
import UsersDisplay from "./UsersDisplay";
import { getLeaveRequests, type leaveArrayItem } from "../services/leave-requests";
import AdminNavbar from "./AdminNavbar";
import { toast, ToastContainer } from "react-toastify";

function AdminDashboard() {
    //to store all the leave Requests fetched from the server
    const [allLeaves, setAllLeaves] = useState<leaveArrayItem[]>([]);

    //to refetch the data by running the useEffect again
    const [refresh, setRefresh] = useState<number>(0);
    
    //to select a particular section to be used by navbar
    const [activeSection, setActiveSection] = useState<string>("leave-requests");

    async function getData() {
        // fetch data from server and store data in allLeaves
        const leaves = await getLeaveRequests();
        setAllLeaves(leaves);
    }
    useEffect(() => {
        getData();
        // fetched data on inital load and whenever refresh changes
    }, [refresh])

    //function to scroll to specific section on page using navbar
    const scrollToSection = (sectionId: string, offset: number = 0) => {
        setActiveSection(sectionId);
        const element = document.getElementById(sectionId);
        if (element) {

            //gets the particular section to top of the page
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;

            //subtracting offset to make it visible and move it below navbar
            const offsetPosition = elementPosition - offset; 

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    };

    //display notification using react-toastify
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

                {/* leave requests display  */}
                <div id="leave-requests" className="mb-8">
                    <LeavesDisplay allLeaves={allLeaves} refresh={refresh} setRefresh={setRefresh} displayNotification={displayNotification} />
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