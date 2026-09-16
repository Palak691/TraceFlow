import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendInviteEmails({ emails, inviteCode, projectName, inviterName }) {
   console.log("📨 sendInviteEmails FUNCTION CALLED");
  const joinLink = `${process.env.CLIENT_URL}/join?code=${inviteCode}`;

  const results = await Promise.allSettled(
    emails.map((email) =>
      transporter.sendMail({
        from: `"TraceFlow" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `${inviterName} invited you to "${projectName}" on TraceFlow`,
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
            <h2 style="color: #1E2A4A;">You've been invited to a project</h2>
            <p><strong>${inviterName}</strong> invited you to join <strong>${projectName}</strong> on TraceFlow.</p>
            <p>Use this invite code to join:</p>
            <p style="font-size: 20px; font-weight: bold; letter-spacing: 2px; background: #f3f4f6; padding: 10px 16px; border-radius: 8px; display: inline-block;">${inviteCode}</p>
            <p>Or click below to join directly:</p>
            <a href="${joinLink}" style="display: inline-block; background: #1E2A4A; color: #F5C563; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">Join Project</a>
          </div>
        `,
      })
    )
  );

  const failed = results
    .map((r, i) => (r.status === 'rejected' ? emails[i] : null))
    .filter(Boolean);

  return { sent: emails.length - failed.length, failed };
}