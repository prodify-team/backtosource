#!/bin/bash

echo "🔒 SECURE Deployment to Google Cloud Platform..."
echo "📧 Project: maximal-ceiling-472713-k4"
echo ""

# Check if service account key exists
if [ ! -f "new-service-account-key.json" ]; then
    echo "❌ Error: new-service-account-key.json not found!"
    echo "Please run: gcloud iam service-accounts keys create new-service-account-key.json --iam-account=backtosource-prod@maximal-ceiling-472713-k4.iam.gserviceaccount.com"
    exit 1
fi

# Read the service account key
SERVICE_ACCOUNT_EMAIL=$(cat new-service-account-key.json | grep -o '"client_email": "[^"]*' | cut -d'"' -f4)
PRIVATE_KEY=$(cat new-service-account-key.json | grep -o '"private_key": "[^"]*' | cut -d'"' -f4)

echo "🔐 Setting environment variables securely..."

# Set environment variables in Google Cloud (not in code)
gcloud app deploy backend/app.yaml \
  --set-env-vars="GOOGLE_SHEET_ID=11HMex2vYkm1qTDEv5JFbLmfkjUbhfVfdeEe5hJUJuRQ" \
  --set-env-vars="GOOGLE_SERVICE_ACCOUNT_EMAIL=$SERVICE_ACCOUNT_EMAIL" \
  --set-env-vars="GOOGLE_PRIVATE_KEY=$PRIVATE_KEY" \
  --quiet

echo "📱 Deploying frontend..."
gcloud app deploy app.yaml --quiet

echo ""
echo "✅ Secure Deployment Complete!"
echo ""
echo "🌐 Your application is now live at:"
gcloud app browse --no-launch-browser

echo ""
echo "🔒 Security Notes:"
echo "- Service account key is NOT stored in Git"
echo "- Environment variables are set directly in Google Cloud"
echo "- Private key is secure and not exposed in code"
echo ""
echo "🧹 Cleanup: Remove the key file after deployment"
echo "rm new-service-account-key.json"