import { ArrowDown, ArrowUp, RefreshCw } from 'lucide-react'
import { useState } from 'react'
interface propType {
    filter: (startDate: string, endDate: string, days: string) => void,
    setIsFiltered: React.Dispatch<React.SetStateAction<boolean>>,
    setViewAll: React.Dispatch<React.SetStateAction<boolean>>,
    sort: (sortBy: "start" | "end" | "days" | "none", ascending: boolean) => void
}
function FilterSortPanel({ setViewAll, setIsFiltered, filter, sort }: propType) {
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [days, setDays] = useState<string>(""); // Keep as string for input
    const [sortby, setSortby] = useState<"start" | "end" | "days" | "none">("none")
    const [sortOrder, setSortOrder] = useState<"asc" | "dsc" | undefined>();
    function handleStartChange(e: any) {
        setStartDate(e.target.value);
    }
    function handleEndChange(e: any) {
        setEndDate(e.target.value);
    }
    function handleDaysChange(e: any) {
        setDays(e.target.value);
    }
    function handleSortChange(e: any) {
        setSortby(e.target.value)
    }
    function handleApplyFilter() {
        filter(startDate, endDate, days);
    }
    function handleApplySort() {
        console.log("apply sort clicked")
        sort(sortby, sortOrder == "dsc"?false:true);
    }
    function reset() {
        setStartDate("");
        setEndDate("");
        setDays("");
        setSortOrder(undefined);
        setSortby("none");
        setIsFiltered(false);
        setViewAll(true)
    }

    return (
        
        <div className=' flex flex-col justify-between px-4 py-2 rounded-2xl bg-gray-50 border-b border-gray-200 text-sm mb-3'>
            <div className="flex flex-row justify-between gap-2 mb-3  ">
            {/* Filter Section */}
            <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-gray-700">Filter:</span>
                <p className='text-xs'>start Date</p>
                <input
                    type="date"
                    className="border border-gray-300 rounded px-2 py-1 focus:ring-blue-500 focus:border-blue-500"
                    title="Start Date"
                    onChange={(e) => handleStartChange(e)}
                />
                <p className='text-xs'>end Date</p>
                <input
                    type="date"
                    className="border border-gray-300 rounded px-2 py-1 focus:ring-blue-500 focus:border-blue-500"
                    title="End Date"
                    onChange={(e) => handleEndChange(e)}
                />
                <input
                    type="number"
                    min={1}
                    placeholder="Days"
                    className="w-15 border border-gray-300 rounded px-2 py-1 focus:ring-blue-500 focus:border-blue-500"
                    title="No. of Days"
                    value={days}
                    onChange={(e) => handleDaysChange(e)}
                />

            </div>

            {/* Sort Section */}
            <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-gray-700">Sort By:</span>
                <select
                    name="sortby"
                    id="sort"
                    className="border border-gray-300 rounded px-2 py-1 focus:ring-blue-500 focus:border-blue-500"
                    onChange={(e) => handleSortChange(e)}
                    value={sortby}
                >
                    <option value="none">none</option>
                    <option value="start">Start</option>
                    <option value="end">End</option>
                    <option value="days">Days</option>
                </select>
                <button className={`px-2 py-1  hover:bg-gray-300 ${sortOrder == "asc" ? "bg-blue-200" : "bg-gray-200 rounded"}`}
                    onClick={() => setSortOrder("asc")}><ArrowUp className='h-4 w-4' /></button>
                <button className={`px-2 py-1  ${sortOrder == "dsc" ? "bg-blue-200" : "bg-gray-200 rounded"} hover:bg-gray-300`}
                    onClick={() => setSortOrder("dsc")}><ArrowDown className='h-4 w-4' /></button>
            </div>
        </div>
            <div className='flex flex-row gap-2 justify-arround w-full p-2'>
                <button className='bg-gray-200 hover:bg-gray-300 p-1' onClick={() => reset()} >< RefreshCw className='w-5 h-5' /></button>
                <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                    onClick={() => handleApplyFilter()}>
                    Apply filter
                </button>
                <button className="px-3 py-1 bg-blue-600 text-sm text-white rounded hover:bg-blue-700 transition"
                    onClick={() => handleApplySort()}>
                    Apply sort
                </button>
            </div>
        </div>

    )
}

export default FilterSortPanel