import nodemailer from 'nodemailer';

export const sendVerificationEmail = async (to, token, link) => {
  try {
    let transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'scotty.hahn34@ethereal.email',
        pass: 'zaj2KyUspZm1Emrp7S'
      }
    });

    const mailOptions = {
      from: "Admin",
      to,
      subject: 'Verify your email',
      html: `<p>Your verification token is: <b>${token}</b></p>
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
