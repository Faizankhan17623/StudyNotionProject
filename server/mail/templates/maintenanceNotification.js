exports.maintenanceNotificationEmail = (name, message, returnAt) => {
  const returnDateStr = returnAt
    ? new Date(returnAt).toLocaleString("en-IN", {
        dateStyle: "full",
        timeStyle: "short",
        timeZone: "Asia/Kolkata",
      })
    : null

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Scheduled Maintenance – StudyNotion</title>
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
                <div style="display:inline-block;background:#F59E0B22;border-radius:50%;
                            width:64px;height:64px;line-height:64px;font-size:30px;
                            border:2px solid #F59E0B;">
                  🔧
                </div>
              </div>

              <h2 style="margin:0 0 8px;text-align:center;font-size:22px;font-weight:700;color:#F1F2FF;">
                Scheduled Maintenance Notice
              </h2>
              <p style="margin:0 0 28px;text-align:center;color:#ABB8C4;font-size:15px;line-height:1.6;">
                Hi <strong style="color:#F1F2FF;">${name || "there"}</strong>, we have an important update for you.
              </p>

              <!-- Message Box -->
              <div style="background:#0F0F0F;border-radius:12px;padding:24px 28px;margin:0 0 24px;
                          border-left:4px solid #FFD60A;">
                <p style="margin:0;font-size:15px;color:#F1F2FF;line-height:1.7;">${message}</p>
              </div>

              ${
                returnDateStr
                  ? `<!-- Return Date -->
              <div style="background:#0F0F0F;border-radius:12px;padding:20px 28px;margin:0 0 28px;
                          border:1px solid #2C333F;text-align:center;">
                <div style="font-size:12px;color:#6B7280;letter-spacing:1px;
                            text-transform:uppercase;margin-bottom:8px;">
                  Expected to be back online
                </div>
                <div style="font-size:20px;font-weight:700;color:#FFD60A;">
                  ${returnDateStr} IST
                </div>
              </div>`
                  : `<p style="text-align:center;color:#ABB8C4;font-size:14px;margin:0 0 28px;">
                We will notify you as soon as the site is back online.
              </p>`
              }

              <!-- Info -->
              <p style="margin:0;font-size:14px;color:#6B7280;text-align:center;line-height:1.7;">
                We apologize for the inconvenience. Our team is working hard to bring
                new features and improvements to make your learning experience even better.
              </p>
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
                Questions? Reach us at
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
</html>`
}
