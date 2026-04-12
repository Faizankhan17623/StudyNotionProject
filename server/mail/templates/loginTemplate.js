exports.loginTemplate = (email, ip, city, region, country, timezone, frontendUrl = "") => {
  const changePasswordUrl = frontendUrl
    ? `${frontendUrl}forgot-password`
    : "https://studynotion.com/forgot-password"

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>New Login Detected – StudyNotion</title>
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
            <td style="background:linear-gradient(90deg,#F59E0B,#D97706);height:5px;font-size:0;line-height:0;">&nbsp;</td>
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
                            background:#F59E0B1A;border:2px solid #F59E0B;
                            line-height:72px;font-size:32px;text-align:center;">
                  🔑
                </div>
              </div>

              <h1 style="margin:0 0 10px;text-align:center;font-size:24px;font-weight:700;
                         color:#F9FAFB;line-height:1.3;">
                New Login Detected
              </h1>
              <p style="margin:0 0 32px;text-align:center;color:#9CA3AF;font-size:15px;line-height:1.65;">
                A new sign-in was recorded for<br/>
                <strong style="color:#F9FAFB;">${email}</strong>
              </p>

              <!-- Login Details Card -->
              <div style="background:#0D1117;border-radius:14px;overflow:hidden;margin:0 0 28px;
                          border:1px solid #2C333F;">
                <div style="padding:12px 20px;background:#1C2130;border-bottom:1px solid #2C333F;">
                  <span style="font-size:11px;font-weight:700;color:#F59E0B;letter-spacing:2px;
                               text-transform:uppercase;">
                    Login Information
                  </span>
                </div>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:13px 20px;border-bottom:1px solid #1C2130;width:38%;">
                      <span style="font-size:13px;color:#6B7280;">IP Address</span>
                    </td>
                    <td style="padding:13px 20px;border-bottom:1px solid #1C2130;">
                      <code style="font-size:13px;color:#F9FAFB;background:#2C333F;
                                   padding:3px 10px;border-radius:5px;">${ip || "Unknown"}</code>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:13px 20px;border-bottom:1px solid #1C2130;">
                      <span style="font-size:13px;color:#6B7280;">Country</span>
                    </td>
                    <td style="padding:13px 20px;border-bottom:1px solid #1C2130;">
                      <span style="font-size:13px;color:#F9FAFB;">${country || "—"}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:13px 20px;border-bottom:1px solid #1C2130;">
                      <span style="font-size:13px;color:#6B7280;">Region</span>
                    </td>
                    <td style="padding:13px 20px;border-bottom:1px solid #1C2130;">
                      <span style="font-size:13px;color:#F9FAFB;">${region || "—"}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:13px 20px;border-bottom:1px solid #1C2130;">
                      <span style="font-size:13px;color:#6B7280;">City</span>
                    </td>
                    <td style="padding:13px 20px;border-bottom:1px solid #1C2130;">
                      <span style="font-size:13px;color:#F9FAFB;">${city || "—"}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:13px 20px;">
                      <span style="font-size:13px;color:#6B7280;">Timezone</span>
                    </td>
                    <td style="padding:13px 20px;">
                      <span style="font-size:13px;color:#F9FAFB;">${timezone || "—"}</span>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Warning Banner -->
              <div style="background:#7F1D1D1A;border-radius:12px;padding:18px 22px;margin:0 0 28px;
                          border:1px solid #EF444440;border-left:4px solid #EF4444;">
                <p style="margin:0 0 5px;font-size:13px;font-weight:700;color:#EF4444;">
                  ⚠ Wasn't you?
                </p>
                <p style="margin:0;font-size:14px;color:#9CA3AF;line-height:1.65;">
                  If you did not sign in, your account may be at risk.
                  Change your password immediately to secure your account.
                </p>
              </div>

              <!-- CTA -->
              <div style="text-align:center;">
                <a href="${changePasswordUrl}"
                   style="display:inline-block;background:#EF4444;color:#ffffff;
                          text-decoration:none;font-weight:700;font-size:15px;
                          padding:15px 40px;border-radius:10px;letter-spacing:0.5px;">
                  Change Password Now →
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
