const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/user');
const bcrypt = require('bcrypt');
dotenv.config();
 const Users= [
  {
    username: "john.doe",
    password: "Pass@123",
    role: "Staff",
    leavesBalance: { casual: 5, sick: 4, earned: 8 },
    leaveHistory: [
      {
        id: "LV001",
        category: "casual",
        status: "requested",
        requestedOn: "2025-12-02",
        fromDate: "2025-12-05",
        toDate: "2025-12-06",
        totalLeaves: 2,
        reason: "Family work"
      },
      {
        id: "LV005",
        category: "sick",
        status: "requested",
        requestedOn: "2025-12-10",
        fromDate: "2025-12-12",
        toDate: "2025-12-13",
        totalLeaves: 2,
        reason: "Fever"
      },
    ]
  },
  {
    username: "emma.smith",
    password: "Test@321",
    role: "Admin",
    leavesBalance: { casual: 7, sick: 5, earned: 10 },
    leaveHistory: [
      {
        id: "LV006",
        category: "earned",
        status: "requested",
        requestedOn: "2025-12-01",
        fromDate: "2025-12-03",
        toDate: "2025-12-05",
        totalLeaves: 3,
        reason: "Personal work"
      }
    ]
  },
  {
    username: "michael.brown",
    password: "Qwerty!45",
    role: "Staff",
    leavesBalance: { casual: 3, sick: 2, earned: 6 },
    leaveHistory: [
      {
        id: "LV007",
        category: "sick",
        status: "approved",
        requestedOn: "2025-12-04",
        fromDate: "2025-12-06",
        toDate: "2025-12-07",
        totalLeaves: 2,
        reason: "Migraine"
      },
      {
        id: "LV008",
        category: "casual",
        status: "requested",
        requestedOn: "2025-12-08",
        fromDate: "2025-12-09",
        toDate: "2025-12-09",
        totalLeaves: 1,
        reason: "Errand"
      }
    ]
  },
  {
    username: "sophia.white",
    password: "Hello#123",
    role: "Staff",
    leavesBalance: { casual: 6, sick: 6, earned: 11 },
    leaveHistory: [
      {
        id: "LV009",
        category: "casual",
        status: "requested",
        requestedOn: "2025-12-05",
        fromDate: "2025-12-07",
        toDate: "2025-12-07",
        totalLeaves: 1,
        reason: "Shopping"
      }
    ]
  },
  {
    username: "david.jones",
    password: "Dav@2025",
    role: "Staff",
    leavesBalance: { casual: 4, sick: 5, earned: 9 },
    leaveHistory: [
      {
        id: "LV010",
        category: "earned",
        status: "requested",
        requestedOn: "2025-12-06",
        fromDate: "2025-12-08",
        toDate: "2025-12-09",
        totalLeaves: 2,
        reason: "Vacation"
      }
    ]
  },
  {
    username: "olivia.miller",
    password: "Liv!4321",
    role: "Admin",
    leavesBalance: { casual: 5, sick: 4, earned: 7 },
    leaveHistory: [
      {
        id: "LV011",
        category: "sick",
        status: "requested",
        requestedOn: "2025-12-07",
        fromDate: "2025-12-08",
        toDate: "2025-12-08",
        totalLeaves: 1,
        reason: "Cold"
      }
    ]
  },
  {
    username: "liam.davis",
    password: "Alpha@001",
    role: "Staff",
    leavesBalance: { casual: 8, sick: 7, earned: 14 },
    leaveHistory: [
      {
        id: "LV012",
        category: "casual",
        status: "requested",
        requestedOn: "2025-12-08",
        fromDate: "2025-12-10",
        toDate: "2025-12-11",
        totalLeaves: 2,
        reason: "Personal errands"
      }
    ]
  },
  {
    username: "ava.wilson",
    password: "Secure*987",
    role: "Staff",
    leavesBalance: { casual: 2, sick: 3, earned: 5 },
    leaveHistory: [
      {
        id: "LV013",
        category: "sick",
        status: "requested",
        requestedOn: "2025-12-09",
        fromDate: "2025-12-10",
        toDate: "2025-12-11",
        totalLeaves: 2,
        reason: "Flu"
      }
    ]
  },
  {
    username: "noah.moore",
    password: "Pass@789",
    role: "Staff",
    leavesBalance: { casual: 1, sick: 4, earned: 6 },
    leaveHistory: [
      {
        id: "LV014",
        category: "sick",
        status: "requested",
        requestedOn: "2025-12-01",
        fromDate: "2025-12-02",
        toDate: "2025-12-03",
        totalLeaves: 2,
        reason: "Cold"
      }
    ]
  },
  {
    username: "mia.taylor",
    password: "Mia#009",
    role: "Staff",
    leavesBalance: { casual: 9, sick: 5, earned: 12 },
    leaveHistory: [
      {
        id: "LV015",
        category: "casual",
        status: "requested",
        requestedOn: "2025-12-03",
        fromDate: "2025-12-05",
        toDate: "2025-12-06",
        totalLeaves: 2,
        reason: "Family function"
      }
    ]
  }
];

async function prepareData() {
  console.log("Hashing passwords...");
  const hashedUsers = await Promise.all(
    Users.map(async (user) => ({
      ...user,
      password: await bcrypt.hash(user.password, 12),
    }))
  );
  console.log("✅ All passwords hashed.");
  return hashedUsers;
}

// ✅ Seed function
async function seedUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    //  clear old data if any
    await User.deleteMany({});
    console.log('Old data removed');

    // Prepare data
    const preparedUsers = await prepareData();

    // Insert into DB
    await User.insertMany(preparedUsers);
    console.log(` Inserted ${preparedUsers.length} users successfully!`);

  } catch (err) {
    console.error(' Error inserting users:', err);
  }
}
seedUsers();