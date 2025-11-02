import { useState } from "react";
import { toast } from "react-toastify";

interface ApplyLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (fromDate: string, toDate: string, reason: string, category: "casual" | "sick" | "earned") => void;
}

export default function ApplyLeaveModal({ isOpen, onClose, onSubmit }: ApplyLeaveModalProps) {
  //form fields of application form
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  const [category, setCategory] = useState<"casual" | "sick" | "earned">("casual");

  if (!isOpen) return null;
  const handleSubmit = () => {
    if (!fromDate || !toDate) {
      toast.error("Please select From and To dates");
      return;
    }
    onSubmit(fromDate, toDate, reason, category);
    //empty all feilds
    setFromDate("");
    setToDate("");
    setReason("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md animate-fadeIn">

        <h2 className="text-xl font-bold mb-4 text-gray-800">Apply for Leave</h2>

        {/* Date Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-gray-600 text-sm mb-1">From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-600 text-sm mb-1">To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Reason */}
          <div>
            <label className="block text-gray-600 text-sm mb-1">Reason</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 h-24 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter reason (optional)"
            />
          </div>
        </div>
        {/* Category */}
        <div>
          <label className="block text-gray-600 text-sm mb-1">Leave Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as "casual" | "sick" | "earned")}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
          >
            <option value="casual">Casual</option>
            <option value="sick">Sick</option>
            <option value="earned">Earned</option>
          </select>
        </div>


        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 active:scale-95 transition"
          >
            Submit
          </button>
        </div>

      </div>
    </div>
  );
}
