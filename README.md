# 🍛 Back to Source - Enterprise AI Restaurant Management System

A comprehensive AI-powered restaurant management system designed for Back to Source's 350+ team members across multiple locations. This system replaces WhatsApp chaos with structured, intelligent communication and task management.

## 🌟 Key Features

### 🤖 **Intelligent AI Assistant**
- **Strict Knowledge Base Control**: AI responds only from uploaded documents
- **Hindi/English Support**: Seamless bilingual communication
- **Role-based Responses**: Different guidance for chefs, waiters, managers
- **Voice Support**: Text-to-speech for Hindi responses
- **Restaurant-specific Knowledge**: Authentic recipes, SOPs, training materials

### 📱 **Enterprise Authentication**
- **Phone-based OTP Login**: Secure authentication via SMS
- **Multi-location Support**: 8+ restaurant locations
- **Role Hierarchy**: Owner → Regional Manager → Restaurant Manager → Staff
- **User Management**: 350+ team member support

### 📋 **Advanced Task Management**
- **Chat-based Assignment**: "राज को दाल बनाने का काम दो"
- **Real-time Status Updates**: Task completion and delay reporting
- **Manager Dashboard**: View all tasks across locations
- **Staff Interface**: Personal task view and updates

### 📚 **Knowledge Base Management**
- **Document Upload System**: Add recipes, SOPs, training materials
- **Admin Panel**: Web-based document management
- **Search & Filter**: Find relevant information quickly
- **Version Control**: Track document changes and updates
- **Bulk Operations**: Import/export knowledge base

## 🏢 **Enterprise Scale**

- **350+ Team Members** across multiple locations
- **8 Restaurant Locations**: Delhi, Mumbai, Bangalore, Pune, Hyderabad
- **Role-based Access Control**: Appropriate permissions for each level
- **Multi-location Management**: Centralized oversight with local autonomy
- **Scalable Architecture**: Ready for expansion

## Technology Stack

- **Frontend**: React PWA with Hindi font support
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **AI**: OpenAI API with custom training
- **Real-time**: Socket.io for instant messaging
- **Deployment**: Docker containers

## Quick Start (5 minutes)

1. **Install Dependencies**
   ```bash
   npm install
   cd frontend && npm install
   cd ../backend && npm install
   ```

2. **Environment Setup (Optional)**
   ```bash
   cp .env.example .env
   # Add OpenAI API key for AI responses (works without it for demo)
   ```

3. **Start Both Services**
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev
   
   # Terminal 2 - Frontend  
   cd frontend && npm start
   ```

4. **Test the Chatbot**
   - Open http://localhost:3000
   - Enter your name and role (try "Chef")
   - Ask: "दाल मखनी कैसे बनाएं?" or "How to make dal makhani?"

## Project Structure

```
back-to-source-app/
├── frontend/           # React PWA
├── backend/           # Node.js API
├── ai-service/        # Custom AI training
└── infrastructure/    # Docker & deployment
```

## Key Components

### AI Assistant
- Custom-trained for restaurant operations
- Hindi language support
- Context-aware responses based on user role
- Voice synthesis for accessibility

### User Roles
- **Owner**: Full access, analytics, staff management
- **Manager**: Task assignment, training oversight
- **Chef**: Recipe guidance, inventory alerts
- **Waiter**: Order management, customer service tips
- **Cleaner**: Cleaning schedules, safety protocols

### Cost-Effective Infrastructure
- Optimized for small restaurant budgets
- Scalable architecture for multiple locations
- Minimal server requirements
- Offline-first PWA design

## Next Steps

1. **Complete MVP**: Finish basic chat and task features
2. **Training Module**: Add structured learning paths
3. **Analytics Dashboard**: Owner insights and reporting
4. **Multi-restaurant**: Support for restaurant chains
5. **Integration**: POS and inventory system connections

## Contributing

This is a focused solution for Back to Source restaurants. The architecture is designed to be simple, cost-effective, and culturally appropriate for the target users.
##
 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- Python 3.x
- OpenAI API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/prodify-team/backtosourcePAT.git
   cd backtosourcePAT
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install --legacy-peer-deps
   ```

4. **Environment Setup**
   ```bash
   cp .env.example .env
   # Add your OpenAI API key to .env file
   ```

### Running the Application

1. **Start Backend Server**
   ```bash
   cd backend
   node src/server.js
   ```

2. **Start Frontend Server**
   ```bash
   python3 -m http.server 8080
   ```

3. **Access the Applications**
   - **Main Chatbot**: http://localhost:8080/simple-chatbot.html
   - **Admin Panel**: http://localhost:8080/admin-panel.html
   - **Backend API**: http://localhost:3001/api/test

## 📖 Usage Guide

### For Staff Members

1. **Login**: Enter phone number (+91XXXXXXXXXX)
2. **OTP Verification**: Enter demo OTP: 123456
3. **Profile Setup**: Name, Role, Location
4. **Start Chatting**: Use commands like:
   - `"मेरे काम दिखाओ"` - View your tasks
   - `"काम पूरा हुआ"` - Mark task complete
   - `"देर हो रही है क्योंकि..."` - Report delays

### For Managers

1. **Task Assignment**: `"राज को दाल बनाने का काम दो"`
2. **View All Tasks**: `"सभी काम दिखाओ"`
3. **Monitor Progress**: See real-time status updates
4. **Team Management**: Track performance across locations

### For Administrators

1. **Access Admin Panel**: http://localhost:8080/admin-panel.html
2. **Add Documents**: Upload recipes, SOPs, training materials
3. **Manage Knowledge Base**: Search, edit, delete documents
4. **Monitor Usage**: View statistics and analytics

## 🏗️ Architecture

```
backtosourcePAT/
├── backend/                 # Node.js API Server
│   ├── src/
│   │   ├── models/         # Data models (Task, KnowledgeBase, User)
│   │   ├── routes/         # API routes (auth, chat, tasks, knowledge)
│   │   ├── services/       # AI service with OpenAI integration
│   │   └── server.js       # Main server file
│   └── package.json
├── frontend/               # React PWA (Alternative interface)
├── ai-training/           # Training data and documentation
│   ├── recipes/           # Restaurant recipes
│   ├── sops/             # Standard Operating Procedures
│   ├── training/         # Staff training materials
│   ├── faqs/             # Frequently Asked Questions
│   └── locations/        # Location-specific information
├── simple-chatbot.html   # Main chatbot interface
├── admin-panel.html      # Knowledge base management
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/check-user` - Check if user exists
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login existing user

### Chat & AI
- `POST /api/chat/message` - Send message to AI assistant
- `GET /api/chat/suggestions/:role` - Get role-based suggestions

### Task Management
- `GET /api/tasks/:role` - Get tasks by role
- `GET /api/tasks/assignee/:name` - Get tasks by assignee
- `POST /api/tasks` - Create new task
- `PATCH /api/tasks/:id/status` - Update task status

### Knowledge Base
- `GET /api/knowledge/documents` - List all documents
- `POST /api/knowledge/documents` - Add new document
- `POST /api/knowledge/upload` - Upload document file
- `GET /api/knowledge/search` - Search knowledge base
- `DELETE /api/knowledge/documents/:id` - Delete document

## 🎯 Key Benefits

### Operational Excellence
- **Structured Communication**: Replace WhatsApp chaos with organized task management
- **Knowledge Standardization**: Consistent training and procedures across locations
- **Real-time Monitoring**: Instant visibility into operations and issues
- **Scalable Growth**: Architecture supports rapid expansion

### Staff Empowerment
- **Hindi Language Support**: Comfortable communication for all staff
- **Role-specific Guidance**: Relevant information for each position
- **Interactive Learning**: AI-powered training and support
- **Mobile-first Design**: Works on any smartphone

### Management Control
- **Centralized Oversight**: Monitor all locations from single dashboard
- **Performance Tracking**: Task completion rates and efficiency metrics
- **Knowledge Management**: Control what AI knows and teaches
- **Audit Trails**: Complete history of tasks and communications

## 🔒 Security Features

- **Phone-based Authentication**: Secure OTP verification
- **Role-based Access Control**: Appropriate permissions for each user level
- **Knowledge Base Control**: Admin-only document management
- **Audit Logging**: Track all user actions and changes

## 🌍 Multi-location Support

### Current Locations
- **Delhi**: Connaught Place, Greater Kailash
- **Mumbai**: Bandra, Andheri
- **Bangalore**: Koramangala, Indiranagar
- **Pune**: FC Road
- **Hyderabad**: Hi-Tech City

### Location-specific Features
- Local staff management
- Region-specific SOPs
- Supplier information
- Local regulations compliance

## 📊 Analytics & Reporting

- **Task Completion Rates**: Track efficiency across teams
- **Knowledge Base Usage**: Most accessed documents and topics
- **User Engagement**: Active users and feature adoption
- **Performance Metrics**: Response times and resolution rates

## 🔮 Future Enhancements

- **Real SMS Integration**: Replace demo OTP with actual SMS service
- **Database Integration**: PostgreSQL/MongoDB for production scale
- **Push Notifications**: Real-time alerts for managers
- **Mobile App**: Native iOS/Android applications
- **Advanced Analytics**: Predictive insights and recommendations
- **Integration APIs**: POS systems, inventory management
- **Multi-language Support**: Regional languages beyond Hindi/English

## 🤝 Contributing

This is a proprietary system for Back to Source restaurants. For internal development:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

Proprietary - Back to Source Restaurants Private Limited

## 📞 Support

For technical support or feature requests:
- **Internal Team**: Contact development team
- **Restaurant Operations**: Use the built-in support chat
- **Emergency Issues**: Escalate through management channels

---

**Built with ❤️ for Back to Source's 350+ team members across India**

*Transforming restaurant operations through intelligent automation and structured communication.*