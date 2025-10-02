# 📊 Google Sheets Database Setup - MVP Solution

## Why Google Sheets for MVP?

✅ **Free** - No database costs  
✅ **Visual Dashboard** - See all data in spreadsheet format  
✅ **Easy Management** - Non-technical team can view/edit data  
✅ **Real-time Collaboration** - Multiple people can monitor  
✅ **Backup Built-in** - Google handles backups automatically  
✅ **Quick Setup** - 5 minutes vs hours for database  

## 🚀 Quick Setup (5 Minutes)

### Step 1: Create Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new blank spreadsheet
3. Name it: "Back to Source - Restaurant Data"
4. Copy the Sheet ID from URL: `https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`

### Step 2: Enable Google Sheets API
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project or select existing: "backtosource-mvp"
3. Enable Google Sheets API:
   ```bash
   gcloud services enable sheets.googleapis.com
   ```

### Step 3: Create Service Account
1. Go to IAM & Admin > Service Accounts
2. Create Service Account:
   - Name: "backtosource-sheets"
   - Description: "Service account for restaurant data access"
3. Download JSON key file
4. Share your Google Sheet with the service account email

### Step 4: Configure Environment Variables
```bash
# Add to your .env file
GOOGLE_SHEET_ID=your_sheet_id_here
GOOGLE_SERVICE_ACCOUNT_EMAIL=backtosource-sheets@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----"
```

## 📋 Sheet Structure

The system automatically creates these sheets:

### 1. Users Sheet
| id | phone | name | role | location | preferredLanguage | isActive | createdAt | lastSeen |
|----|-------|------|------|----------|-------------------|----------|-----------|----------|
| 1001 | +919876543210 | राजेश कुमार | manager | delhi-cp | hindi | true | 2024-01-01 | 2024-01-01 |

### 2. Tasks Sheet
| id | title | description | assignedTo | assignedBy | role | priority | status | statusNote | createdAt | completedAt |
|----|-------|-------------|------------|------------|------|----------|--------|------------|-----------|-------------|
| 2001 | दाल मखनी बनाएं | Evening service के लिए | राज | Manager | chef | high | pending | | 2024-01-01 | |

### 3. KnowledgeBase Sheet
| id | title | category | content | tags | uploadedBy | version | isActive | createdAt | updatedAt |
|----|-------|----------|---------|------|------------|---------|----------|-----------|-----------|
| 3001 | Dal Makhani Recipe | recipes | Ingredients: काली दाल... | dal,recipe | admin | 1 | true | 2024-01-01 | 2024-01-01 |

### 4. Conversations Sheet (Analytics)
| id | userId | userName | message | response | timestamp | responseTime |
|----|--------|----------|---------|----------|-----------|--------------|
| 4001 | 1001 | राजेश | दाल मखनी कैसे बनाएं? | दाल मखनी बनाने के लिए... | 2024-01-01 | 250ms |

### 5. Restaurants Sheet
| id | name | locationCode | address | city | state | manager | phone | isActive |
|----|------|--------------|---------|------|-------|---------|-------|----------|
| 5001 | Back to Source CP | delhi-cp | Block A, CP | Delhi | Delhi | राजेश कुमार | +91-11-xxx | true |

## 🔧 Integration Code

The system automatically falls back to local storage if Google Sheets is not configured, so you can deploy immediately and add Sheets later.

### Test Connection
```javascript
// Test if Google Sheets is working
const sheetsDB = require('./src/config/googleSheets');
await sheetsDB.initialize();
console.log(await sheetsDB.healthCheck());
```

## 📊 Benefits for Restaurant Management

### Real-time Dashboard
- **Owner** can see all tasks across locations in real-time
- **Managers** can monitor staff performance
- **Analytics** built into Google Sheets (charts, pivot tables)

### Easy Data Management
- **Add new restaurants** by adding rows
- **Bulk import staff** from existing spreadsheets
- **Export reports** for accounting/HR

### Collaboration
- **Multiple managers** can view same data
- **Comments** on specific tasks or users
- **Revision history** tracks all changes

## 💰 Cost Comparison

| Solution | Monthly Cost | Setup Time | Maintenance |
|----------|--------------|------------|-------------|
| **Google Sheets** | $0 | 5 minutes | None |
| PostgreSQL | $50-100 | 2-3 hours | Regular |
| MongoDB Atlas | $60-120 | 1-2 hours | Regular |

## 🔒 Security & Limits

### Security
- Service account has limited access
- Sheet can be restricted to specific Google accounts
- All data encrypted by Google

### Limits (More than enough for MVP)
- **5 million cells** per sheet
- **1000 requests per 100 seconds** per user
- **100 requests per 100 seconds** per user per sheet

For 350 users, this easily handles the load.

## 📈 Scaling Path

### MVP (Google Sheets)
- 0-500 users
- Basic analytics
- Manual data management

### Growth (Hybrid)
- Keep Sheets for dashboard
- Add database for complex queries
- Best of both worlds

### Enterprise (Full Database)
- 1000+ users
- Advanced analytics
- Full automation

## 🧪 Testing Your Setup

1. **Create test user**: Add row to Users sheet
2. **Create test task**: Add row to Tasks sheet  
3. **Test chatbot**: Ask about the task
4. **Check logs**: See conversation in Conversations sheet

## 🚨 Troubleshooting

### Common Issues

**"Permission denied"**
- Check if sheet is shared with service account email
- Verify service account has Editor permissions

**"Sheet not found"**
- Double-check GOOGLE_SHEET_ID in environment variables
- Ensure sheet exists and is accessible

**"API not enabled"**
- Enable Google Sheets API in Google Cloud Console
- Wait 5-10 minutes for propagation

### Fallback Mode
If Google Sheets fails, the system automatically uses local storage, so your app keeps working while you fix the configuration.

---

**🎯 Result**: Your Back to Source system gets a free, visual, collaborative database that your entire team can access and manage!