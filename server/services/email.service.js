import 'dotenv/config';
import nodemailer from 'nodemailer';

// create transforter
export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD
    }
});

// Verify email connection
try {
    await transporter.verify();
    console.log("SMTP is verifird: Ready to send emails");
} catch (err) {
    console.error("SMTP connection failed", err);
}
// define  email content
