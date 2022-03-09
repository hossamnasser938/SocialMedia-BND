import nodemailer from "nodemailer";

let transporter;

export const sendEmail = async (
  subject,
  text,
  toEmail,
  fromEmail = process.env.DEFAULT_FROM_EMAIL
) => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.DEFAULT_FROM_EMAIL,
        pass: process.env.DEFAULT_FROM_EMAIL_PASSWORD,
      },
    });
  }

  const emailOptions = {
    from: fromEmail,
    to: toEmail,
    subject,
    text,
  };

  const info = await transporter.sendMail(emailOptions);
  console.log("email info", info);
  if (!info.messageId) throw new Error("No message id found");
};
