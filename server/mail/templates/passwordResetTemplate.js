exports.passwordResetTemplate = (name, resetUrl) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Reset Your Password – StudyNotion</title>
</head>
<body style="margin:0;padding:0;background-color:#0D1117;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0D1117;">
    <tr>
      <td align="center" style="padding:48px 16px;">

        <table width="600" cellpadding="0" cellspacing="0"
          style="max-width:600px;width:100%;background-color:#161D29;border-radius:20px;
                 overflow:hidden;border:1px solid #2C333F;">

          <!-- Top accent bar -->
          <tr>
            <td style="background:linear-gradient(90deg,#8B5CF6,#6D28D9);height:5px;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding:36px 48px 28px;text-align:center;background:#1C2130;">
              <div style="font-size:28px;font-weight:800;color:#FFD60A;letter-spacing:3px;
                          text-transform:uppercase;">StudyNotion</div>
              <div style="font-size:12px;color:#6B7280;margin-top:5px;letter-spacing:2px;
                          text-transform:uppercase;">Ignite Your Learning Journey</div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 48px;">

              <!-- Icon -->
              <div style="text-align:center;margin-bottom:28px;">
                <div style="display:inline-block;width:72px;height:72px;border-radius:50%;
                            background:#8B5CF61A;border:2px solid #8B5CF6;
                            line-height:72px;font-size:32px;text-align:center;">
                  🔐
                </div>
              </div>

              <h1 style="margin:0 0 10px;text-align:center;font-size:24px;font-weight:700;
                         color:#F9FAFB;line-height:1.3;">
                Reset Your Password
              </h1>
              <p style="margin:0 0 32px;text-align:center;color:#9CA3AF;font-size:15px;line-height:1.65;">
                Hi <strong style="color:#F9FAFB;">${name}</strong>, we received a request to reset
                the password for your StudyNotion account.
              </p>

              <!-- CTA Button -->
              <div style="text-align:center;margin:0 0 28px;">
                <a href="${resetUrl}"
                   style="display:inline-block;background:linear-gradient(135deg,#8B5CF6,#6D28D9);
                          color:#ffffff;text-decoration:none;font-weight:700;font-size:16px;
                          padding:16px 44px;border-radius:10px;letter-spacing:0.5px;">
                  Reset My Password →
                </a>
              </div>

              <!-- Expiry notice -->
              <div style="background:#8B5CF610;border-radius:12px;padding:16px 20px;margin:0 0 28px;
                          border:1px solid #8B5CF640;text-align:center;">
                <span style="font-size:13px;color:#A78BFA;">
                  ⏱ This link expires in <strong>1 hour</strong>
                </span>
              </div>

              <!-- Link fallback -->
              <div style="background:#0D1117;border-radius:12px;padding:18px 20px;margin:0 0 28px;
                          border:1px solid #2C333F;">
                <p style="margin:0 0 8px;font-size:12px;color:#6B7280;text-transform:uppercase;
                          letter-spacing:1px;font-weight:600;">
                  If the button doesn't work, copy this link:
                </p>
                <p style="margin:0;font-size:12px;color:#8B5CF6;word-break:break-all;
                          line-height:1.6;">
                  ${resetUrl}
                </p>
              </div>

              <!-- Divider -->
              <div style="border-top:1px solid #2C333F;margin:0 0 24px;"></div>

              <!-- Warning -->
              <div style="background:#7F1D1D1A;border-radius:12px;padding:18px 20px;
                          border:1px solid #EF444440;border-left:4px solid #EF4444;">
                <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#EF4444;">
                  ⚠ Didn't request this?
                </p>
                <p style="margin:0;font-size:13px;color:#9CA3AF;line-height:1.6;">
                  If you didn't request a password reset, ignore this email. Your password
                  will remain unchanged and no action is needed.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 48px 32px;text-align:center;background:#1C2130;
                       border-top:1px solid #2C333F;">
              <p style="margin:0 0 6px;font-size:13px;color:#6B7280;">
                Need help?&nbsp;
                <a href="mailto:support@studynotion.com"
                   style="color:#FFD60A;text-decoration:none;">support@studynotion.com</a>
              </p>
              <p style="margin:0;font-size:12px;color:#374151;">
                © ${new Date().getFullYear()} StudyNotion. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};
