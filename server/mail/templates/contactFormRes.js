exports.contactUsEmail = (email, firstname, lastname, message, phoneNo, countrycode) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>We Got Your Message – StudyNotion</title>
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
            <td style="background:linear-gradient(90deg,#06B6D4,#0284C7);height:5px;font-size:0;line-height:0;">&nbsp;</td>
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
                            background:#06B6D41A;border:2px solid #06B6D4;
                            line-height:72px;font-size:32px;text-align:center;">
                  💬
                </div>
              </div>

              <h1 style="margin:0 0 10px;text-align:center;font-size:24px;font-weight:700;
                         color:#F9FAFB;line-height:1.3;">
                We've Received Your Message!
              </h1>
              <p style="margin:0 0 32px;text-align:center;color:#9CA3AF;font-size:15px;line-height:1.65;">
                Hi <strong style="color:#F9FAFB;">${firstname} ${lastname}</strong>,
                thank you for reaching out. Our team will get back to you shortly.
              </p>

              <!-- Message Summary -->
              <div style="background:#0D1117;border-radius:14px;overflow:hidden;margin:0 0 28px;
                          border:1px solid #2C333F;">
                <div style="padding:12px 20px;background:#1C2130;border-bottom:1px solid #2C333F;">
                  <span style="font-size:11px;font-weight:700;color:#06B6D4;letter-spacing:2px;
                               text-transform:uppercase;">
                    Your Submission
                  </span>
                </div>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:13px 20px;border-bottom:1px solid #1C2130;width:30%;">
                      <span style="font-size:13px;color:#6B7280;">Name</span>
                    </td>
                    <td style="padding:13px 20px;border-bottom:1px solid #1C2130;">
                      <span style="font-size:13px;color:#F9FAFB;">${firstname} ${lastname}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:13px 20px;border-bottom:1px solid #1C2130;">
                      <span style="font-size:13px;color:#6B7280;">Email</span>
                    </td>
                    <td style="padding:13px 20px;border-bottom:1px solid #1C2130;">
                      <span style="font-size:13px;color:#F9FAFB;">${email}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:13px 20px;border-bottom:1px solid #1C2130;">
                      <span style="font-size:13px;color:#6B7280;">Phone</span>
                    </td>
                    <td style="padding:13px 20px;border-bottom:1px solid #1C2130;">
                      <span style="font-size:13px;color:#F9FAFB;">
                        ${countrycode ? `+${countrycode} ` : ""}${phoneNo || "—"}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:13px 20px;vertical-align:top;">
                      <span style="font-size:13px;color:#6B7280;">Message</span>
                    </td>
                    <td style="padding:13px 20px;">
                      <p style="margin:0;font-size:14px;color:#9CA3AF;line-height:1.7;">${message}</p>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Response time notice -->
              <div style="background:#06B6D410;border-radius:12px;padding:16px 20px;
                          border:1px solid #06B6D430;text-align:center;">
                <span style="font-size:14px;color:#67E8F9;">
                  ⏱ Our team typically responds within
                  <strong style="color:#F9FAFB;">24–48 hours</strong>
                </span>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 48px 32px;text-align:center;background:#1C2130;
                       border-top:1px solid #2C333F;">
              <p style="margin:0 0 6px;font-size:13px;color:#6B7280;">
                Urgent?&nbsp;
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
