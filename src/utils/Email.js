import nodemailer from "nodemailer";

export default class Email {
  constructor(user, url) {
    this.to = user.email;
    this.name = user.fullName;
    this.url = url;
    this.from = `Uzair Kaimkhani <${process.env.EMAIL_FROM}>`;
  }

  createTransporter() {
    return nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: false,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  async sendEmail(html, subject) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
    };

    const transporter = this.createTransporter();
    await transporter.sendMail(mailOptions);
  }

  async sendWelcomeEmail() {
    await this.sendEmail(
      `<div>Welcome!! Please verify your account by clicking this <a href=${this.url} target='_blank' > link </a> </div>`,
      "Please verify your account"
    );
  }
  async sendPasswordResetEmail() {
    await this.sendEmail(
      `<div>We received your password reset request, you can reset it by clicking this <a href=${this.url} target='_blank' > link </a> <p>This is only valid for 10 mins</p> </div>`,
      "Password Reset"
    );
  }
}
