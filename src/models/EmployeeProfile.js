const mongoose = require('mongoose');

const employeeProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fullName: { type: String, required: true },
    officialEmail: { type: String, required: true },
    designation: { type: String, required: true },
    department: { type: String, required: true },
    employeeId: { type: String, required: true, unique: true },
    joiningDate: { type: Date, required: true },
    reportingManager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('EmployeeProfile', employeeProfileSchema);
