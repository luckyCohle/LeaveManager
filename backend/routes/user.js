const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();
//signup
router.post('/signup', async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ message: "Username, password, and role are required" });
  }

  if (role !== 'Admin' && role !== 'Staff') {
    return res.status(400).json({ message: "Role must be either Admin or Staff" });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPwd = await bcrypt.hash(password, 10);

    // create user
    const newUser = await User.create({
      username,
      password: hashedPwd,
      role,
      leavesBalance: { casual: 0, sick: 0, earned: 0 },
      leaveHistory: []
    });

    // genarate jwt token
    const token = jwt.sign(
      { id: newUser._id, username: newUser.username, role: newUser.role },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '1h' }
    );

    return res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        userId: newUser._id,
        username:newUser.username,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//login 
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required"
    });
  }

  try {
    const userData = await User.findOne({ username });

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: userData._id, username: userData.username, role: userData.role },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '1h' }
    );

    return res.json({
      message: "Login successful",
      token,
      user: {
        username: userData.username,
        userId:userData._id,
        role: userData.role
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error"
    });
  }
});

//route to getAllUsers

router.get('/getAllUsers',async (req,res)=>{
    try {
        const allUsers = await User.find({},"-password");
        res.status(200).json({
            allUsers,
            message:"data retrieved successfully"
        })
    } catch (error) {
        res.status(500).json({
            msg:"error while fetching data",
        })
    }
})

//get data of specific user

router.get('/data/:userId',async (req,res)=>{
    const userId = req.params.userId;
    console.log("user data req recived")
    try {
        const user = await User.findById(userId).select('-password');
        if(!user){
            res.status(404).json({
                message:"user not found"
            })
        }
        res.status(200).json({
            userData:user         
        })
    } catch (error) {
      console.log(error);
        res.status(500).json({
            message:"error while retreiving data",
        })
    }
})

//get all the leave requests by a specific users

router.get('/leaves/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const userData = await User.findById(userId);

        if (!userData) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        res.status(200).json({
            leaveRequests: userData.leaveHistory,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error while retrieving data",
        });
    }
});

module.exports = router;