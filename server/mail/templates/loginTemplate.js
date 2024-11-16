exports.loginTemplate = (email, ip,city,region,country,timezone) => {
    return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>Course Registration Confirmation</title>
        <style>
            body {
                background-color: #ffffff;
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.4;
                color: #333333;
                margin: 0;
                padding: 0;
            }
    
    
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                text-align: center;
            }
    
            .logo {
                max-width: 200px;
                margin-bottom: 20px;
            }
    
            .message {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 20px;
            }
    
            .body {
                font-size: 16px;
                margin-bottom: 20px;
            }
    
                .cta {
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #FFD60A;
                    color: #000000;
                    text-decoration: none;
                    border-radius: 5px;
                    font-size: 16px;
                    font-weight: bold;
                    margin-top: 20px;
                }
    
            .support {
                font-size: 14px;
                color: #999999;
                margin-top: 20px;
            }
    
            .highlight {
                font-weight: bold;
            }
        </style>
    
    </head>
    
    <body>
        <div class="container">
            <a href="https://studynotion-edtech-project.vercel.app"><img class="logo" src="https://i.ibb.co/7Xyj3PC/logo.png"
                    alt="StudyNotion Logo"></a>
            <div class="message">SuccessFull login</div>
            <div class="body">
                <p>Dear ${email},</p>
                <p>Some one has tried to login to your account <span class="highlight">"The ip address is${ip}"</span>. if
                    it is not you please change the password of your account</p>
                <p>The country name is ${country}"</p>
                <p>The city name is ${city}</p>
                <p>The state name is ${region}</p>
                <p>The time zone is ${timezone}</p>
                <h1>IF This is not you change the password
                <a class="cta" href="https://study-notion-project-41pskjvjhvsadfssdfa.vercel.app/forgot-password">Change Password</a>
                </h1>
            </div>
            <div class="support">If you have any questions or need assistance, please feel free to reach out to us at <a
                    href="mailto:faizankhan901152@gmail.com">info@studynotion.com</a>. We are here to help!</div>
        </div>
    </body>
    
    </html>`;
  };
  