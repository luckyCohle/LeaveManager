import { useEffect, useState } from 'react';
import type { userDataType } from '../utils/user-type';
import { getUsers } from '../services/user';

function UsersDisplay() {
    const [users, setUsers] = useState<userDataType[]>();
    const [viewAll, setViewAll] = useState<boolean>(false);
    const [displayUsers, setDisplayUsers] = useState<userDataType[]>();
    

    async function getData() {
        const fetchedUsers:userDataType[] = await getUsers()||[];
        setUsers(fetchedUsers);
        setDisplayUsers(fetchedUsers?.slice(0, 3));
    }
    useEffect(() => {
        getData();
    }, [])

    useEffect(() => {
        if (users) {
            if (viewAll) {
                setDisplayUsers(users);
            } else {
                setDisplayUsers(users.slice(0, 3));
            }
        }
    }, [viewAll, users])

    const getTotalLeaves = (user: userDataType) => {
        return user.leavesBalance.casual + user.leavesBalance.sick + user.leavesBalance.earned;
    }

    return (
        <div className="max-w-4xl mx-auto">

            {/* Summary Card */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="mb-8">
                <p className="text-yellow-600 text-2xl">View employee stats and leave balances</p>
            </div>
                        <p className="text-gray-800  text-xl font-medium mb-2">Total Employees</p>
                        <h2 className=" p-2 w-8 items-center text-sm font-bold text-blue-800 bg-blue-200 rounded-full">{users?.length || 0}</h2>
                    </div>
                </div>
            </div>

            {/* Employees List */}
            <div className="rounded-lg bg-white shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Employee Leave Balances
                    </h2>
                </div>

                <div className="divide-y divide-gray-200 gap-2 bg-stone-200 p-2">
                    {displayUsers && displayUsers.length > 0 ? (
                        displayUsers.map((user) => (
                            <div key={user.username} className="p-4 hover:bg-gray-50 bg-white rounded-xl mb-2 shadow-sm transition-all hover:shadow-md">
                                {/* User Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10  bg-blue-400 rounded-full flex items-center justify-center">
                                            <p className="text-white font-semibold text-lg">
                                                {user.username.charAt(0).toUpperCase()}
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {user.username}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500 mb-1">Total Balance</p>
                                        <div className="text-2xl font-bold text-blue-600">
                                            {getTotalLeaves(user)} <p className="text-sm font-normal text-gray-500">days</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Leave Balance Details */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                        <div className="flex items-center gap-2 mb-2">
                                            
                                            <p className="text-sm font-medium text-green-900">Casual Leave</p>
                                        </div>
                                        <div className="text-2xl font-bold text-green-700">
                                            {user.leavesBalance.casual} <p className="text-sm font-normal text-green-600">days</p>
                                        </div>
                                    </div>

                                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                        <div className="flex items-center gap-2 mb-2">
                                            <p className="text-sm font-medium text-red-900">Sick Leave</p>
                                        </div>
                                        <div className="text-2xl font-bold text-red-700">
                                            {user.leavesBalance.sick} <p className="text-sm font-normal text-red-600">days</p>
                                        </div>
                                    </div>

                                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                                        <div className="flex items-center gap-2 mb-2">
                                           
                                            <p className="text-sm font-medium text-purple-900">Earned Leave</p>
                                        </div>
                                        <div className="text-2xl font-bold text-purple-700">
                                            {user.leavesBalance.earned} <p className="text-sm font-normal text-purple-600">days</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-12 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">
                                No employees found
                            </h3>
                            <p className="text-gray-500">
                                There are no employees in the system
                            </p>
                        </div>
                    )}
                </div>

                {/* Centered View All Button */}
                {users && users.length > 3 && (
                    <div className="flex justify-center py-4">
                        <button
                            onClick={() => setViewAll((prev) => !prev)}
                            className="px-5 py-2.5 text-sm font-semibold text-blue-700 bg-blue-100 rounded-full 
                                     hover:bg-blue-200 shadow-sm transition-colors"
                        >
                            {viewAll ? "Show Less" : "View All Employees"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default UsersDisplay