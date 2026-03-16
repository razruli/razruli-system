/**
 * Sign-In Feature Model Types
 */

export interface SignInFormData {
  email: string;
  password: string;
}

export interface SignInFormErrors {
  email?: string;
  password?: string;
  submit?: string;
}
