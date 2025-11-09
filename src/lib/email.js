// This is a placeholder for email sending functionality
// In a production environment, you would integrate with an email service like SendGrid, Mailgun, etc.

export async function sendVerificationEmail(email, code) {
  // In a real app, you would send an email here
  console.log(`Sending verification email to ${email} with code: ${code}`);
  
  // For development, just log the email details
  console.log('Email content:', {
    to: email,
    subject: 'Verify Your Email',
    text: `Your verification code is: ${code}\nThis code will expire in 15 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Verify Your Email</h2>
        <p>Your verification code is:</p>
        <div style="font-size: 24px; font-weight: bold; letter-spacing: 4px; margin: 20px 0;">
          ${code}
        </div>
        <p>This code will expire in 15 minutes.</p>
        <p>If you didn't request this code, you can safely ignore this email.</p>
      </div>
    `
  });
  
  // In production, you would use something like:
  /*
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  
  const msg = {
    to: email,
    from: 'noreply@yourdomain.com',
    subject: 'Verify Your Email',
    text: `Your verification code is: ${code}\nThis code will expire in 15 minutes.`,
    html: `...`
  };
  
  await sgMail.send(msg);
  */
}
