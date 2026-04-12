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
<body style="margin:0;padding:0;background-color:#0D1117;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0D1117;">
    <tr>
      <td align="center" style="padding:48px 16px;">

        <table width="600" cellpadding="0" cellspacing="0"
          style="max-width:600px;width:100%;background-color:#161D29;border-radius:20px;
                 overflow:hidden;border:1px solid #2C333F;">

          <!-- Top accent bar -->
          <tr>
            <td style="background:linear-gradient(90deg,#F97316,#EA580C);height:5px;font-size:0;line-height:0;">&nbsp;</td>
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
                            background:#F973161A;border:2px solid #F97316;
                            line-height:72px;font-size:32px;text-align:center;">
                  🔧
                </div>
              </div>

              <h1 style="margin:0 0 10px;text-align:center;font-size:24px;font-weight:700;
                         color:#F9FAFB;line-height:1.3;">
                Scheduled Maintenance
              </h1>
              <p style="margin:0 0 32px;text-align:center;color:#9CA3AF;font-size:15px;line-height:1.65;">
                Hi <strong style="color:#F9FAFB;">${name || "there"}</strong>,
                we wanted to give you a heads-up about upcoming maintenance.
              </p>

              <!-- Message box -->
              <div style="background:#0D1117;border-radius:14px;padding:22px 24px;margin:0 0 24px;
                          border-left:4px solid #F97316;">
                <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#F97316;
                           letter-spacing:2px;text-transform:uppercase;">
                  Maintenance Message
                </p>
                <p style="margin:0;font-size:15px;color:#F9FAFB;line-height:1.7;">${message}</p>
              </div>

              ${returnDateStr
                ? `<!-- Return time -->
              <div style="background:#0D1117;border-radius:14px;padding:22px 24px;margin:0 0 28px;
                          border:1px solid #2C333F;text-align:center;">
                <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:#6B7280;
                           letter-spacing:2px;text-transform:uppercase;">
                  Expected to be back online
                </p>
                <p style="margin:0;font-size:20px;font-weight:700;color:#FFD60A;">
                  ${returnDateStr} IST
                </p>
              </div>`
                : `<div style="background:#0D1117;border-radius:12px;padding:16px 20px;margin:0 0 28px;
                          border:1px solid #2C333F;text-align:center;">
                <span style="font-size:14px;color:#9CA3AF;">
                  We will notify you as soon as the site is back online.
                </span>
              </div>`
              }

              <!-- Apology note -->
              <div style="background:#F973161A;border-radius:12px;padding:18px 22px;
                          border:1px solid #F9731640;">
                <p style="margin:0;font-size:14px;color:#9CA3AF;line-height:1.7;text-align:center;">
                  We sincerely apologize for any inconvenience. Our team is working hard to
                  bring new improvements to make your learning experience even better. 🚀
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 48px 32px;text-align:center;background:#1C2130;
                       border-top:1px solid #2C333F;">
              <p style="margin:0 0 6px;font-size:13px;color:#6B7280;">
                Questions?&nbsp;
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
</html>`
}
