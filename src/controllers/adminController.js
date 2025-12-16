const User = require('../models/User');
const ClientProfile = require('../models/ClientProfile');
const EmployeeProfile = require('../models/EmployeeProfile');
const PartnerProfile = require('../models/PartnerProfile');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { sendInviteEmail } = require('../services/emailService');

// Helper: Generate Secure Password
const generatePassword = (length = 12) => {
    return crypto.randomBytes(length).toString('hex').slice(0, length) + 'A1!'; // Ensure complexity
};

// Helper: Generate Username
const generateUsername = (name) => {
    return name.toLowerCase().replace(/\s+/g, '.') + '.' + Math.floor(1000 + Math.random() * 9000);
};

exports.inviteUser = async (req, res) => {
    try {
        const { role, ...profileData } = req.body;

        // 1. Basic Validation
        if (!['client', 'employee', 'partner'].includes(role)) {
            return res.status(400).json({ message: "Invalid role specified." });
        }

        // 2. Check for existing email in User table
        const email = profileData.email || profileData.officialEmail;
        if (!email) return res.status(400).json({ message: "Email is required." });

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User with this email already exists." });

        // 3. Generate Credentials
        const password = generatePassword();
        const username = generateUsername(profileData.name || profileData.fullName || profileData.contactPerson || 'user');
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Create Base User
        const newUser = new User({
            name: profileData.name || profileData.fullName || profileData.contactPerson, // Fallback name mapping
            username,
            email,
            password: hashedPassword,
            role,
            status: 'invited',
            isFirstLogin: true,
            roleProfileModel: role.charAt(0).toUpperCase() + role.slice(1) + 'Profile', // e.g. ClientProfile
        });

        const savedUser = await newUser.save();

        // 5. Create Profile
        let profile;
        if (role === 'client') {
            profile = new ClientProfile({ ...profileData, userId: savedUser._id });
        } else if (role === 'employee') {
            profile = new EmployeeProfile({ ...profileData, userId: savedUser._id });
        } else if (role === 'partner') {
            profile = new PartnerProfile({ ...profileData, userId: savedUser._id });
        }

        const savedProfile = await profile.save();

        // Link profile back to user
        savedUser.profileId = savedProfile._id;
        await savedUser.save();

        // 6. Send Email
        const loginUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login/${role}`;
        await sendInviteEmail(email, role, username, password, loginUrl);

        res.status(201).json({
            message: `Invite sent successfully to ${email}`,
            user: { id: savedUser._id, username, role, status: savedUser.status }
        });

    } catch (error) {
        console.error("Invite Error:", error);
        res.status(500).json({ message: "Failed to invite user.", error: error.message });
    }
};
