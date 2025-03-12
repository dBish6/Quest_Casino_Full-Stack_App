import type DeepReadonly from "@qc/typescript/typings/DeepReadonly";

import { readFileSync } from "fs";
import { join } from "path";
import nodemailer from "nodemailer";

import SRC_DIRECTORY from "@constants/SRC_DIRECTORY";

import { HttpError, handleHttpError } from "@utils/handleError";

interface EmailTemplate {
  auth: {
    verify: { title: string; path: string };
    forgotPassword: { title: string; path: string };
    confirmPassword: { title: string; path: string };
    passwordResetSuccess: { title: string; path: string };
  };
}

const { NODE_ENV, CLIENT_BASE_URL, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM } = process.env;

const TITLE_PREFIX = "Quest Casino |",
  TEMPLATE: DeepReadonly<EmailTemplate> = {
    auth: {
      verify: {
        title: `${TITLE_PREFIX} Profile Verification`,
        path: "/features/auth/http/emails/templates/verifyEmail"
      },
      confirmPassword: {
        title: `${TITLE_PREFIX} Confirm Password Reset`,
        path: "/features/auth/http/emails/templates/confirmPassword"
      },
      forgotPassword: {
        title: `${TITLE_PREFIX} Forgot Password`,
        path: "/features/auth/http/emails/templates/forgotPassword"
      },
      passwordResetSuccess: {
        title: `${TITLE_PREFIX} Password Reset Successfully`,
        path: "/features/auth/http/emails/templates/passwordResetSuccess"
      }
    }
  };

export function formatEmailTemplate(
  type: keyof EmailTemplate["auth"],
  link?: { token: string }
) {
  const templateDirPath = join(SRC_DIRECTORY, TEMPLATE.auth[type].path);
  let html = readFileSync(join(SRC_DIRECTORY, TEMPLATE.auth[type].path, "index.html"), "utf-8");

  if (link) {
    html = html.replace(/<!--url-->/g, CLIENT_BASE_URL!).replace("<!--token-->", link.token);
  } else if (Object.keys(TEMPLATE.auth).includes(type)) {
    new HttpError("The link parameter must be included with this type of email.");
  }

  Object.entries({
    "<!--head-->": readFileSync(join(SRC_DIRECTORY, "/emails/partials/head.html"), "utf-8"),
    "<!--footer-->": readFileSync(join(SRC_DIRECTORY, "/emails/partials/footer.html"), "utf-8"),
  }).forEach(([outlet, value]) => 
    html = html.replace(outlet, value).replace(/<!--url-->/g, CLIENT_BASE_URL!)
  );

  html = html
    .replace(
      "<!--styles-->",
      `<style>${`${readFileSync(join(SRC_DIRECTORY, "/emails/index.css"))}\n${readFileSync(join(templateDirPath, "styles.css"))}`}</style>`
    )
    .replace("<!--title-->", TEMPLATE.auth[type].title);

  return html;
}

export async function sendEmail(to: string, html: string) {
  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD
      },
      debug: NODE_ENV === "development",
      logger: true
    });

    transporter.verify((error: any) => {
      if (error)
        throw new HttpError(
          "There was an issue connecting to our email SMTP server.",
          500,
          "sendEmail verify SMTP error."
        );
    });

    const info = await transporter.sendMail({
      from: `"David Bishop - the Dev :D" <${SMTP_FROM}>`,
      to,
      subject: html.match(/<title>(.*?)<\/title>/)![1],
      html
    });
    if (info.rejected.length)
      throw new HttpError(
        "Your email was rejected by our SMTP server during sending. Please consider using a different email address. If the issue persists, feel free to reach out to support.",
        541
      );

    return info;
  } catch (error: any) {
    throw handleHttpError(error, "sendEmail error.");
  }
}

