#!/bin/bash

echo "🚀 Deploying Back to Source to Google Cloud Platform..."
echo "📧 Project: maximal-ceiling-472713-k4"
echo "🔗 GitHub: https://github.com/prodify-team/backtosource"
echo ""

# Check if already logged in
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "🔐 Step 1: Login to Google Cloud..."
    gcloud auth login
fi

# Set project
echo "⚙️  Setting project..."
gcloud config set project maximal-ceiling-472713-k4

# Step 2: Enable required APIs
echo "⚙️  Step 2: Enabling required APIs..."
gcloud services enable appengine.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable sheets.googleapis.com

# Step 3: Deploy the backend API first
echo "🔧 Step 3: Deploying backend API..."
gcloud app deploy backend/app.yaml --quiet

# Step 4: Deploy the main frontend
echo "📱 Step 4: Deploying main frontend..."
gcloud app deploy app.yaml --quiet

# Step 5: Get the deployed URL
echo ""
echo "✅ Deployment Complete!"
echo ""
echo "🌐 Your application is now live at:"
APP_URL=$(gcloud app browse --no-launch-browser 2>&1 | grep -o 'https://[^[:space:]]*')
echo "$APP_URL"

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
echo ""
echo "📋 Next Steps:"
echo "1. Test the app at: $APP_URL"
echo "2. Check Google Sheets for real-time data"
echo "3. Share the URL with your 350+ team members"