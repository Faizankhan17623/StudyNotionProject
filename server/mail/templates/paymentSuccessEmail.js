exports.paymentSuccessEmail = (name, amount, orderId, paymentId, frontendUrl = "") => {
  const dashboardUrl = frontendUrl
    ? `${frontendUrl}dashboard/enrolled-courses`
    : "https://studynotion.com/dashboard/enrolled-courses"

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Payment Successful – StudyNotion</title>
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
            <td style="background:linear-gradient(90deg,#10B981,#059669);height:5px;font-size:0;line-height:0;">&nbsp;</td>
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
              <div style="text-align:center;margin-bottom:24px;">
                <div style="display:inline-block;width:76px;height:76px;border-radius:50%;
                            background:#10B9811A;border:2px solid #10B981;
                            line-height:76px;font-size:36px;text-align:center;">
                  ✓
                </div>
              </div>

              <h1 style="margin:0 0 10px;text-align:center;font-size:24px;font-weight:700;
                         color:#F9FAFB;line-height:1.3;">
                Payment Successful!
              </h1>
              <p style="margin:0 0 28px;text-align:center;color:#9CA3AF;font-size:15px;line-height:1.65;">
                Hi <strong style="color:#F9FAFB;">${name}</strong>, your payment has been
                received and processed. You're all set!
              </p>

              <!-- Amount badge -->
              <div style="text-align:center;margin:0 0 28px;">
                <div style="display:inline-block;background:linear-gradient(135deg,#10B981,#059669);
                            border-radius:14px;padding:18px 48px;">
                  <div style="font-size:13px;color:#D1FAE5;letter-spacing:1px;
                               text-transform:uppercase;font-weight:600;margin-bottom:4px;">
                    Amount Paid
                  </div>
                  <div style="font-size:36px;font-weight:800;color:#ffffff;">
                    ₹${amount}
                  </div>
                </div>
              </div>

              <!-- Transaction receipt -->
              <div style="background:#0D1117;border-radius:14px;overflow:hidden;margin:0 0 28px;
                          border:1px solid #2C333F;">
                <div style="padding:12px 20px;background:#1C2130;border-bottom:1px solid #2C333F;">
                  <span style="font-size:11px;font-weight:700;color:#10B981;letter-spacing:2px;
                               text-transform:uppercase;">
                    Transaction Receipt
                  </span>
                </div>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:14px 20px;border-bottom:1px solid #1C2130;width:40%;">
                      <span style="font-size:13px;color:#6B7280;">Order ID</span>
                    </td>
                    <td style="padding:14px 20px;border-bottom:1px solid #1C2130;text-align:right;">
                      <code style="font-size:12px;color:#F9FAFB;background:#2C333F;
                                   padding:3px 10px;border-radius:5px;word-break:break-all;">
                        ${orderId}
                      </code>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:14px 20px;">
                      <span style="font-size:13px;color:#6B7280;">Payment ID</span>
                    </td>
                    <td style="padding:14px 20px;text-align:right;">
                      <code style="font-size:12px;color:#F9FAFB;background:#2C333F;
                                   padding:3px 10px;border-radius:5px;word-break:break-all;">
                        ${paymentId}
                      </code>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- CTA -->
              <div style="text-align:center;">
                <a href="${dashboardUrl}"
                   style="display:inline-block;background:#FFD60A;color:#000000;
                          text-decoration:none;font-weight:700;font-size:15px;
                          padding:15px 40px;border-radius:10px;letter-spacing:0.5px;">
                  Go to My Courses →
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 48px 32px;text-align:center;background:#1C2130;
                       border-top:1px solid #2C333F;">
              <p style="margin:0 0 6px;font-size:13px;color:#6B7280;">
                Payment issue?&nbsp;
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
