const otpTemplate = (otp) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Verify Your Email – StudyNotion</title>
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
            <td style="background:linear-gradient(90deg,#FFD60A,#F59E0B);height:5px;font-size:0;line-height:0;">&nbsp;</td>
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
                            background:#FFD60A1A;border:2px solid #FFD60A;
                            line-height:72px;font-size:32px;text-align:center;">
                  ✉️
                </div>
              </div>

              <h1 style="margin:0 0 10px;text-align:center;font-size:24px;font-weight:700;
                         color:#F9FAFB;line-height:1.3;">
                Verify Your Email Address
              </h1>
              <p style="margin:0 0 32px;text-align:center;color:#9CA3AF;font-size:15px;line-height:1.65;">
                Enter this one-time password to complete your registration.<br/>
                It expires in <strong style="color:#F9FAFB;">5 minutes</strong>.
              </p>

              <!-- OTP Block -->
              <div style="background:#0D1117;border-radius:16px;padding:32px 24px;text-align:center;
                          margin:0 0 32px;border:2px dashed #FFD60A40;">
                <div style="font-size:13px;font-weight:600;color:#6B7280;letter-spacing:3px;
                            text-transform:uppercase;margin-bottom:16px;">Your OTP</div>
                <div style="font-size:56px;font-weight:800;letter-spacing:20px;color:#FFD60A;
                            font-variant-numeric:tabular-nums;line-height:1;">
                  ${otp}
                </div>
                <div style="margin-top:16px;display:inline-block;background:#FFD60A15;
                            border-radius:20px;padding:6px 16px;">
                  <span style="font-size:13px;color:#F59E0B;">⏱ Valid for 5 minutes only</span>
                </div>
              </div>

              <!-- Divider -->
              <div style="border-top:1px solid #2C333F;margin:0 0 24px;"></div>

              <p style="margin:0;font-size:13px;color:#6B7280;line-height:1.7;text-align:center;">
                Didn't request this? You can safely ignore this email — your account
                will <strong style="color:#9CA3AF;">not</strong> be created until the OTP is verified.
              </p>
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
module.exports = otpTemplate;
