import { client } from '@/sanity/lib/client';

export async function POST(request) {
  try {
    const { email, code } = await request.json();
    
    if (!code || code.length !== 6 || !/^[A-Z0-9]{6}$/.test(code)) {
      console.log('Invalid code format:', code);
      return new Response(
        JSON.stringify({ error: 'Please enter a valid 6-character code' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    if (!email) {
      console.log('No email provided in request');
      return new Response(
        JSON.stringify({ error: 'Email is required for verification' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Fetch user by email
    const user = await client.fetch(
      `*[_type == "libarian" && email == $email][0]`,
      { email }
    );
    
    if (!user) {
      console.log('User not found with email:', email);
      return new Response(
        JSON.stringify({ error: 'User not found' }), 
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if code matches and is not expired
    const now = new Date();
    const codeExpired = user.verificationCodeExpires && new Date(user.verificationCodeExpires) < now;
    
    console.log('Verification check:', {
      storedCode: user.verificationCode,
      providedCode: code,
      expires: user.verificationCodeExpires,
      now: now.toISOString(),
      isExpired: codeExpired
    });
    
    if (!user.verificationCode || user.verificationCode !== code) {
      return new Response(
        JSON.stringify({ error: 'Invalid verification code' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    if (codeExpired) {
      return new Response(
        JSON.stringify({ error: 'Verification code has expired. Please request a new one.' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Clear the verification code after successful verification
    await client
      .patch(user._id)
      .set({ 
        verificationCode: null,
        verificationCodeExpires: null
      })
      .commit();

    return new Response(
      JSON.stringify({ 
        success: true,
        redirectTo: '/dashboard'  // Redirect to dashboard on success
      }), 
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Verification error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to verify email',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
