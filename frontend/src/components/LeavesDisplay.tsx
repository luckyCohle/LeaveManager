import { useEffect, useState } from 'react'
import { getLeaveRequests, type leaveArrayItem } from '../services/leave-requests'
import { approveOrDenyLeave } from '../services/leave';
import type { approveLeaveType } from '../utils/leave-type';
import FilterSortPanel from './FilterSortPanel';

interface propType {
    allLeaves?: leaveArrayItem[],
    setAllLeaves: React.Dispatch<React.SetStateAction<leaveArrayItem[]>>,
    refresh: number,
    setRefresh: React.Dispatch<React.SetStateAction<number>>,
    displayNotification: (message: string, type: "success" | "faliure") => void
}
function LeavesDisplay({ setAllLeaves, refresh, setRefresh, displayNotification }: propType) {

    const [displayLeaves, setDisplayLeaves] = useState<leaveArrayItem[]>();
    const [viewAll, setViewAll] = useState<boolean>(false);
    const [leaveRequest, setLeaveRequests] = useState<leaveArrayItem[]>();
    const [enterComment, setEnterComment] = useState<boolean>(false);
    const [selectedRequest, setSelectedRequest] = useState<string | null>("");
    const [comment, setComment] = useState<string>("");
    const [load, setLoad] = useState<string | null>(null);
    const [loadInside, setLoadInside] = useState<"approve" | "deny" | null>(null);
    const [isFiltered, setIsFiltered] = useState<boolean>(false);
    useEffect(() => {
        const leaves = getLeaveRequests();
        setAllLeaves(leaves);
        const requests = leaves.filter((leave) => leave.status === "requested");
        setLeaveRequests(requests);

    }, [refresh])

    useEffect(() => {

        if (viewAll && leaveRequest) {
            setDisplayLeaves(leaveRequest)
        } else {
            setDisplayLeaves(leaveRequest?.slice(0, 3))
        }

    }, [viewAll, leaveRequest])

    function handleViewAllClick() {

        if (isFiltered) {
            setViewAll(true);
        } else {
            setViewAll((prev) => !prev);
        }
        setIsFiltered(false);
    }

    function handleLoading(id: string, button: "approve" | "deny") {
        return new Promise<void>((resolve) => {
            setLoad(id);
            setLoadInside(button);
            setTimeout(() => {
                setLoad(null);
                setLoadInside(null);
                resolve();
            }, 2000);
        });
    }

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
    const handleApprove = async (id: string, username: string) => {
        console.log(`Approved leave request: ${id}`);
        const approveLeaveBody: approveLeaveType = {
            approvedOn: new Date().toISOString().split('T')[0],
            isApproved: true,
            staffName: username,
            requestId: id
        }

        approveOrDenyLeave(approveLeaveBody);
        await handleLoading(id, 'approve');
        displayNotification("Leave Approved", "success")
        setRefresh((prev) => prev + 1);
    }

    const handleDeny = async (id: string, username: string) => {
        console.log(`Denied leave request: ${id} with comment: ${comment}`);
        const denyLeaveBody: approveLeaveType = {
            requestId: id,
            staffName: username,
            isApproved: false,
            rejectionComment: comment,
            approvedOn: new Date().toISOString().split('T')[0],
        };

        approveOrDenyLeave(denyLeaveBody);
        await handleLoading(id, "deny");
        setComment("");
        setEnterComment(false);
        setSelectedRequest(null);
        displayNotification("Leave Denied", "faliure")
        setRefresh((prev) => prev + 1);
    };

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

    function sortDisplay(sortBy: "start" | "end" | "days" | "none", ascending: boolean) {
        if (!leaveRequest) return
        let sortedLeaves = [...leaveRequest];
        console.log(sortBy+" "+ascending);
        switch (sortBy) {
            case "start":
                sortedLeaves.sort((a, b) => {
                    const dateA = new Date(a.fromDate).getTime();
                    const dateB = new Date(b.fromDate).getTime();
                    // console.log("in start");
                    return ascending ? dateA - dateB : dateB - dateA;
                });
                break;

            case "end":
                sortedLeaves.sort((a, b) => {
                    const dateA = new Date(a.toDate).getTime();
                    const dateB = new Date(b.toDate).getTime();
                    // console.log("in end")
                    return ascending ? dateA - dateB : dateB - dateA;
                });
                break;

            case "days":
                sortedLeaves.sort((a, b) => {
                    // console.log("in days")
                    return ascending ? a.totalLeaves - b.totalLeaves : b.totalLeaves - a.totalLeaves;
                });
                break;

            case "none":
            default:
                console.log("here");
                sortedLeaves=[...leaveRequest]
                break;
        }
        console.log(sortedLeaves)
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
                                            {request.fromDate}
                                        </p>
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-sm text-gray-500 mb-1">To Date</p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {request.toDate}
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
                {/* Centered View All Button */}
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