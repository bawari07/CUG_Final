import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
    },
    tls: {
        rejectUnauthorized: false,
    },
});

export const sendEmail = async (to, subject, text) => {
    try {
        // Ensure `to` is an array, even if it's a single email
        if (!Array.isArray(to)) {
            to = typeof to === 'string' ? [to] : [];
        }

        const mailOptions = {
            from: process.env.EMAIL_USER, 
            to: to.join(','), // Safely join the array into a comma-separated string
            subject,
            html: text, 
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.response);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error; 
    }
};
