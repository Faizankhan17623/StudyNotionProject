exports.passwordUpdated = (email, name, frontendUrl = "") => {
  const changePasswordUrl = frontendUrl
    ? `${frontendUrl}forgot-password`
    : "https://studynotion.com/forgot-password"

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Password Updated – StudyNotion</title>
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
            <td style="background:linear-gradient(90deg,#3B82F6,#1D4ED8);height:5px;font-size:0;line-height:0;">&nbsp;</td>
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

              <!-- Success icon -->
              <div style="text-align:center;margin-bottom:28px;">
                <div style="display:inline-block;width:72px;height:72px;border-radius:50%;
                            background:#3B82F61A;border:2px solid #3B82F6;
                            line-height:72px;font-size:32px;text-align:center;">
                  🔒
                </div>
              </div>

              <h1 style="margin:0 0 10px;text-align:center;font-size:24px;font-weight:700;
                         color:#F9FAFB;line-height:1.3;">
                Password Updated Successfully
              </h1>
              <p style="margin:0 0 32px;text-align:center;color:#9CA3AF;font-size:15px;line-height:1.65;">
                Hi <strong style="color:#F9FAFB;">${name}</strong>, your account password
                has been changed successfully.
              </p>

              <!-- Account info -->
              <div style="background:#0D1117;border-radius:12px;padding:20px 24px;margin:0 0 24px;
                          border-left:4px solid #3B82F6;">
                <p style="margin:0 0 4px;font-size:12px;color:#6B7280;letter-spacing:1px;
                           text-transform:uppercase;font-weight:600;">Account</p>
                <p style="margin:0;font-size:15px;color:#F9FAFB;font-weight:600;">${email}</p>
              </div>

              <!-- Success checklist -->
              <div style="background:#0D1117;border-radius:12px;padding:20px 24px;margin:0 0 28px;
                          border:1px solid #2C333F;">
                <div style="display:flex;align-items:center;margin-bottom:10px;">
                  <span style="color:#22C55E;font-size:16px;margin-right:10px;">✓</span>
                  <span style="font-size:14px;color:#9CA3AF;">Password updated in our system</span>
                </div>
                <div style="display:flex;align-items:center;margin-bottom:10px;">
                  <span style="color:#22C55E;font-size:16px;margin-right:10px;">✓</span>
                  <span style="font-size:14px;color:#9CA3AF;">All existing sessions remain active</span>
                </div>
                <div style="display:flex;align-items:center;">
                  <span style="color:#22C55E;font-size:16px;margin-right:10px;">✓</span>
                  <span style="font-size:14px;color:#9CA3AF;">Your data is safe and encrypted</span>
                </div>
              </div>

              <!-- Warning -->
              <div style="background:#7F1D1D1A;border-radius:12px;padding:18px 22px;margin:0 0 28px;
                          border:1px solid #EF444440;border-left:4px solid #EF4444;">
                <p style="margin:0 0 5px;font-size:13px;font-weight:700;color:#EF4444;">
                  ⚠ Didn't make this change?
                </p>
                <p style="margin:0;font-size:14px;color:#9CA3AF;line-height:1.65;">
                  If you did not change your password, your account may be compromised.
                  Reset it immediately by clicking the button below.
                </p>
              </div>

              <!-- CTA -->
              <div style="text-align:center;">
                <a href="${changePasswordUrl}"
                   style="display:inline-block;background:#EF4444;color:#ffffff;
                          text-decoration:none;font-weight:700;font-size:15px;
                          padding:15px 40px;border-radius:10px;letter-spacing:0.5px;">
                  Reset Password Now →
                </a>
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
