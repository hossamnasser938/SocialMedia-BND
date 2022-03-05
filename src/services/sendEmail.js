import nodemailer from "nodemailer";

const DEFAULT_FROM_EMAIL = "hos.dev.938@gmail.com";
const DEFAULT_FROM_EMAIL_PASSWORD = "Hossam.dev.938";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: DEFAULT_FROM_EMAIL,
    pass: DEFAULT_FROM_EMAIL_PASSWORD,
  },
});

export const sendEmail = async (
  subject,
  text,
  toEmail,
  fromEmail = DEFAULT_FROM_EMAIL
) => {
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
