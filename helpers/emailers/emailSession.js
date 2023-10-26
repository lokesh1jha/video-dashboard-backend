const nodemailer = require('nodemailer');

exports.sendEmail = async (email, subject, html) => {
    try {
        // Create a transporter with your SMTP settings
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.adminEmail,
                pass: process.env.adminEmailPassword
            }
        });

        // Define the email options
        const mailOptions = {
            from: process.env.adminEmail,
            to: email,
            subject: subject,
            html: html
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);

        console.log('Email sent: ' + info.response);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};
