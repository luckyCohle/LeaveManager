import { useEffect, useState } from 'react'
import { approveOrDenyLeave } from '../services/leave';
import type { approveLeaveType } from '../utils/leave-type';
import FilterSortPanel from './FilterSortPanel';
import type { leaveArrayItem } from '../services/leave-requests';

interface propType {
    allLeaves?: leaveArrayItem[],
    refresh: number,
    setRefresh: React.Dispatch<React.SetStateAction<number>>,
    displayNotification: (message: string, type: "success" | "faliure") => void
}
function LeavesDisplay({allLeaves, refresh, setRefresh, displayNotification }: propType) {
    //list of leaves requests being displayed on the screen
    const [displayLeaves, setDisplayLeaves] = useState<leaveArrayItem[]>();
    //to toggle between show less and view all 
    const [viewAll, setViewAll] = useState<boolean>(false);
    //to store all requests with status requested
    const [leaveRequest, setLeaveRequests] = useState<leaveArrayItem[]>();
    //to toggle open and close deny request modal
     const [enterComment, setEnterComment] = useState<boolean>(false);
    //to select a particular request ,to unable deny modal opening
    const [selectedRequest, setSelectedRequest] = useState<string | null>("");
    //to store the rejection comment
    const [comment, setComment] = useState<string>("");
    // to dispaly loading when approve or deny is clicked
    const [load, setLoad] = useState<string | null>(null);
    //to select which button to show loading inside
    const [loadInside, setLoadInside] = useState<"approve" | "deny" | null>(null);
    // to manage conflict between view all and filter functionality 
    // when is filtered is true display will become show all
    const [isFiltered, setIsFiltered] = useState<boolean>(false);

    //gets leave from AdminDashboard and selects one with status requested
    useEffect(() => {
        const leaves = allLeaves;
        const requests = leaves?.filter((leave) => leave.status === "requested");
        setLeaveRequests(requests);

    }, [refresh,allLeaves])

    useEffect(() => {
        //shows 3 or all requests based on the value of viewAll
        if (viewAll && leaveRequest) {
            setDisplayLeaves(leaveRequest)
        } else {
            setDisplayLeaves(leaveRequest?.slice(0, 3))
        }

    }, [viewAll, leaveRequest])

    function handleViewAllClick() {

        if (isFiltered) {
            setViewAll(true);//view all will be true when ever isFiltered is selected
        } else {
            setViewAll((prev) => !prev);//toggle in other case
        }
        setIsFiltered(false);//when a filter is applied and user clicks viewAll it would disable the filter
                             //show all the requests
    }
    //function to handle form item change and simple button clicks
    const handleCommentChange = (e: any) => {
        setComment(e.target.value);
    }
    const denyClick = (id: string) => {
        setEnterComment(true);
        setSelectedRequest(id);
    }
    const cancelClick = () => {
        setEnterComment(false);
        setComment("");
        setSelectedRequest(null)
    }
    //function to handle approve button click
    const handleApprove = async (id: string, username: string) => {
        console.log(`Approved leave request: ${id}`);
        //parameter body
        const approveLeaveBody: approveLeaveType = {
            approvedOn: new Date().toISOString().split('T')[0],
            isApproved: true,
            staffName: username,
            requestId: id
        }
        //start loading
        setLoad(id);
        setLoadInside("approve");

        //function call
        const isSuccess = await approveOrDenyLeave(approveLeaveBody);
        //display message based on the respose from server
        if(isSuccess){
            displayNotification("Leave Approved", "success")
        }else{
            displayNotification("Leave Approval Failed", "faliure")
        }
        //stop loadig
        setLoad(null);
        setLoadInside(null);
        //tell page to refetch the data
        setRefresh((prev) => prev + 1);
    }

    const handleDeny = async (id: string, username: string) => {
        console.log(`Denied leave request: ${id} with comment: ${comment}`);
        //paramenter body
        const denyLeaveBody: approveLeaveType = {
            requestId: id,
            staffName: username,
            isApproved: false,
            rejectionComment: comment,
            approvedOn: new Date().toISOString().split('T')[0],
        };
        //start loading
        setLoad(id);
        setLoadInside("approve");

        let isSuccess =await approveOrDenyLeave(denyLeaveBody);
        //nullify all feilds once request has been made
        setComment("");
        setEnterComment(false);
        setSelectedRequest(null);
        //display appropriate message
        if(isSuccess){
            displayNotification("Leave Denied", "faliure")
        }else{
            displayNotification("System Error :Leave was not Denied", "faliure")
        }
        //stop laod
        setLoad(null);
        setLoadInside(null);
        //refetch data
        setRefresh((prev) => prev + 1);
    };

    //filter the requests displayed on screen based on the parameter selected
    function filterDisplay(startDate: string, endDate: string, days: string) {
        let requestArray: leaveArrayItem[] = displayLeaves || [];
        setIsFiltered(true);
        if (startDate) {
            requestArray = requestArray.filter((item) => item.fromDate == startDate);
        }
        if (endDate) {
            requestArray = requestArray.filter((item) => item.toDate == endDate)
        }
        if (days) {
            requestArray = requestArray.filter((item) => item.totalLeaves == Number(days));
        }
        setDisplayLeaves(requestArray);
    }
    //sort the displayed requests based on th paramenter selected and the order selected
    function sortDisplay(sortBy: "start" | "end" | "days" | "none", ascending: boolean) {
        if (!leaveRequest) return
        let sortedLeaves = [...leaveRequest];
        console.log(sortBy+" "+ascending);
        //switch case to sort he array based on the parament and order
        switch (sortBy) {
            case "start":
                sortedLeaves.sort((a, b) => {
                    const dateA = new Date(a.fromDate).getTime();
                    const dateB = new Date(b.fromDate).getTime();
                    return ascending ? dateA - dateB : dateB - dateA;
                });
                break;

            case "end":
                sortedLeaves.sort((a, b) => {
                    const dateA = new Date(a.toDate).getTime();
                    const dateB = new Date(b.toDate).getTime();
                    return ascending ? dateA - dateB : dateB - dateA;
                });
                break;

            case "days":
                sortedLeaves.sort((a, b) => {
                    return ascending ? a.totalLeaves - b.totalLeaves : b.totalLeaves - a.totalLeaves;
                });
                break;

            case "none":
            default:
                console.log("here");
                sortedLeaves=[...leaveRequest]
                break;
        }
        // set isFiltered true so that all the filtered requests are shown and store these requests
        setIsFiltered(true)
        setDisplayLeaves(sortedLeaves);
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Leave Requests Section */}
            <div className=" rounded-lg bg-white shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="mb-8">
                        <p className="text-blue-300 text-2xl">Manage employee leave requests</p>
                    </div>
                    <h2 className="text-xl mb-1 font-semibold text-gray-800">
                        Pending Leave Requests
                        {leaveRequest && leaveRequest.length > 0 && (
                            <p className="ml-2 mt-2 w-10 px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                                {leaveRequest.length}
                            </p>
                        )}
                    </h2>
                </div>


                <div className="divide-y divide-gray-200 gap-2 bg-stone-200 p-2  ">
                    <FilterSortPanel sort={sortDisplay} filter={filterDisplay} setIsFiltered={setIsFiltered} setViewAll={setViewAll} />
                    {displayLeaves && displayLeaves.length > 0 ? (
                        displayLeaves.map((request) => (
                            <div key={request.id} className="p-2 hover:bg-gray-100 hover:shadow-xl  bg-white rounded-xl mb-2">
                                {/* Request Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {request.username}
                                        </h3>
                                    </div>
                                    <p className="px-3 py-1 text-sm font-medium bg-yellow-100 text-yellow-800 rounded-full">
                                        Pending
                                    </p>
                                </div>

                                {/* Leave Details */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <div className="flex flex-col">
                                        <p className="text-sm text-gray-500 mb-1">From Date</p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {request.fromDate.split("T")[0]}
                                        </p>
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-sm text-gray-500 mb-1">To Date</p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {request.toDate.split("T")[0] }
                                        </p>
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-sm text-gray-500 mb-1">Total Days</p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {request.totalLeaves} {request.totalLeaves === 1 ? 'day' : 'days'}
                                        </p>
                                    </div>
                                </div>

                                {/* Reason */}
                                <div className="mb-4  ">
                                    <p className="text-sm text-gray-500 block mb">Reason for Leave</p>
                                    <p className="text-sm  text-gray-700 bg-gray-50 p-2 ">
                                        {request.reason || "No reason provided"}
                                    </p>
                                </div>

                                {/* Action Buttons or rejection comment form */}
                                {
                                    //either action buttons or deny request form will be shown based on the enter comment value and weather the particular request is selected
                                    // show dialog to enter comment if user clicks deny
                                    enterComment && selectedRequest == request.id ? <div className='flex flex-col justify-around items-center gap-2'>
                                        <h3>Enter the Reason for rejection below</h3>
                                        <input type="text" placeholder='enter comment ' value={comment} onChange={handleCommentChange}
                                            className='p-1 px-4 border-gray-300 bg-blue-200 rounded-2xl' />
                                        <div>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => cancelClick()}
                                                    className="px-4 py-2 bg-gray-400 text-black text-sm font-medium rounded-lg hover:bg-gray-300 "
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => handleDeny(request.id, request.username)}
                                                    disabled={load !== null}
                                                    className="px-4 py-1 bg-red-600 text-white text-sm font-medium rounded-lg transform transition-transform duration-200 hover:scale-105"
                                                >
                                                    {load == request.id && loadInside == "deny" ? <img className="w-8 h-8" src='/redLoader.gif' alt='Loader'></img> : "Deny Leave"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                        // display approve and deny button other wise
                                        :
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleApprove(request.id, request.username)}
                                                disabled={load !== null}
                                                className="px-4 py-1 bg-green-600 text-white text-sm font-medium rounded-lg transform transition-transform duration-200 hover:scale-105 "
                                            >
                                                {load == request.id && loadInside == "approve" ? <img className="w-8 h-8" src='/greenLoader.gif' alt='Loader'></img> : "Approve"}
                                            </button>
                                            <button
                                                onClick={() => denyClick(request.id)}
                                                className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700"
                                            >
                                                Deny
                                            </button>
                                        </div>
                                }
                            </div>
                        ))
                    ) : (
                        // in case  no requests are fetched from the server or no requests with pending status found
                        <div className="p-12 text-center">
                            <h3 className="text-lg font-medium text-gray-900 mb-1">
                                No pending requests
                            </h3>
                            <p className="text-gray-500">
                                All leave requests have been processed
                            </p>
                        </div>
                    )}
                </div>
                {/* View All Button */}
                {
                    leaveRequest && leaveRequest.length > 3 && <div className="flex justify-center py-4">
                        <button
                            onClick={() => handleViewAllClick()}
                            className="px-5 py-2.5 text-sm font-semibold text-blue-700 bg-blue-100 rounded-full 
                                         hover:bg-blue-200  shadow-sm"
                        >
                            {isFiltered ? "View All" : viewAll ? "show less" : "View all"}
                        </button>
                    </div>
                }

            </div>
        </div>
    )
}

export default LeavesDisplay