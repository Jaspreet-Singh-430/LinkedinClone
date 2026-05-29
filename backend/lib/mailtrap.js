import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";
const TOKEN = process.env.MAILTRAP_TOKEN;
dotenv.config();

export const client = new MailtrapClient({
  token: process.env.MAILTRAP_TOKEN,
});
export const sender = {
    email: process.env.EMAIL_FROM,
    name: process.env.EMAIL_FROM_NAME,
};
