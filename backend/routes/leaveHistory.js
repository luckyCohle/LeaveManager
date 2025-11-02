const leaveHistory = require('../models/leaveHistory');
const User = require('../models/user');
const express = require('express');

const router = express.Router();
//route to get all the requests
router.get('/getAllRequests', async (req, res) => {
  console.log("getall leaves requsts recived")
  try {
    const users = await User.find({}, 'username leaveHistory');
    const allRequests = users.flatMap(user =>
      user.leaveHistory.map(lr => ({ ...lr.toObject(), username: user.username }))
    );

    res.status(200).json({
      status: 200,
      data: allRequests
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 500,
      message: 'Internal server error'
    });
  }
});

// leave request
router.post('/create', async (req, res) => {
  const { userId, leaveRequest } = req.body;

  if (!userId || !leaveRequest) {
    return res.status(400).json({ message: 'Username and leaveRequest are required' });
  }
   const { category, totalLeaves } = leaveRequest;
  if (!['casual', 'sick', 'earned'].includes(category)) {
    return res.status(400).json({ message: 'Invalid leave category' });
  }



  try {
    const user = await User.findById(userId);


    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    //  Check available balance
    const currentBalance = user.leavesBalance[category];
    if (totalLeaves > currentBalance) {
      return res.status(400).json({
        message: `Insufficient ${category} leave balance. Available: ${currentBalance}, Requested: ${totalLeaves}`
      });
    }

    // Add the new leave request
    user.leaveHistory.push(leaveRequest);
    await user.save();

    res.status(201).json({
      status: 201,
      message: 'Leave request created successfully',
      data: leaveRequest
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 500,
      message: 'Internal server error'
    });
  }
});

// Approve or Deny a leave request
router.post("/approveOrDeny", async (req, res) => {
  try {
    const {
      approvedBy,
      approvedOn,
      isApproved,
      rejectionComment,
      staffName,
      requestId,
    } = req.body;

    //  Validation
    if (!staffName || !requestId || !approvedOn || typeof isApproved !== "boolean") {
      return res.status(400).json({ message: "Missing required fields" });
    }

    //  Find the user who owns this leave request
    const user = await User.findOne({ username: staffName });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //  Find the specific leave request
    const leaveIndex = user.leaveHistory.findIndex((l) => l.id === requestId);
    if (leaveIndex === -1) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    const leave = user.leaveHistory[leaveIndex];

    //  Update leave request status
    leave.status = isApproved ? "approved" : "rejected";
    leave.reviewedBy = approvedBy || "Admin";
    leave.decisionDate = approvedOn;

    if (!isApproved && rejectionComment) {
      leave.rejectionComment = rejectionComment;
    }

    //  If approved → deduct leave balance
    if (isApproved) {
      const category = leave.category; // 'casual', 'sick', or 'earned'
      const total = leave.totalLeaves;

      if (user.leavesBalance[category] !== undefined) {
        // Ensure it doesn’t go below 0
        user.leavesBalance[category] = Math.max(
          user.leavesBalance[category] - total,
          0
        );
      }
    }

    //  Save changes
    await user.save();

    res.status(200).json({
      message: `Leave ${isApproved ? "approved" : "rejected"} successfully`,
      updatedLeave: leave,
      updatedBalance: user.leavesBalance,
    });
  } catch (error) {
    console.error("Error updating leave:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = router;