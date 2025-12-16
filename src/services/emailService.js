const nodemailer = require('nodemailer');

// Mock Transport for Local Dev if no env vars
const transporter = nodemailer.createTransport({
    service: 'gmail', // Or SMTP host
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendInviteEmail = async (to, role, username, password, loginUrl) => {
    if (!process.env.EMAIL_USER) {
        console.log("==================================================");
        console.log(" [MOCK EMAIL SERVICE] ");
        console.log(` TO: ${to}`);
        console.log(` ROLE: ${role}`);
        console.log(` USERNAME: ${username}`);
        console.log(` PASSWORD: ${password}`);
        console.log(` LINK: ${loginUrl}`);
        console.log("==================================================");
        return true;
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: `Welcome to Assuvar OS - Your ${role} Credentials`,
        html: `
            <h3>Welcome to Assuvar OS</h3>
            <p>You have been invited to join the platform as a <strong>${role}</strong>.</p>
            <p><strong>Login URL:</strong> <a href="${loginUrl}">${loginUrl}</a></p>
            <p><strong>Username:</strong> ${username}</p>
            <p><strong>Temporary Password:</strong> ${password}</p>
            <hr />
            <p>Please log in and change your password immediately.</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Invite email sent to ${to}`);
        return true;
    } catch (error) {
        console.error("Email send failed:", error);
        return false;
    }
};

module.exports = { sendInviteEmail };
