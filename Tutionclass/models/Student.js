const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true, unique: true, sparse: true },
    phone: { type: String, trim: true },
    className: { type: String, trim: true },     // e.g., "Grade 10 - A"
    rollNo: { type: String, trim: true },
    feesPaid: { type: Boolean, default: false },
    dob: { type: Date },
    address: { type: String, trim: true },
    guardianName: { type: String, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", StudentSchema);
