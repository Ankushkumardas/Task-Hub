import nodemailer from 'nodemailer';

export const sendVerificationEmail = async (to, token, link) => {
  try {
    let transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'arlie86@ethereal.email',
        pass: 'A6fP6MZtxr6RhcSsMP'
      }
    });

    const mailOptions = {
      from: "Admin",
      to,
      subject: 'Verify your email',
      html: `<p>Your verification token for workspace or login is: <b>${token}</b></p>
             <p>Or click <a href='${link}'>here</a> to verify your email.</p>`
    };
    console.log(mailOptions);
    await transporter.sendMail(mailOptions);
    return true;
  } catch (err) {
    console.error("Error sending email:", err);
    return false;
  }
};
