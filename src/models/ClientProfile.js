const mongoose = require('mongoose');

const clientProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    companyName: { type: String, required: true },
    contactPerson: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    industry: { type: String },
    address: { type: String },
    // Client specific fields
    contractStartDate: { type: Date },
    contractEndDate: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('ClientProfile', clientProfileSchema);
