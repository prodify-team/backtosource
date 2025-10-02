#!/bin/bash

# Quick deployment script for Google Cloud Platform
# Run this script to deploy Back to Source system

set -e

echo "🚀 Starting Back to Source deployment to Google Cloud..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ Google Cloud SDK not found. Please install it first.${NC}"
    echo "Visit: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if user is logged in
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo -e "${YELLOW}⚠️  Please login to Google Cloud first${NC}"
    gcloud auth login
fi

# Get project ID
PROJECT_ID=$(gcloud config get-value project)
if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}❌ No project selected. Please set a project:${NC}"
    echo "gcloud config set project YOUR_PROJECT_ID"
    exit 1
fi

echo -e "${GREEN}✅ Using project: $PROJECT_ID${NC}"

# Enable required APIs
echo -e "${YELLOW}📡 Enabling required APIs...${NC}"
gcloud services enable appengine.googleapis.com --quiet
gcloud services enable cloudbuild.googleapis.com --quiet
gcloud services enable secretmanager.googleapis.com --quiet

# Check if App Engine is initialized
if ! gcloud app describe &> /dev/null; then
    echo -e "${YELLOW}🏗️  Initializing App Engine...${NC}"
    gcloud app create --region=asia-south1 --quiet
fi

# Create secrets if they don't exist
echo -e "${YELLOW}🔐 Setting up secrets...${NC}"

# Check for OpenAI API key
if ! gcloud secrets describe openai-api-key &> /dev/null; then
    echo -e "${YELLOW}🔑 OpenAI API key not found in Secret Manager${NC}"
    read -p "Enter your OpenAI API key: " OPENAI_KEY
    echo "$OPENAI_KEY" | gcloud secrets create openai-api-key --data-file=-
    echo -e "${GREEN}✅ OpenAI API key stored in Secret Manager${NC}"
fi

# Check for JWT secret
if ! gcloud secrets describe jwt-secret &> /dev/null; then
    JWT_SECRET=$(openssl rand -base64 32)
    echo "$JWT_SECRET" | gcloud secrets create jwt-secret --data-file=-
    echo -e "${GREEN}✅ JWT secret generated and stored${NC}"
fi

# Grant App Engine access to secrets
echo -e "${YELLOW}🔒 Granting App Engine access to secrets...${NC}"
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$PROJECT_ID@appspot.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor" --quiet

# Update environment variables with correct project ID
echo -e "${YELLOW}⚙️  Updating configuration files...${NC}"
sed -i.bak "s/backtosource-prod/$PROJECT_ID/g" backend/env_variables.yaml
sed -i.bak "s/backtosource-prod/$PROJECT_ID/g" main.py

# Deploy backend service
echo -e "${YELLOW}🔧 Deploying backend API service...${NC}"
gcloud app deploy backend/app.yaml --quiet --no-promote

# Deploy frontend service
echo -e "${YELLOW}🎨 Deploying frontend service...${NC}"
gcloud app deploy frontend-app.yaml --quiet --no-promote

# Deploy dispatch configuration
echo -e "${YELLOW}🚦 Deploying URL routing...${NC}"
gcloud app deploy dispatch.yaml --quiet

# Promote services to receive traffic
echo -e "${YELLOW}🌐 Promoting services to live traffic...${NC}"
gcloud app services set-traffic default=100 --quiet
gcloud app services set-traffic api=100 --quiet

# Get the deployed URL
APP_URL="https://$PROJECT_ID.appspot.com"

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo ""
echo -e "${GREEN}📱 Your Back to Source system is now live at:${NC}"
echo -e "${GREEN}   Main App: $APP_URL${NC}"
echo -e "${GREEN}   Admin Panel: $APP_URL/admin${NC}"
echo -e "${GREEN}   API Health: $APP_URL/api/test${NC}"
echo ""
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo "1. Test the application at the URLs above"
echo "2. Share the main app URL with your 350+ team members"
echo "3. Use the admin panel to add restaurant-specific knowledge"
echo "4. Monitor usage in Google Cloud Console"
echo ""
echo -e "${GREEN}🔧 Management Commands:${NC}"
echo "• View logs: gcloud app logs tail"
echo "• Scale services: gcloud app versions list"
echo "• Update app: Re-run this script"
echo ""
echo -e "${GREEN}✨ Your enterprise restaurant management system is ready!${NC}"