const mongoose = require('mongoose');
const leaveHistorySchema = require('./leaveHistory');
const { Schema } = mongoose;

const leavesBalanceSchema = new Schema({
  casual: { type: Number, default: 0 },
  sick: { type: Number, default: 0 },
  earned: { type: Number, default: 0 }
}, { _id: false });

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['Admin', 'Staff'], 
    required: true 
  },
  leavesBalance: { type: leavesBalanceSchema, required: true },
  leaveHistory: [leaveHistorySchema]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
