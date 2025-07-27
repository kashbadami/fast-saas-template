---
title: Email Configuration
description: Set up transactional emails with AWS SES or other providers
category: Features
order: 3
---

# Email Configuration Guide

This guide explains how to set up transactional email for your Fast SaaS Template.

## Overview

The template includes a flexible email system that supports multiple providers:
- **Console Provider** (default in development) - Logs emails to console
- **AWS SES Provider** - For production use
- Easy to extend with other providers (Sendgrid, Mailgun, etc.)

## Development Setup

In development, emails are logged to the console by default. No configuration needed!

When a user signs up, you'll see the verification email in your terminal:

```
============================================================
📧 EMAIL SENT (Console Provider)
============================================================
From: Your App Name <noreply@yourdomain.com>
To: user@example.com
Subject: Verify your email - Fast SaaS Template
------------------------------------------------------------
HTML Content:
[Full HTML email content]
============================================================
```

## AWS SES Setup

### Prerequisites
1. AWS Account with SES access
2. Verified domain or email address in SES
3. AWS credentials (Access Key ID and Secret Access Key)

### Step 1: Verify Your Domain/Email in AWS SES

1. Go to [AWS SES Console](https://console.aws.amazon.com/ses/)
2. Navigate to "Verified identities"
3. Click "Create identity"
4. Choose either:
   - **Domain** (recommended for production)
   - **Email address** (quick setup for testing)
5. Follow AWS instructions to verify

### Step 2: Get Out of Sandbox Mode (Production)

By default, AWS SES is in sandbox mode. To send to any email:

1. Go to "Account dashboard" in SES
2. Request production access
3. Fill out the use case form
4. Wait for approval (usually 24 hours)

### Step 3: Create IAM Credentials

1. Go to [IAM Console](https://console.aws.amazon.com/iam/)
2. Create a new user or use existing
3. Attach policy: `AmazonSESFullAccess` (or create custom policy)
4. Generate Access Key ID and Secret Access Key

### Step 4: Configure Environment Variables

Add to your `.env` file:

```env
# Email Configuration
EMAIL_FROM="noreply@yourdomain.com"
EMAIL_FROM_NAME="Your App Name"

# AWS SES Configuration
AWS_SES_REGION="us-east-1"  # or your preferred region
AWS_ACCESS_KEY_ID="your-access-key-id"
AWS_SECRET_ACCESS_KEY="your-secret-access-key"

# App URL for email links
NEXTAUTH_URL="https://yourdomain.com"
```

## Email Templates

Templates are located in `src/server/email/templates/`:

- `verification.ts` - Email verification template

To add a new template:

1. Create a new file in `templates/` folder
2. Export a function that returns `EmailTemplate`
3. Add a method in `src/server/email/index.ts`

Example:

```typescript
// src/server/email/templates/welcome.ts
import type { EmailTemplateFunction, WelcomeEmailData } from "../types";

export const welcomeEmailTemplate: EmailTemplateFunction<WelcomeEmailData> = (data) => {
  return {
    subject: `Welcome to ${data.appName}!`,
    html: `<h1>Welcome ${data.name}!</h1>...`,
    text: `Welcome ${data.name}!...`,
  };
};
```

## Adding New Email Providers

To add a new provider (e.g., Sendgrid):

1. Install the provider's SDK:
```bash
npm install @sendgrid/mail
```

2. Create provider class:
```typescript
// src/server/email/providers/sendgrid.ts
import sgMail from '@sendgrid/mail';
import type { EmailProvider, SendEmailOptions, SendEmailResult } from "../types";

export class SendgridProvider implements EmailProvider {
  name = "Sendgrid";
  
  constructor(apiKey: string) {
    sgMail.setApiKey(apiKey);
  }

  async sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
    try {
      const [response] = await sgMail.send({
        to: options.to,
        from: options.from,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });

      return {
        success: true,
        messageId: response.headers['x-message-id'],
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}
```

3. Update `src/server/email/index.ts` to use the new provider:
```typescript
private initializeProvider(): EmailProvider {
  if (env.SENDGRID_API_KEY) {
    return new SendgridProvider(env.SENDGRID_API_KEY);
  }
  // ... other providers
}
```

## Testing Emails

1. **Development**: Check your terminal for console output
2. **AWS SES Sandbox**: Can only send to verified emails
3. **Production**: Monitor AWS SES dashboard for bounces/complaints

## Troubleshooting

### Emails not sending
- Check environment variables are set correctly
- Verify domain/email in AWS SES
- Check AWS credentials have correct permissions
- Look for errors in server logs

### "MessageRejected" error from AWS
- Email address not verified (in sandbox mode)
- From address not verified
- Daily sending quota exceeded

### Emails going to spam
- Verify your domain with SPF/DKIM records
- Use a dedicated IP (for high volume)
- Monitor sender reputation
- Avoid spam trigger words in content