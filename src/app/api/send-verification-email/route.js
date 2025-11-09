import { client } from '@/sanity/lib/client';
import { generateVerificationCode } from '@/lib/auth';
import { sendVerificationCode } from '@/lib/brevo';

export async function POST() {
  try {
    // In a real app, you'd get the user's email from the session or token
    // For now, we'll get the latest user (you should replace this with actual user lookup)
    const user = await client.fetch(`*[_type == "libarian"] | order(_createdAt desc)[0]`);
    
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Generate and save verification code
    const verificationCode = generateVerificationCode();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15); // Code expires in 15 minutes

    await client
      .patch(user._id)
      .set({ 
        verificationCode,
        verificationCodeExpires: expiresAt.toISOString()
      })
      .commit();

    // Send verification code via Brevo
    await sendVerificationCode(user.email, verificationCode);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error sending verification email:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to send verification email',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
