import { useNavigate } from "react-router-dom";

interface propType{
    scrollToSection:(sectionId:string,offset:number)=>void,
    activeSection:string,
    setActiveSection?:React.Dispatch<React.SetStateAction<string>>
}
function AdminNavbar({scrollToSection,activeSection}:propType) {
    const navigate = useNavigate();
    function handleLogout(){
        localStorage.removeItem("userData");
        navigate("/auth");
    }
  return (
   <nav className="sticky top-0 min-h-30 z-50 bg-white shadow-md border-b rounded-bl-2xl rounded-br-2xl border-gray-200 flex justify-center items-center">
                <div className="w-screen mx-auto px-6">
                    <div className="flex items-center justify-around h-16">
                        {/* Title */}
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                        </div>

                        {/* Navigation Links */}
                        <div className="flex items-center gap-6">
                            <button
                                onClick={() => scrollToSection("leave-requests",130)}
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeSection === "leave-requests"
                                        ? "bg-blue-100 text-blue-700"
                                        : "text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                Leave Requests
                            </button>
                            <button
                                onClick={() => scrollToSection("employees",130)}
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeSection === "employees"
                                        ? "bg-blue-100 text-blue-700"
                                        : "text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                Employees
                            </button>
                            <button
                                onClick={() => scrollToSection("leave-history",130)}
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeSection === "leave-history"
                                        ? "bg-blue-100 text-blue-700"
                                        : "text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                Leave History
                            </button>
                        </div>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>
  );
}

export default AdminNavbar;
