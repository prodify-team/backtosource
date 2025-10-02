#!/bin/bash

echo "🚀 Deploying Back to Source to Google Cloud Platform..."
echo "📧 Project: maximal-ceiling-472713-k4"
echo "🔗 GitHub: https://github.com/prodify-team/backtosource"
echo ""

# Step 1: Login and set project
echo "🔐 Step 1: Login to Google Cloud..."
gcloud auth login
gcloud config set project maximal-ceiling-472713-k4

# Step 2: Enable required APIs
echo "⚙️  Step 2: Enabling required APIs..."
gcloud services enable appengine.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable sheets.googleapis.com

# Step 3: Initialize App Engine (if not already done)
echo "🏗️  Step 3: Initializing App Engine..."
gcloud app create --region=us-central1 || echo "App Engine already exists"

# Step 4: Connect GitHub repository to Cloud Build
echo "🔗 Step 4: Connecting GitHub repository..."
gcloud builds triggers create github \
  --repo-name=backtosource \
  --repo-owner=prodify-team \
  --branch-pattern=main \
  --build-config=cloudbuild.yaml \
  --description="Auto-deploy Back to Source on push to main" || echo "Trigger already exists"

# Step 5: Deploy the application
echo "🚀 Step 5: Deploying application..."

# Deploy main app (frontend)
echo "📱 Deploying frontend..."
gcloud app deploy app.yaml --quiet

# Deploy backend API
echo "🔧 Deploying backend API..."
gcloud app deploy backend/app.yaml --quiet

# Deploy frontend service
echo "🌐 Deploying frontend service..."
gcloud app deploy frontend-app.yaml --quiet

# Deploy dispatch rules
echo "🔀 Deploying dispatch rules..."
gcloud app deploy dispatch.yaml --quiet

# Step 6: Get the deployed URL
echo ""
echo "✅ Deployment Complete!"
echo ""
echo "🌐 Your application is now live at:"
gcloud app browse --no-launch-browser

echo ""
echo "📊 Google Sheets Dashboard:"
echo "https://docs.google.com/spreadsheets/d/11HMex2vYkm1qTDEv5JFbLmfkjUbhfVfdeEe5hJUJuRQ/edit"
echo ""
echo "🧪 Test Login Credentials:"
echo "📱 Phone: +919876543210 (राजेश कुमार - Manager)"
echo "📱 Phone: +919876543211 (प्रिया शर्मा - Head Chef)"
echo "📱 Phone: +919876543219 (संजय अग्रवाल - Owner)"
echo "🔐 OTP: 123456 (demo)"
echo ""
echo "🎯 For Prodify Team (solutions@prodifyteam.com):"
echo "- Monitor all 350+ staff across 8 locations in Google Sheets"
echo "- Real-time task updates and chat analytics"
echo "- $0/month database cost vs $50-100/month traditional DB"
echo ""
echo "🔧 To update the app, just push to GitHub main branch!"
echo "git push origin main"