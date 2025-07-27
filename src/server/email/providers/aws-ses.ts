import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import type { EmailProvider, SendEmailOptions, SendEmailResult } from "../types";

export class AwsSesProvider implements EmailProvider {
  name = "AWS SES";
  private client: SESClient;

  constructor(config: {
    region: string;
    accessKeyId?: string;
    secretAccessKey?: string;
  }) {
    this.client = new SESClient({
      region: config.region,
      credentials: config.accessKeyId && config.secretAccessKey ? {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      } : undefined, // Use default AWS credentials if not provided
    });
  }

  async sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
    try {
      const command = new SendEmailCommand({
        Source: options.from,
        Destination: {
          ToAddresses: Array.isArray(options.to) ? options.to : [options.to],
        },
        Message: {
          Subject: {
            Data: options.subject,
            Charset: "UTF-8",
          },
          Body: {
            Html: {
              Data: options.html,
              Charset: "UTF-8",
            },
            ...(options.text && {
              Text: {
                Data: options.text,
                Charset: "UTF-8",
              },
            }),
          },
        },
        ...(options.replyTo && {
          ReplyToAddresses: [options.replyTo],
        }),
      });

      const response = await this.client.send(command);
      
      return {
        success: true,
        messageId: response.MessageId,
      };
    } catch (error) {
      console.error("AWS SES Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }
}