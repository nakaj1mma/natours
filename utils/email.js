const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    // ----- For gmail -----
    // service: "Gmail",
    // auth: {
    //   user: process.env.EMAIL_USERNAME_GMAIL,
    //   pass: process.env.EMAIL_PASSOWRD_GMAIL,
    // },
    // Activate in gmail "less secure app" option
    // ---------------------

    host: process.env.EMAIL_HOST_MAILOSAUR,
    port: process.env.EMAIL_PORT_MAILOSAUR,
    auth: {
      user: process.env.EMAIL_USERNAME_MAILOSAUR,
      pass: process.env.EMAIL_PASSWORD_MAILOSAUR,
    },
  });

  // 2) Define the email options
  const mailOptions = {
    from: "Natours Company <natours@tours.io>",
    to: options.email,
    subject: options.subject,
    text: options.message,
    // hmtl:
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
