const mongoose = require('mongoose');

const { Schema } = mongoose;


const leaveHistorySchema = new Schema({
  id: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['casual', 'sick', 'earned'], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['requested', 'approved', 'rejected'], 
    required: true 
  },
  requestedOn: { type: Date, required: true },
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  totalLeaves: { type: Number, required: true },
  reason: { type: String },
  rejectionComment:{type:String}
});

module.exports = leaveHistorySchema;