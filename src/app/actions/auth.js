'use server';

import { Login_Server } from '@/server/login';

export async function loginAction(formData) {
  try {
    return await Login_Server(formData);
  } catch (error) {
    console.error('Login action error:', error);
    return { error: error.message || 'An error occurred during login' };
  }
}
