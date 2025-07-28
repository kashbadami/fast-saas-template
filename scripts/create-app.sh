#!/bin/bash

# Fast SaaS Template Setup Script
# Usage: curl -s https://raw.githubusercontent.com/kashbadami/fast-saas-template/main/scripts/create-app.sh | bash -s my-app-name

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get app name from argument or prompt
APP_NAME=${1:-}

if [ -z "$APP_NAME" ]; then
    echo -e "${BLUE}Welcome to Fast SaaS Template!${NC}"
    echo -n "Enter your app name: "
    read APP_NAME
fi

# Validate app name
if [ -z "$APP_NAME" ]; then
    echo -e "${RED}Error: App name is required${NC}"
    exit 1
fi

echo -e "${BLUE}🚀 Creating new Fast SaaS app: ${GREEN}$APP_NAME${NC}"

# Clone the template
echo -e "${YELLOW}📦 Cloning template...${NC}"
git clone --depth 1 https://github.com/kashbadami/fast-saas-template.git "$APP_NAME"

# Navigate to the new directory
cd "$APP_NAME"

# Remove existing git history
echo -e "${YELLOW}🔧 Setting up fresh git repository...${NC}"
rm -rf .git

# Initialize new git repo
git init

# Install dependencies
echo -e "${YELLOW}📥 Installing dependencies...${NC}"
npm install

# Copy environment file
echo -e "${YELLOW}🔐 Setting up environment variables...${NC}"
if [ -f .env.example ]; then
    cp .env.example .env
    echo -e "${GREEN}✓ Created .env file${NC}"
    echo -e "${YELLOW}⚠️  Don't forget to update your .env file with your own values!${NC}"
fi

# Create initial commit
echo -e "${YELLOW}📝 Creating initial commit...${NC}"
git add -A
git commit -m "Initial commit from fast-saas-template"

# Success message
echo -e "\n${GREEN}✨ Success! Your Fast SaaS app is ready!${NC}\n"
echo -e "Next steps:"
echo -e "  ${BLUE}cd $APP_NAME${NC}"
echo -e "  ${BLUE}npm run dev${NC}        # Start development server"
echo -e "\nTo deploy:"
echo -e "  1. Create a new repo on GitHub"
echo -e "  2. ${BLUE}git remote add origin <your-repo-url>${NC}"
echo -e "  3. ${BLUE}git push -u origin main${NC}"
echo -e "\n${YELLOW}📚 Read the docs:${NC} https://github.com/kashbadami/fast-saas-template#readme"