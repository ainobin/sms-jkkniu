import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host : "smtp.gmail.com",
    port : 587,
    secure : false,
    auth : {
        user : process.env.EMAIL_ADDRESS,
        pass : process.env.EMAIL_PASSWORD
    }
});

export const sendEmail = async ({to, subject, text, html}) => {
    const mailOptions = {
        from : process.env.EMAIL_ADDRESS,
        to : to,
        subject : subject,
        text : text, // Plain text fallback
        html : html, // HTML content
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
    } catch (error) {
        console.error("Error sending email:", error);
    }
    return true;
}

