import type { EmailTemplateFunction, WelcomeEmailData } from "../types";

export const welcomeEmailTemplate: EmailTemplateFunction<WelcomeEmailData> = (data) => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome aboard! 🚀</title>
        <style>
          body {
            font-family: Georgia, 'Times New Roman', serif;
            line-height: 1.8;
            color: #374151;
            background-color: #f8fafc;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .card {
            background: #ffffff;
            border-radius: 8px;
            padding: 40px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            border-top: 4px solid #f97316;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            color: #1e40af;
            font-size: 32px;
            font-weight: bold;
            margin: 0;
          }
          h1 {
            color: #1e40af;
            font-size: 28px;
            margin-bottom: 20px;
            font-weight: normal;
          }
          .highlight {
            background-color: #fef3c7;
            padding: 2px 6px;
            border-radius: 3px;
            color: #92400e;
            font-weight: bold;
          }
          .button {
            display: inline-block;
            background-color: #f97316;
            color: #ffffff !important;
            text-decoration: none;
            padding: 14px 32px;
            border-radius: 6px;
            margin: 20px 0;
            font-weight: normal;
            font-size: 16px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          }
          .button:hover {
            background-color: #ea580c;
          }
          .ps-section {
            background-color: #f8fafc;
            border-left: 4px solid #1e40af;
            padding: 20px;
            margin: 30px 0;
            font-style: italic;
          }
          .footer {
            margin-top: 40px;
            padding-top: 30px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            color: #64748b;
            font-size: 14px;
          }
          .signature {
            font-family: 'Courier New', monospace;
            color: #1e40af;
            font-size: 16px;
            margin-top: 30px;
          }
          ul {
            line-height: 2;
          }
          .emoji {
            font-size: 20px;
            margin: 0 5px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <div class="header">
              <h2 class="logo">Fast SaaS Template</h2>
            </div>
            
            <h1>Holy smokes, ${data.name || 'friend'}! You're in! 🎉</h1>
            
            <p>
              You know that feeling when you discover an underground band before they blow up? 
              Or when you find that perfect coffee shop before the lines get ridiculous?
            </p>
            
            <p>
              <strong>That's you, right now.</strong> Welcome to the club.
            </p>
            
            <p>
              Look, we could give you the corporate spiel about "leveraging synergies" and 
              "paradigm shifts," but let's be real – you're here because you want to 
              <span class="highlight">build something amazing</span>, and we're here to 
              make that ridiculously easy.
            </p>
            
            <h2 style="color: #1e40af; font-size: 22px;">
              Here's what just happened: <span class="emoji">✨</span>
            </h2>
            
            <ul>
              <li>Your account? <strong>Created.</strong> ✓</li>
              <li>Your potential? <strong>Unlimited.</strong> ∞</li>
              <li>Our excitement level? <strong>Through the roof.</strong> 🚀</li>
              <li>Hotel? <strong>Trivago.</strong> (Sorry, couldn't resist)</li>
            </ul>
            
            <div style="text-align: center;">
              <a href="${data.dashboardUrl ?? '#'}" class="button" style="background-color: #f97316; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; display: inline-block; font-weight: normal; font-size: 16px;">
                Dive into your dashboard →
              </a>
            </div>
            
            <div class="ps-section">
              <p style="margin: 0;">
                <strong>P.S.</strong> Remember when Netflix was just a DVD-by-mail service? 
                When Amazon only sold books? Every legendary journey starts with someone 
                clicking a button. You just clicked yours. Let's see where this goes...
              </p>
            </div>
            
            <h3 style="color: #1e40af; font-size: 20px; margin-top: 40px;">
              A few quick tips to get you rolling:
            </h3>
            
            <p>
              <strong>1. Explore everything</strong> – Click around like it's 1999 and you just got broadband. 
              Break things. We built this tough.
            </p>
            
            <p>
              <strong>2. Questions are good</strong> – Seriously, hit reply and ask us anything. 
              "How do I...?" "Can it...?" "What if I...?" We read everything. We're nerds like that.
            </p>
            
            <p>
              <strong>3. Ship early, ship often</strong> – Perfect is the enemy of shipped. 
              Your first project doesn't need to change the world. It just needs to exist.
            </p>
            
            <div class="signature">
              <p>
                Stay curious,<br>
                The Fast SaaS Crew 🎸
              </p>
            </div>
            
            <div class="footer">
              <p>
                <em>
                  "The best time to plant a tree was 20 years ago. 
                  The second best time is now." – Ancient startup proverb
                </em>
              </p>
              <p style="margin-top: 20px; font-size: 12px;">
                Made with ❤️ and probably too much coffee<br>
                © Fast SaaS Template | 
                <a href="#" style="color: #1e40af;">Unsubscribe</a> 
                (but why would you?)
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
Holy smokes, ${data.name || 'friend'}! You're in! 🎉

You know that feeling when you discover an underground band before they blow up? 
Or when you find that perfect coffee shop before the lines get ridiculous?

That's you, right now. Welcome to the club.

Look, we could give you the corporate spiel about "leveraging synergies" and 
"paradigm shifts," but let's be real – you're here because you want to 
build something amazing, and we're here to make that ridiculously easy.

HERE'S WHAT JUST HAPPENED:
• Your account? Created. ✓
• Your potential? Unlimited. ∞
• Our excitement level? Through the roof. 🚀
• Hotel? Trivago. (Sorry, couldn't resist)

Dive into your dashboard: ${data.dashboardUrl ?? '[Dashboard URL]'}

P.S. Remember when Netflix was just a DVD-by-mail service? When Amazon only 
sold books? Every legendary journey starts with someone clicking a button. 
You just clicked yours. Let's see where this goes...

A FEW QUICK TIPS TO GET YOU ROLLING:

1. Explore everything – Click around like it's 1999 and you just got broadband. 
   Break things. We built this tough.

2. Questions are good – Seriously, hit reply and ask us anything. 
   "How do I...?" "Can it...?" "What if I...?" We read everything. 
   We're nerds like that.

3. Ship early, ship often – Perfect is the enemy of shipped. 
   Your first project doesn't need to change the world. It just needs to exist.

Stay curious,
The Fast SaaS Crew 🎸

"The best time to plant a tree was 20 years ago. 
The second best time is now." – Ancient startup proverb

Made with ❤️ and probably too much coffee
© Fast SaaS Template
  `.trim();

  return {
    subject: `${data.name || 'Hey'}, you just joined something special 🎯`,
    html,
    text,
  };
};