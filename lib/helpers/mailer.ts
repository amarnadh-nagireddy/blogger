import nodemailer from 'nodemailer';
import User from '@/lib/models/UserModel';
import bcryptjs from 'bcryptjs';
type EmailParams = {
  email: string;
  emailType: 'RESET' | 'VERIFY'; 
  userId: string;
};

export const sendEmail =async ({email, emailType,userId}:EmailParams)=>{
    try {
        console.log(userId);
        const hashedToken=await bcryptjs.hash(userId.toString(),10);
        if (emailType==="VERIFY") {
            await User.findByIdAndUpdate(userId,{
                verifyToken:hashedToken,
                verifyTokenExpiry:Date.now() + 600000
            })
        } else if(emailType==="RESET") {
            await User.findByIdAndUpdate(userId,{
                forgotPasswordToken:hashedToken,
                forgotPasswordTokenExpiry:Date.now() + 600000
            })
        }
        console.log("Test message");
        const transport = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_API_KEY
            }
        });
        const mailOptions={
            from:process.env.EMAIL_USER,
            to:email,
            subject: emailType ==="VERIFY" ? "Verification for Email" : "Reset Link For Password",
            html: `<p>CLick <a href="${process.env.domain}/auth/${emailType==="VERIFY" ? "verifyemail" : "resetpassword"}?token=${hashedToken}">here</a> to ${emailType==="VERIFY" ? "verify your email" :"Reset your password"}</p>`
            
        }
        const mailResponse = await transport.sendMail(mailOptions);
        return mailResponse;
    } catch (error: unknown) {
    if (error instanceof Error) {
        console.error("Email sending failed:", error.message);
        throw new Error("Sending mail issue");
    } else {
        throw new Error("Unknown error occurred while sending mail");
    }
}

}