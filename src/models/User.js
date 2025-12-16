const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        unique: true,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true, // Hashed
    },
    role: {
        type: String,
        enum: ['admin', 'employee', 'client', 'partner'],
        required: true,
    },
    status: {
        type: String,
        enum: ['invited', 'active', 'suspended'],
        default: 'invited',
    },
    isFirstLogin: {
        type: Boolean,
        default: true,
    },
    profileId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'roleProfileModel', // Dynamic ref based on role
    },
    roleProfileModel: {
        type: String,
        enum: ['ClientProfile', 'EmployeeProfile', 'PartnerProfile', 'AdminProfile'],
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', userSchema);
