# 📊 Google Sheets Setup for Prodify Team

## Account: solutions@prodifyteam.com

### Step 1: Create Google Sheet (solutions@prodifyteam.com)

1. **Login to Google Sheets** with `solutions@prodifyteam.com`
2. **Create new spreadsheet**: https://sheets.google.com
3. **Name it**: "Back to Source - Restaurant Management System"
4. **Copy Sheet ID** from URL: 
   ```
   https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit
   ```

### Step 2: Google Cloud Project Setup

1. **Login to Google Cloud Console** with `solutions@prodifyteam.com`
2. **Create/Select Project**: `backtosource-prod`
3. **Enable Google Sheets API**:
   ```bash
   gcloud services enable sheets.googleapis.com
   ```

### Step 3: Create Service Account

1. **Go to**: IAM & Admin > Service Accounts
2. **Create Service Account**:
   - **Name**: `backtosource-sheets`
   - **Description**: `Service account for Back to Source restaurant data`
   - **Role**: `Editor`

3. **Generate Key**:
   - Click on created service account
   - Go to "Keys" tab
   - "Add Key" > "Create new key" > JSON
   - Download the JSON file

4. **Share Google Sheet**:
   - Open your Google Sheet
   - Click "Share" button
   - Add the service account email (from JSON file)
   - Give "Editor" permissions

### Step 4: Environment Configuration

Add these to your `.env` file:

```bash
# Google Sheets Configuration
GOOGLE_SHEET_ID=your_sheet_id_from_step_1
GOOGLE_SERVICE_ACCOUNT_EMAIL=backtosource-sheets@backtosource-prod.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
your_private_key_from_json_file
-----END PRIVATE KEY-----"
```

### Step 5: Test Setup

```bash
# Install dependencies
cd backend && npm install

# Test Google Sheets connection
npm run setup-sheets
```

## 📋 What Gets Created

The system will automatically create these sheets in your Google Spreadsheet:

### 1. **Users** Sheet
- Staff information across all 8 restaurant locations
- Phone numbers, roles, locations, language preferences
- Login tracking and activity status

### 2. **Tasks** Sheet  
- Task assignments and status tracking
- Real-time updates when staff complete tasks
- Priority levels and completion times

### 3. **KnowledgeBase** Sheet
- Recipes, SOPs, training materials
- Searchable content for AI responses
- Version control and upload tracking

### 4. **Conversations** Sheet
- Chat analytics and AI performance
- User interactions and response times
- Training data for AI improvement

### 5. **Restaurants** Sheet
- All 8 location details
- Manager assignments and contact info
- Operational settings per location

## 🎯 Benefits for Prodify Team

### **Real-time Dashboard**
- **solutions@prodifyteam.com** can monitor all restaurant operations
- Live updates as staff complete tasks
- Visual analytics with Google Sheets charts

### **Easy Management**
- Add new restaurants by adding rows
- Bulk import staff from existing spreadsheets
- Export data for reports and analysis

### **Cost Effective**
- **$0/month** vs $50-100/month for database
- No infrastructure management needed
- Google handles backups and security

### **Team Collaboration**
- Multiple team members can access same data
- Comments and notes on specific entries
- Revision history tracks all changes

## 🔒 Security & Access Control

### **Sheet Permissions**
- **Owner**: solutions@prodifyteam.com (full access)
- **Service Account**: backtosource-sheets@... (API access only)
- **Additional Team Members**: Can be added as needed

### **Data Security**
- All data encrypted by Google
- Service account has limited scope
- API access logged and monitored

## 📊 Sample Data Structure

After setup, your sheets will look like this:

### Users Sheet Example:
| id | phone | name | role | location | preferredLanguage | isActive | createdAt | lastSeen |
|----|-------|------|------|----------|-------------------|----------|-----------|----------|
| 1001 | +919876543210 | राजेश कुमार | restaurant-manager | delhi-cp | hindi | true | 2024-01-01T10:00:00Z | 2024-01-01T15:30:00Z |
| 1002 | +919876543211 | प्रिया शर्मा | head-chef | delhi-cp | hindi | true | 2024-01-01T10:05:00Z | 2024-01-01T15:25:00Z |

### Tasks Sheet Example:
| id | title | description | assignedTo | assignedBy | priority | status | createdAt | completedAt |
|----|-------|-------------|------------|------------|----------|--------|-----------|-------------|
| 2001 | दाल मखनी तैयार करें | Evening service के लिए | प्रिया शर्मा | राजेश कुमार | high | completed | 2024-01-01T11:00:00Z | 2024-01-01T15:00:00Z |

## 🚀 Deployment Integration

The Google Sheets integration is already built into your deployment:

```bash
# Deploy with Google Sheets
./deployment/quick-deploy.sh
```

The system automatically:
- Falls back to local storage if Sheets unavailable
- Syncs data to Sheets when connection restored
- Provides health checks and monitoring

## 📞 Support

If you need help with setup:

1. **Check the sheet URL** - Make sure it's accessible
2. **Verify service account** - Check JSON credentials
3. **Test API access** - Run `npm run setup-sheets`
4. **Contact**: The system works without Sheets, so you can deploy first and add Sheets later

---

**🎯 Result**: solutions@prodifyteam.com will have a comprehensive, real-time dashboard of all Back to Source restaurant operations in a familiar Google Sheets interface!