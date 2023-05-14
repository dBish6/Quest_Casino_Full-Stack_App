const { createTransport } = require("nodemailer");

const sendEmail = async (email, subject, message) => {
  const transporter = createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_ACCOUNT,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: '"Quest Casino - David Bishop; the Dev :D" <noreply.questcasino@gmail.com>',
    to: `${email}`,
    subject: subject,
    html: message,
  });

  return info;
};

module.exports = sendEmail;
