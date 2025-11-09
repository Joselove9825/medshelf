const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

if (!BREVO_API_KEY) {
  console.error('BREVO_API_KEY is not set in environment variables');
}

const defaultSender = {
  name: process.env.EMAIL_FROM_NAME || 'Your App Name',
  email: process.env.EMAIL_FROM_ADDRESS || 'noreply@yourdomain.com'
};

async function sendBrevoEmail(emailData) {
  if (!BREVO_API_KEY) {
    throw new Error('Brevo API key is not configured');
  }

  const response = await fetch(BREVO_API_URL, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': BREVO_API_KEY,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      ...emailData,
      sender: emailData.sender || defaultSender
    })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to send email');
  }

  return response.json();
}

export async function sendVerificationCode(email, code) {
  try {
    const emailData = {
      to: [{ email }],
      subject: 'Your Verification Code',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Email Verification</h2>
          <p>Your verification code is:</p>
          <div style="
            font-size: 24px; 
            font-weight: bold; 
            letter-spacing: 4px; 
            margin: 20px 0; 
            padding: 15px; 
            background: #f5f5f5; 
            display: inline-block;
            border-radius: 4px;
            color: #333;
          ">
            ${code}
          </div>
          <p>This code will expire in 15 minutes.</p>
          <p>If you didn't request this code, you can safely ignore this email.</p>
        </div>
      `
    };

    const result = await sendBrevoEmail(emailData);
    console.log('Verification code sent successfully');
    return result;
  } catch (error) {
    console.error('Error sending verification code:', error);
    throw error;
  }
}

// For sending template-based emails (if needed)
export async function sendVerificationEmail(email, code) {
  return sendVerificationCode(email, code);
}
