exports.courseEnrollmentEmail = (courseName, name, frontendUrl = "") => {
  const dashboardUrl = frontendUrl
    ? `${frontendUrl}dashboard/enrolled-courses`
    : "https://studynotion.com/dashboard/enrolled-courses"

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Enrollment Confirmed – StudyNotion</title>
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
            <td style="background:linear-gradient(90deg,#FFD60A,#10B981);height:5px;font-size:0;line-height:0;">&nbsp;</td>
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
                            background:#10B9811A;border:2px solid #10B981;
                            line-height:72px;font-size:32px;text-align:center;">
                  🎉
                </div>
              </div>

              <h1 style="margin:0 0 10px;text-align:center;font-size:24px;font-weight:700;
                         color:#F9FAFB;line-height:1.3;">
                You're Enrolled!
              </h1>
              <p style="margin:0 0 32px;text-align:center;color:#9CA3AF;font-size:15px;line-height:1.65;">
                Welcome aboard, <strong style="color:#F9FAFB;">${name}</strong>!
                Your enrollment has been confirmed.
              </p>

              <!-- Course Card -->
              <div style="background:#0D1117;border-radius:14px;padding:24px 28px;margin:0 0 28px;
                          border:1px solid #2C333F;">
                <div style="font-size:11px;font-weight:700;color:#FFD60A;letter-spacing:2px;
                            text-transform:uppercase;margin-bottom:10px;">
                  📚 Your New Course
                </div>
                <div style="font-size:19px;font-weight:700;color:#F9FAFB;line-height:1.4;
                            border-left:3px solid #FFD60A;padding-left:14px;">
                  ${courseName}
                </div>
              </div>

              <!-- What's next -->
              <div style="background:#0D1117;border-radius:14px;padding:22px 24px;margin:0 0 28px;
                          border:1px solid #2C333F;">
                <p style="margin:0 0 14px;font-size:12px;font-weight:700;color:#6B7280;
                           letter-spacing:2px;text-transform:uppercase;">What's next</p>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:8px 0;vertical-align:top;width:28px;">
                      <span style="font-size:16px;">▶</span>
                    </td>
                    <td style="padding:8px 0;">
                      <span style="font-size:14px;color:#9CA3AF;">Access all video lectures and course materials</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;vertical-align:top;width:28px;">
                      <span style="font-size:16px;">📝</span>
                    </td>
                    <td style="padding:8px 0;">
                      <span style="font-size:14px;color:#9CA3AF;">Track your progress from your dashboard</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;vertical-align:top;width:28px;">
                      <span style="font-size:16px;">🏆</span>
                    </td>
                    <td style="padding:8px 0;">
                      <span style="font-size:14px;color:#9CA3AF;">Earn your certificate when you complete the course</span>
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
                  Start Learning Now →
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 48px 32px;text-align:center;background:#1C2130;
                       border-top:1px solid #2C333F;">
              <p style="margin:0 0 6px;font-size:13px;color:#6B7280;">
                Questions about your course?&nbsp;
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
