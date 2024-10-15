import nodemailer from "nodemailer";
import { HttpError, handleHttpError } from "./handleError";

export default async function sendEmail(
  to: string,
  subject: string,
  html: string
) {
  try {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM } =
      process.env;

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      // secure: true,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD,
      },
      debug: true,
      logger: true,
    });

    transporter.verify((error: any) => {
      if (error)
        throw new HttpError("sendEmail verify SMTP error.", 500);
    });

    return await transporter.sendMail({
      from: `"David Bishop - the Dev :D" <${SMTP_FROM}>`,
      to,
      subject,
      html,
    });
  } catch (error: any) {
    throw handleHttpError(error, "sendEmail error.");
  }
}
