exports.passwordUpdated = (email, name) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Password Updated – StudyNotion</title>
</head>
<body style="margin:0;padding:0;background-color:#0F0F0F;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0F0F0F;">
    <tr>
      <td align="center" style="padding:48px 20px;">

        <!-- Card -->
        <table width="600" cellpadding="0" cellspacing="0"
          style="max-width:600px;width:100%;background-color:#161D29;border-radius:16px;overflow:hidden;border:1px solid #2C333F;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1C1F2E 0%,#2C333F 100%);
                        padding:36px 40px;text-align:center;border-bottom:3px solid #FFD60A;">
              <div style="font-size:30px;font-weight:800;color:#FFD60A;letter-spacing:2px;">StudyNotion</div>
              <div style="font-size:13px;color:#ABB8C4;margin-top:6px;letter-spacing:1px;">
                IGNITE YOUR LEARNING JOURNEY
              </div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 44px;">
              <!-- Icon -->
              <div style="text-align:center;margin-bottom:24px;">
                <div style="display:inline-block;background:#3B82F622;border-radius:50%;
                            width:64px;height:64px;line-height:64px;font-size:30px;
                            border:2px solid #3B82F6;">
                  🔒
                </div>
              </div>

              <h2 style="margin:0 0 8px;text-align:center;font-size:22px;font-weight:700;color:#F1F2FF;">
                Password Updated Successfully
              </h2>
              <p style="margin:0 0 28px;text-align:center;color:#ABB8C4;font-size:15px;line-height:1.6;">
                Hi <strong style="color:#F1F2FF;">${name}</strong>, your account password has been changed.
              </p>

              <!-- Info Box -->
              <div style="background:#0F0F0F;border-radius:12px;padding:20px 24px;margin:0 0 28px;
                          border-left:4px solid #3B82F6;">
                <p style="margin:0;font-size:14px;color:#ABB8C4;line-height:1.6;">
                  Password changed for account:<br/>
                  <strong style="color:#F1F2FF;">${email}</strong>
                </p>
              </div>

              <!-- Warning Box -->
              <div style="background:#7F1D1D22;border-radius:12px;padding:20px 24px;margin:0 0 28px;
                          border:1px solid #EF4444;border-left:4px solid #EF4444;">
                <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#EF4444;">
                  ⚠ Not you?
                </p>
                <p style="margin:0;font-size:14px;color:#ABB8C4;line-height:1.6;">
                  If you did not make this change, your account may be compromised.
                  Reset your password immediately.
                </p>
              </div>

              <!-- CTA Button -->
              <div style="text-align:center;">
                <a href="https://studynotion-edtech-project.vercel.app/forgot-password"
                   style="display:inline-block;background:#EF4444;color:#ffffff;
                          text-decoration:none;font-weight:700;font-size:15px;
                          padding:14px 36px;border-radius:8px;letter-spacing:0.5px;">
                  Reset Password Now →
                </a>
              </div>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 44px;">
              <div style="border-top:1px solid #2C333F;"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:28px 44px;text-align:center;">
              <p style="margin:0 0 6px;font-size:13px;color:#6B7280;">
                Need help? Contact
                <a href="mailto:info@studynotion.com"
                   style="color:#FFD60A;text-decoration:none;">info@studynotion.com</a>
              </p>
              <p style="margin:0;font-size:12px;color:#3D3D3D;">
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
