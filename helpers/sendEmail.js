import nodemailer from 'nodemailer';
import 'dotenv/config';
import mail from '@sendgrid/mail';


const { SENDGRID_API_KEY, NODE_ENV } = process.env;

const isTest = NODE_ENV === 'test';

mail.setApiKey(SENDGRID_API_KEY);

export const nodeSendEmail = async (email, subject, template) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject,
    text: 'Nisisi E-commerce',
    html: template
  });
};

const sendEmail = async ({
  email,
  subject,
  text,
  html
}) => {
  const defaultMsg = {
    to: email,
    from: 'Support Team <noreply@nisisi.africa>',
    subject: subject || 'Nisisi',
    text: text || html,
    html,
  };
  if (isTest) {
    return Promise.resolve();
  }
  return mail.send(defaultMsg);
};

export default sendEmail;
