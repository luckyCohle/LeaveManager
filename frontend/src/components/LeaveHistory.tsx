import { useEffect, useState } from 'react'
import {  type leaveArrayItem } from '../services/leave-requests'

interface propType {
    allLeaves: leaveArrayItem[],
    setAllLeaves: React.Dispatch<React.SetStateAction<leaveArrayItem[]>>
}

function LeavesHistory({ allLeaves }: propType) {
    //leave requests to be dispalyed on the screen
    const [displayLeaves, setDisplayLeaves] = useState<leaveArrayItem[]>();
    //view all and show less toggle
    const [viewAll, setViewAll] = useState<boolean>(false);
    useEffect(() => {
        setDisplayLeaves(allLeaves)
    }, [allLeaves])

    useEffect(() => {
        //show 3 or all requests based on the vlaue of viewAll state
        if (viewAll && allLeaves) {
            setDisplayLeaves(allLeaves)
        } else {
            setDisplayLeaves(allLeaves?.slice(0, 3))
        }

    }, [viewAll, allLeaves])

    //to get the styling for the status badge based on the status value
    function getStatusStyling(status: "requested" | "approved" | "denied") {
        if (status == "requested") {
            return "bg-yellow-100 text-yellow-800";
        } else if (status == "approved") {
            return "bg-green-100 text-green-800 "
        } else {
            return "bg-red-100 text-red-800 "
        }
    }


    return (
        <div className="max-w-4xl mx-auto">
            {/* Header Section */}
            <div className=" rounded-lg bg-white shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="mb-8">
                        <p className="text-orange-600 text-2xl">View Leave History</p>
                    </div>
                    <h2 className="text-xl mb-1 font-semibold text-gray-800">
                        ALL Requests
                        {allLeaves && allLeaves.length > 0 && (
                            <p className="ml-2 mt-2 w-10 px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                                {allLeaves.length}
                            </p>
                        )}
                    </h2>
                </div>

                <div className="divide-y divide-gray-200 gap-2 bg-stone-200 p-2  ">
                    {displayLeaves && displayLeaves.length > 0 ? (
                        displayLeaves.map((request) => (
                            <div key={request.id} className="p-2 hover:bg-gray-100 hover:shadow-xl  bg-white rounded-xl mb-2">
                                {/* LEave Request Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {request.username}
                                        </h3>
                                    </div>
                                    <p className={`px-3 py-1 text-sm font-medium ${getStatusStyling(request.status)}unded-full`}>
                                        {request.status}
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
                                            {request.toDate.split("T")[0]}
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
                                {/* Rejction comment  */}
                                {
                                    request.rejectionComment ? <div className='p-2 flex flex-col justify-around'>
                                        <p className='text-black font-bold'>Rejection Comment</p>
                                        <p className='text-black text-lg'>{request.rejectionComment}</p>
                                    </div> : ""
                                }
                            </div>
                        ))
                    ) : (//in case no history is found
                        <div className="p-12 text-center">
                            <h3 className="text-lg font-medium text-gray-900 mb-1">
                                No Leave History found
                            </h3>
                            <p className="text-gray-500">
                                either history has been cleared or no leave has been requested yet
                            </p>
                        </div>
                    )}
                </div>
                {/* View All Button */}
                {
                    allLeaves && allLeaves.length > 3 && <div className="flex justify-center py-4">
                        <button
                            onClick={() => setViewAll((prev) => !prev)}
                            className="px-5 py-2.5 text-sm font-semibold text-blue-700 bg-blue-100 rounded-full 
                                         hover:bg-blue-200  shadow-sm"
                        >
                            {viewAll ? "Show Less" : "View All"}
                        </button>
                    </div>
                }

            </div>
        </div>
    )
}

export default LeavesHistory