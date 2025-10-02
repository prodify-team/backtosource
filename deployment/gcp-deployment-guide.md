# 🚀 Google Cloud Platform Deployment Guide

## Overview
Deploy Back to Source AI Restaurant Management System on Google Cloud Platform using App Engine for easy scaling and management.

## 📋 Prerequisites

1. **Google Cloud Account** with billing enabled
2. **Google Cloud SDK** installed on your machine
3. **Project created** in Google Cloud Console
4. **OpenAI API Key** for AI functionality

## 🛠️ Step-by-Step Deployment

### Step 1: Setup Google Cloud Project

1. **Create New Project**
   ```bash
   gcloud projects create backtosource-prod --name="Back to Source Production"
   gcloud config set project backtosource-prod
   ```

2. **Enable Required APIs**
   ```bash
   gcloud services enable appengine.googleapis.com
   gcloud services enable cloudbuild.googleapis.com
   gcloud services enable secretmanager.googleapis.com
   ```

3. **Initialize App Engine**
   ```bash
   gcloud app create --region=asia-south1
   ```

### Step 2: Setup Environment Variables

1. **Create Secrets in Secret Manager**
   ```bash
   # OpenAI API Key
   echo "your-openai-api-key-here" | gcloud secrets create openai-api-key --data-file=-
   
   # JWT Secret
   echo "your-jwt-secret-here" | gcloud secrets create jwt-secret --data-file=-
   ```

2. **Grant App Engine access to secrets**
   ```bash
   gcloud projects add-iam-policy-binding backtosource-prod \
     --member="serviceAccount:backtosource-prod@appspot.gserviceaccount.com" \
     --role="roles/secretmanager.secretAccessor"
   ```

### Step 3: Deploy Backend API

1. **Deploy to App Engine**
   ```bash
   cd backend
   gcloud app deploy app.yaml --quiet
   ```

2. **Verify Backend Deployment**
   ```bash
   gcloud app browse --service=api
   ```

### Step 4: Deploy Frontend

1. **Deploy Frontend Service**
   ```bash
   cd ../
   gcloud app deploy frontend-app.yaml --quiet
   ```

2. **Set Default Service**
   ```bash
   gcloud app services set-traffic default=100
   ```

### Step 5: Setup Custom Domain (Optional)

1. **Map Custom Domain**
   ```bash
   gcloud app domain-mappings create backtosource.com
   ```

2. **Verify Domain**
   - Follow Google's domain verification process
   - Update DNS records as instructed

### Step 6: Setup SSL Certificate

```bash
gcloud app ssl-certificates create --domains=backtosource.com
```

## 🔧 Configuration Files

The deployment uses these configuration files:
- `backend/app.yaml` - Backend API service
- `frontend-app.yaml` - Frontend service
- `dispatch.yaml` - URL routing

## 📊 Monitoring & Scaling

### Enable Monitoring
```bash
gcloud services enable monitoring.googleapis.com
gcloud services enable logging.googleapis.com
```

### Auto-scaling Configuration
App Engine automatically scales based on traffic. Configure in `app.yaml`:
```yaml
automatic_scaling:
  min_instances: 1
  max_instances: 10
  target_cpu_utilization: 0.6
```

## 💰 Cost Optimization

### Estimated Monthly Costs (350+ users)
- **App Engine**: $50-150/month
- **Cloud Storage**: $5-20/month
- **Networking**: $10-30/month
- **Total**: ~$65-200/month

### Cost Optimization Tips
1. Use automatic scaling with min_instances: 0 for development
2. Enable Cloud CDN for static assets
3. Use Cloud Storage for file uploads
4. Monitor usage with Cloud Billing alerts

## 🔒 Security Best Practices

1. **Enable IAM & Admin API**
   ```bash
   gcloud services enable iam.googleapis.com
   ```

2. **Setup Firewall Rules**
   ```bash
   gcloud app firewall-rules create 1000 --action=allow --source-range="0.0.0.0/0"
   ```

3. **Enable HTTPS Only**
   - Configured in `app.yaml` with `secure: always`

## 📱 Mobile Access

The deployed app will be accessible on:
- **Desktop**: https://backtosource-prod.appspot.com
- **Mobile**: Same URL (PWA compatible)
- **Custom Domain**: https://backtosource.com (if configured)

## 🚨 Troubleshooting

### Common Issues

1. **Deployment Fails**
   ```bash
   gcloud app logs tail -s api
   ```

2. **Environment Variables Not Working**
   ```bash
   gcloud secrets versions access latest --secret="openai-api-key"
   ```

3. **Service Not Responding**
   ```bash
   gcloud app instances list
   gcloud app logs tail
   ```

### Health Checks
- Backend API: `https://your-app.appspot.com/api/test`
- Frontend: `https://your-app.appspot.com/simple-chatbot.html`

## 🔄 CI/CD Pipeline (Optional)

Setup automated deployment with Cloud Build:

1. **Create build trigger**
   ```bash
   gcloud builds triggers create github \
     --repo-name=backtosource \
     --repo-owner=prodify-team \
     --branch-pattern="^main$" \
     --build-config=cloudbuild.yaml
   ```

## 📞 Support & Maintenance

### Regular Maintenance Tasks
1. **Monitor logs** for errors
2. **Update dependencies** monthly
3. **Review costs** and optimize
4. **Backup knowledge base** weekly
5. **Update SSL certificates** (auto-renewed)

### Emergency Procedures
1. **Rollback deployment**: `gcloud app versions list` → `gcloud app services set-traffic`
2. **Scale down**: Update `app.yaml` and redeploy
3. **Emergency stop**: `gcloud app versions stop`

---

**🎯 Result**: Your Back to Source system will be live on Google Cloud, accessible to 350+ team members across all restaurant locations with enterprise-grade reliability and security!