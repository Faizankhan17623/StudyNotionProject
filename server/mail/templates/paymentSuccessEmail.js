exports.paymentSuccessEmail = (name, amount, orderId, paymentId) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Payment Successful – StudyNotion</title>
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
              <!-- Success Icon -->
              <div style="text-align:center;margin-bottom:20px;">
                <div style="display:inline-block;background:#16A34A22;border-radius:50%;
                            width:72px;height:72px;line-height:72px;font-size:36px;
                            border:2px solid #16A34A;">
                  ✓
                </div>
              </div>

              <h2 style="margin:0 0 8px;text-align:center;font-size:22px;font-weight:700;color:#F1F2FF;">
                Payment Successful!
              </h2>
              <p style="margin:0 0 32px;text-align:center;color:#ABB8C4;font-size:15px;line-height:1.6;">
                Hi <strong style="color:#F1F2FF;">${name}</strong>, your payment has been received. You're all set!
              </p>

              <!-- Amount Badge -->
              <div style="text-align:center;margin-bottom:28px;">
                <div style="display:inline-block;background:#FFD60A;color:#000000;
                            font-size:30px;font-weight:800;padding:16px 40px;border-radius:12px;">
                  ₹${amount}
                </div>
              </div>

              <!-- Transaction Details -->
              <div style="background:#0F0F0F;border-radius:12px;overflow:hidden;margin-bottom:28px;
                          border:1px solid #2C333F;">
                <div style="padding:10px 20px;background:#2C333F;">
                  <span style="font-size:12px;font-weight:600;color:#FFD60A;
                               letter-spacing:1px;text-transform:uppercase;">
                    Transaction Details
                  </span>
                </div>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:14px 20px;border-bottom:1px solid #2C333F;">
                      <span style="font-size:13px;color:#6B7280;">Order ID</span>
                    </td>
                    <td style="padding:14px 20px;border-bottom:1px solid #2C333F;text-align:right;">
                      <code style="font-size:13px;color:#F1F2FF;background:#2C333F;
                                   padding:3px 8px;border-radius:4px;">
                        ${orderId}
                      </code>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:14px 20px;">
                      <span style="font-size:13px;color:#6B7280;">Payment ID</span>
                    </td>
                    <td style="padding:14px 20px;text-align:right;">
                      <code style="font-size:13px;color:#F1F2FF;background:#2C333F;
                                   padding:3px 8px;border-radius:4px;">
                        ${paymentId}
                      </code>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- CTA Button -->
              <div style="text-align:center;">
                <a href="https://studynotion-edtech-project.vercel.app/dashboard/enrolled-courses"
                   style="display:inline-block;background:#FFD60A;color:#000000;
                          text-decoration:none;font-weight:700;font-size:15px;
                          padding:14px 36px;border-radius:8px;letter-spacing:0.5px;">
                  Start Learning →
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
                Issues with your payment? Contact
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
