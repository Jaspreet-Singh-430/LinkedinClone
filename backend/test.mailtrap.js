import {MailtrapClient} from 'mailtrap';
const client = new MailtrapClient({
    token: process.env.MAILTRAP_TOKEN
});
const sender={
    email:"demomailtrap.co",
    // email:"https://mailtrap.io/domains/4b2d1638-ac7f-4f05-93ee-fecdd1dd9dbc",
    name:"Mailtrap"
}
const receipients=[{
    email:"jaspreet9322@gmail.com",
    name:"jaspreet"
}]
client.send({
    from: sender,
    to: receipients,
    subject: "Hello from Mailtrap",
    text: "This is a test email sent from Mailtrap.",
    category:"test"
}).then(response => {
    console.log("Email sent successfully:", response);
}).catch(error => {
    console.error("Error sending email:", error);
});