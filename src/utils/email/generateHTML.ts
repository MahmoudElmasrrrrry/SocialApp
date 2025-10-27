export const template = ({ otp, name, subject }: { otp: string; name: string; subject: string }): string => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${subject}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border: 1px solid #dddddd;
      border-radius: 8px;
      overflow: hidden;
    }
    .email-header {
      background-color: #007BFF;
      color: #ffffff;
      text-align: center;
      padding: 20px;
    }
    .email-header h1 {
      margin: 0;
      font-size: 24px;
    }
    .email-body {
      padding: 20px;
      color: #333333;
      line-height: 1.6;
    }
    .otp-box {
      margin: 20px auto;
      text-align: center;
      background: #f0f9ff;
      border: 1px dashed #007BFF;
      border-radius: 6px;
      padding: 15px;
      font-size: 22px;
      font-weight: bold;
      letter-spacing: 4px;
      color: #007BFF;
    }
    .activation-button {
      display: inline-block;
      background-color: #007BFF;
      color: #ffffff !important;
      text-decoration: none;
      padding: 10px 20px;
      border-radius: 5px;
      font-size: 16px;
      margin: 20px 0;
    }
    .activation-button:hover {
      background-color: #0056b3;
    }
    .email-footer {
      text-align: center;
      padding: 15px;
      background-color: #f4f4f4;
      font-size: 14px;
      color: #777777;
    }
    .email-footer a {
      color: #007BFF;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>${subject}</h1>
    </div>
    <div class="email-body">
      <h2>Hello ${name},</h2>
      <p>Thank you for signing up with <b>Social App</b>. To complete your registration and start using your account, please verify your email.</p>
      
      <p style="text-align:center;">Here is your One-Time OTP:</p>
      <div class="otp-box">${otp}</div>

      <p>If you didn’t request this, you can ignore this email.</p>
    </div>
    <div class="email-footer">
      &copy; ${new Date().getFullYear()} Social App. All rights reserved.
      <br/>
      <a href="mailto:support@Social-App.com">Contact Support</a>
    </div>
  </div>
</body>
</html>
`;
