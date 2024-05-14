import nodemailer from "nodemailer";
import { createApiError } from "./CustomError";

export default async function sendEmail(
  to: string,
  subject: string,
  emailHtml: string
) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM } =
    process.env;

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: true,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
    debug: true,
    logger: true,
  });

  transporter.verify((error: any) => {
    if (error) {
      const errorMsg = "sendEmail verification error:\n" + error.message;
      console.error(errorMsg);
      throw createApiError("sendEmail verification error.", errorMsg, 500);
    }
  });

  return await transporter.sendMail({
    from: `"David Bishop - the Dev :D" <${SMTP_FROM}>`,
    to: to,
    subject: subject,
    html: emailHtml,
  });
}
