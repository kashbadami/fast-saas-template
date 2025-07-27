export interface EmailProvider {
  name: string;
  sendEmail(options: SendEmailOptions): Promise<SendEmailResult>;
}

export interface SendEmailOptions {
  to: string | string[];
  from: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text?: string;
}

export type EmailTemplateFunction<T = any> = (data: T) => EmailTemplate;

// Template data types
export interface VerificationEmailData {
  name: string;
  email: string;
  verificationUrl: string;
}

export interface WelcomeEmailData {
  name: string;
  email: string;
  dashboardUrl?: string;
}

export interface PasswordResetEmailData {
  name: string;
  email: string;
  resetUrl: string;
}