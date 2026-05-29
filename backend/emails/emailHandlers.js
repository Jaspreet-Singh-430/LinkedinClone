import { createComment } from "../controllers/postControllers.js";
import { client,sender } from "../lib/mailtrap.js";
import { createWelcomeEmailTemplate,createConnectionAcceptedEmailTemplate,createCommentNotificationEmailTemplate } from "./emailTemplates.js";
export const sendWelcomeEmail = async (toEmail, toName, profileUrl) => {
    const recipient=[{email:toEmail}]
    try {
        const response=await client.send({
            from: sender,
            to: recipient,
            subject: "Welcome to LinkedIn Clone!",
            // text: `Hi ${toName},\n\nWelcome to LinkedIn Clone! We're excited to have you on board. You can view your profile here: ${profileUrl}\n\nBest regards,\nLinkedIn Clone Team`,
            html:createWelcomeEmailTemplate(toName, profileUrl),
            category:"welcome-email"
        });
        console.log("Welcome email sent successfully "+response);
    }
    catch(err){
        console.error("Error sending welcome email:", err);
    }
}
export const sendCommentNotificationEmail=async(toEmail, toName, commenterName, postUrl, commentContent)=>{
    const recipient=[{email:toEmail}]
    try {
        const response=await client.send({
            from: sender,
            to: recipient,
            subject: `${commenterName} commented on your post`,
            html:createCommentNotificationEmailTemplate(toName, commenterName, postUrl, commentContent),
            category:"comment-notification"
        });
        console.log("Comment notification email sent successfully "+response);
    }
    catch(err){
        console.error("Error sending comment notification email:", err);
    }
}
export const sendConnectionAcceptedEmail=async(toEmail, senderName, recipientName, profileUrl)=>{
    const recipient=[{email:toEmail}]
    try {
        const response=await client.send({
            from: sender,
            to: recipient,
            subject: `${recipientName} accepted your connection request`,
            html:createConnectionAcceptedEmailTemplate(senderName, recipientName, profileUrl),
            category:"connection-accepted-notification"
        });
        console.log("Connection accepted email sent successfully "+response);
    }
    catch(err){
        console.error("Error sending connection accepted email:", err);
    }
}