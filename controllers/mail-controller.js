const nodemailer = require("nodemailer");
require("dotenv").config();

exports.sendMail = async (req, res) => {
  const { to, subject, html } = req.body;
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (err) {
    console.error("Email Error:", err);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
};
