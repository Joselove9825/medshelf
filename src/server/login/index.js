'use server';

import { client } from '@/sanity/lib/client';
import { comparePasswords, generateToken, generateVerificationCode } from '@/lib/auth';

export async function Login_Server(formData) {
  console.log('Login_Server called with formData:', formData);
  
  try {
    // Check if formData is a FormData instance
    const email = formData instanceof FormData ? formData.get('email') : formData.email;
    const password = formData instanceof FormData ? formData.get('password') : formData.password;
    
    console.log('Processing login for email:', email);
    
    if (!email || !password) {
      console.log('Missing email or password');
      return { error: 'Email and password are required' };
    }

    console.log('Fetching user from Sanity...');
    // Fetch user from Sanity
    const user = await client.fetch(
      `*[_type == "libarian" && email == $email][0]`,
      { email }
    );

    console.log('Sanity response:', user);

    if (!user) {
      console.log('No user found with email:', email);
      return { error: 'Invalid credentials' };
    }

    console.log('User found, verifying password...');
    // Verify password
    const isPasswordValid = await comparePasswords(password, user.password);
    
    if (!isPasswordValid) {
      console.log('Invalid password for user:', email);
      return { error: 'Invalid credentials' };
    }

    console.log('Password valid, generating token...');
    // Generate verification code
    const verificationCode = generateVerificationCode();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15); // Code expires in 15 minutes

    // Save verification code to user document
    await client
      .patch(user._id)
      .set({ 
        verificationCode,
        verificationCodeExpires: expiresAt.toISOString()
      })
      .commit();

    // Send verification code via Brevo
    const { sendVerificationCode } = await import('@/lib/brevo');
    await sendVerificationCode(user.email, verificationCode);

    // Generate JWT token (but don't store it yet)
    const token = generateToken(user);
    
    const response = { 
      success: true, 
      redirectTo: '/verify_login_email',
      tempToken: token, // Temporary token just for verification
      user: {
        id: user._id,
        email: user.email,
        name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
        role: user.role?.[0] || 'user'
      }
    };
    
    console.log('Login successful, returning response:', response);
    return response;
    
  } catch (error) {
    console.error('Login error:', error);
    return { 
      error: 'An error occurred during login',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    };
  }
}