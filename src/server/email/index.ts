import { env } from "~/env";
import type { EmailProvider, SendEmailOptions, SendEmailResult } from "./types";
import { AwsSesProvider } from "./providers/aws-ses";
import { ConsoleEmailProvider } from "./providers/console";
import { verificationEmailTemplate } from "./templates/verification";
import { passwordResetEmailTemplate } from "./templates/password-reset";
import { welcomeEmailTemplate } from "./templates/welcome";
import type { VerificationEmailData, PasswordResetEmailData, WelcomeEmailData } from "./types";

class EmailService {
  private provider: EmailProvider;
  private fromEmail: string;
  private fromName: string;

  constructor() {
    // Initialize provider based on environment
    this.provider = this.initializeProvider();
    
    // Set default from email
    this.fromEmail = env.EMAIL_FROM ?? "noreply@example.com";
    this.fromName = env.EMAIL_FROM_NAME ?? "Fast SaaS Template";
  }

  private initializeProvider(): EmailProvider {
    // Use AWS SES if credentials are provided
    if (env.AWS_SES_REGION && (env.AWS_ACCESS_KEY_ID || env.NODE_ENV === "production")) {
      return new AwsSesProvider({
        region: env.AWS_SES_REGION,
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      });
    }

    // Default to console provider in development
    if (env.NODE_ENV === "development") {
      return new ConsoleEmailProvider();
    }

    // Throw error if no provider is configured in production
    throw new Error("No email provider configured. Please set up AWS SES or another email provider.");
  }

  private formatFrom(): string {
    return `${this.fromName} <${this.fromEmail}>`;
  }

  async sendEmail(options: Omit<SendEmailOptions, "from">): Promise<SendEmailResult> {
    return this.provider.sendEmail({
      ...options,
      from: this.formatFrom(),
    });
  }

  // Template methods
  async sendVerificationEmail(data: VerificationEmailData): Promise<SendEmailResult> {
    const template = verificationEmailTemplate(data);
    return this.sendEmail({
      to: data.email,
      ...template,
    });
  }

  async sendPasswordResetEmail(data: PasswordResetEmailData): Promise<SendEmailResult> {
    const template = passwordResetEmailTemplate(data);
    return this.sendEmail({
      to: data.email,
      ...template,
    });
  }

  async sendWelcomeEmail(data: WelcomeEmailData): Promise<SendEmailResult> {
    const template = welcomeEmailTemplate(data);
    return this.sendEmail({
      to: data.email,
      ...template,
    });
  }
}

// Export singleton instance
export const emailService = new EmailService();