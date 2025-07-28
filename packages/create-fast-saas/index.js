#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import readline from 'readline';

const GREEN = '\x1b[32m';
const BLUE = '\x1b[34m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const RESET = '\x1b[0m';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function main() {
  console.log(`${BLUE}🚀 Welcome to Fast SaaS Template!${RESET}\n`);

  // Get app name from args or prompt
  let appName = process.argv[2];
  
  if (!appName) {
    appName = await prompt('Enter your app name: ');
  }

  if (!appName || appName.trim() === '') {
    console.error(`${RED}Error: App name is required${RESET}`);
    process.exit(1);
  }

  appName = appName.trim();

  // Check if directory exists
  if (existsSync(appName)) {
    console.error(`${RED}Error: Directory '${appName}' already exists${RESET}`);
    process.exit(1);
  }

  try {
    console.log(`${YELLOW}📦 Creating ${appName}...${RESET}`);
    
    // Use degit to clone without git history
    execSync(`npx degit kashbadami/fast-saas-template ${appName}`, { stdio: 'inherit' });
    
    // Change to app directory
    process.chdir(appName);
    
    console.log(`${YELLOW}📥 Installing dependencies...${RESET}`);
    execSync('npm install', { stdio: 'inherit' });
    
    // Copy env file if it exists
    if (existsSync('.env.example')) {
      execSync('cp .env.example .env');
      console.log(`${GREEN}✓ Created .env file${RESET}`);
    }
    
    // Initialize git
    console.log(`${YELLOW}🔧 Initializing git repository...${RESET}`);
    execSync('git init');
    execSync('git add -A');
    execSync('git commit -m "Initial commit from fast-saas-template"', { stdio: 'ignore' });
    
    console.log(`\n${GREEN}✨ Success! Your Fast SaaS app is ready!${RESET}\n`);
    console.log('Next steps:');
    console.log(`  ${BLUE}cd ${appName}${RESET}`);
    console.log(`  ${BLUE}npm run dev${RESET}        # Start development server`);
    console.log('\nTo deploy:');
    console.log('  1. Create a new repo on GitHub');
    console.log(`  2. ${BLUE}git remote add origin <your-repo-url>${RESET}`);
    console.log(`  3. ${BLUE}git push -u origin main${RESET}`);
    console.log(`\n${YELLOW}📚 Read the docs:${RESET} https://github.com/kashbadami/fast-saas-template#readme`);
    
  } catch (error) {
    console.error(`${RED}Error creating app:${RESET}`, error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

main().catch(console.error);