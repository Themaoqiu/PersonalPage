#!/bin/bash

# Deploy script for GitHub Pages
# This script builds the project with GitHub Pages configuration
# and deploys it to the themaoqiu.github.io repository

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

SOURCE_DIR="/Users/themaoqiu/CodeRepo/web/pure/Xingjian Wang"
TARGET_DIR="/Users/themaoqiu/CodeRepo/web/themaoqiu.github.io"

echo -e "${BLUE}Starting GitHub Pages deployment...${NC}"

# Step 1: Build with GitHub Pages configuration
echo -e "${BLUE}Step 1: Building project with GitHub Pages configuration...${NC}"
cd "$SOURCE_DIR"
export DEPLOYMENT_PLATFORM=github
bun run build

if [ ! -d "dist" ]; then
  echo -e "${RED}Error: dist folder not found after build${NC}"
  exit 1
fi

echo -e "${GREEN}Build completed!${NC}"

# Step 2: Clean target directory (keep .git)
echo -e "${BLUE}Step 2: Cleaning target directory...${NC}"
cd "$TARGET_DIR"

# Remove all files except .git, .github, and .gitignore
find . -maxdepth 1 ! -name '.git' ! -name '.github' ! -name '.gitignore' ! -name '.' ! -name '..' -exec rm -rf {} +

echo -e "${GREEN}Target directory cleaned!${NC}"

# Step 3: Copy new files
echo -e "${BLUE}Step 3: Copying new files from dist...${NC}"
cp -r "$SOURCE_DIR/dist/"* "$TARGET_DIR/"

echo -e "${GREEN}Files copied!${NC}"

# Step 4: Git commit and push
echo -e "${BLUE}Step 4: Committing and pushing to GitHub...${NC}"
cd "$TARGET_DIR"
git add -A

# Check if there are changes to commit
if git diff --staged --quiet; then
  echo -e "${BLUE}No changes to commit${NC}"
else
  TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
  git commit -m "Deploy: $TIMESTAMP"
  git push origin main
  echo -e "${GREEN}Successfully deployed!${NC}"
  echo -e "${GREEN}Your site will be available at: https://themaoqiu.github.io${NC}"
fi

echo -e "${GREEN}Deployment complete!${NC}"
