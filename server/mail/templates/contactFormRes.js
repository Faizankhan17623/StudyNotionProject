exports.contactUsEmail = (
  email,
  firstname,
  lastname,
  message,
  phoneNo,
  countrycode
) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>We Got Your Message – StudyNotion</title>
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
                <div style="display:inline-block;background:#FFD60A22;border-radius:50%;
                            width:64px;height:64px;line-height:64px;font-size:30px;">
                  💬
                </div>
              </div>

              <h2 style="margin:0 0 8px;text-align:center;font-size:22px;font-weight:700;color:#F1F2FF;">
                We've Received Your Message!
              </h2>
              <p style="margin:0 0 28px;text-align:center;color:#ABB8C4;font-size:15px;line-height:1.6;">
                Hi <strong style="color:#F1F2FF;">${firstname} ${lastname}</strong>,
                thank you for reaching out. We'll get back to you shortly.
              </p>

              <!-- Message Summary -->
              <div style="background:#0F0F0F;border-radius:12px;overflow:hidden;margin-bottom:28px;
                          border:1px solid #2C333F;">
                <div style="padding:10px 20px;background:#2C333F;">
                  <span style="font-size:12px;font-weight:600;color:#FFD60A;
                               letter-spacing:1px;text-transform:uppercase;">
                    Your Submission
                  </span>
                </div>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:12px 20px;border-bottom:1px solid #2C333F;width:35%;">
                      <span style="font-size:13px;color:#6B7280;">Name</span>
                    </td>
                    <td style="padding:12px 20px;border-bottom:1px solid #2C333F;">
                      <span style="font-size:13px;color:#F1F2FF;">${firstname} ${lastname}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:12px 20px;border-bottom:1px solid #2C333F;">
                      <span style="font-size:13px;color:#6B7280;">Email</span>
                    </td>
                    <td style="padding:12px 20px;border-bottom:1px solid #2C333F;">
                      <span style="font-size:13px;color:#F1F2FF;">${email}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:12px 20px;border-bottom:1px solid #2C333F;">
                      <span style="font-size:13px;color:#6B7280;">Phone</span>
                    </td>
                    <td style="padding:12px 20px;border-bottom:1px solid #2C333F;">
                      <span style="font-size:13px;color:#F1F2FF;">+${countrycode} ${phoneNo}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:12px 20px;vertical-align:top;">
                      <span style="font-size:13px;color:#6B7280;">Message</span>
                    </td>
                    <td style="padding:12px 20px;">
                      <p style="margin:0;font-size:13px;color:#ABB8C4;line-height:1.6;">${message}</p>
                    </td>
                  </tr>
                </table>
              </div>

              <p style="margin:0;font-size:14px;color:#6B7280;text-align:center;line-height:1.6;">
                Our team typically responds within <strong style="color:#ABB8C4;">24–48 hours</strong>.
                We appreciate your patience!
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
                Urgent? Email us directly at
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
