const mongoose = require('mongoose');

const partnerProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    companyName: { type: String, required: true },
    contactPerson: { type: String, required: true },
    email: { type: String, required: true },
    partnershipType: { type: String, required: true }, // e.g., 'Reseller', 'Technology'
    region: { type: String, required: true },
    agreementStatus: { type: String, enum: ['Active', 'Pending', 'Expired'], default: 'Pending' },
}, { timestamps: true });

module.exports = mongoose.model('PartnerProfile', partnerProfileSchema);
