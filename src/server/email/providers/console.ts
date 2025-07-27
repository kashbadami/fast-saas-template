import type { EmailProvider, SendEmailOptions, SendEmailResult } from "../types";

export class ConsoleEmailProvider implements EmailProvider {
  name = "Console";

  async sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
    console.log("=".repeat(60));
    console.log("📧 EMAIL SENT (Console Provider)");
    console.log("=".repeat(60));
    console.log("From:", options.from);
    console.log("To:", Array.isArray(options.to) ? options.to.join(", ") : options.to);
    console.log("Subject:", options.subject);
    if (options.replyTo) {
      console.log("Reply-To:", options.replyTo);
    }
    console.log("-".repeat(60));
    console.log("HTML Content:");
    console.log(options.html);
    if (options.text) {
      console.log("-".repeat(60));
      console.log("Text Content:");
      console.log(options.text);
    }
    console.log("=".repeat(60));

    return {
      success: true,
      messageId: `console-${Date.now()}`,
    };
  }
}