import type { EmailTemplateFunction, PasswordResetEmailData } from "../types";

export const passwordResetEmailTemplate: EmailTemplateFunction<PasswordResetEmailData> = (data) => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset your password</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #374151; /* Charcoal */
            background-color: #f8fafc; /* Light Gray */
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .card {
            background: #ffffff; /* White */
            border-radius: 8px;
            padding: 40px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          .logo {
            text-align: center;
            margin-bottom: 30px;
          }
          h1 {
            color: #1e40af; /* Deep Blue */
            font-size: 24px;
            margin-bottom: 20px;
          }
          .button {
            display: inline-block;
            background-color: #f97316; /* Vibrant Orange */
            color: #ffffff; /* White */
            text-decoration: none;
            padding: 14px 32px;
            border-radius: 6px;
            margin: 20px 0;
            font-weight: normal;
            font-size: 16px;
          }
          .button:hover {
            background-color: #ea580c; /* Darker orange on hover */
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            color: #64748b; /* Medium Gray */
            font-size: 14px;
          }
          .link {
            color: #1e40af; /* Deep Blue */
            word-break: break-all;
          }
          .warning {
            background-color: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 6px;
            padding: 12px;
            margin: 20px 0;
            color: #92400e;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <div class="logo">
              <h2 style="color: #1e40af; font-size: 28px; margin: 0;">Fast SaaS Template</h2>
            </div>
            
            <h1>Hi ${data.name || 'there'},</h1>
            
            <p>We received a request to reset your password. If you didn't make this request, you can safely ignore this email.</p>
            
            <p>To reset your password, click the button below:</p>
            
            <div style="text-align: center;">
              <a href="${data.resetUrl}" class="button" style="background-color: #f97316; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; display: inline-block; font-weight: normal; font-size: 16px;">Reset Password</a>
            </div>
            
            <p style="color: #64748b; font-size: 14px;">
              Or copy and paste this link into your browser:
              <br>
              <a href="${data.resetUrl}" class="link">${data.resetUrl}</a>
            </p>
            
            <div class="warning">
              <strong>⚠️ Security Note:</strong> This link will expire in 1 hour for your security. If you need to reset your password after that, please request a new reset link.
            </div>
            
            <p style="color: #64748b; font-size: 14px;">
              If you didn't request a password reset, please ignore this email or contact support if you have concerns about your account security.
            </p>
            
            <div class="footer">
              <p>Best regards,<br>The Fast SaaS Team</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
Hi ${data.name || 'there'},

We received a request to reset your password. If you didn't make this request, you can safely ignore this email.

To reset your password, click the link below:
${data.resetUrl}

⚠️ Security Note: This link will expire in 1 hour for your security. If you need to reset your password after that, please request a new reset link.

If you didn't request a password reset, please ignore this email or contact support if you have concerns about your account security.

Best regards,
The Fast SaaS Team
  `.trim();

  return {
    subject: "Reset your password - Fast SaaS Template",
    html,
    text,
  };
};