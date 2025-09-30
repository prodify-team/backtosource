# Back to Source Restaurant Management App

## Phase 1: Hindi-Compatible AI Assistant (MVP)
```
back-to-source-app/
├── frontend/                 # Progressive Web App
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatBot/
│   │   │   ├── TaskList/
│   │   │   └── Profile/
│   │   ├── services/
│   │   └── utils/
│   └── public/
├── backend/                  # Node.js API
│   ├── src/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── services/
│   │   └── middleware/
│   └── config/
├── ai-service/              # Custom AI Training
│   ├── training-data/
│   ├── models/
│   └── scripts/
└── infrastructure/          # Docker & Cloud Config
    ├── docker/
    └── terraform/
```

## Technology Stack
- **Frontend**: React PWA with Hindi font support
- **Backend**: Node.js with Express
- **Database**: MongoDB (flexible schema)
- **AI**: OpenAI API with custom training data
- **Deployment**: Docker containers on AWS/DigitalOcean
- **Real-time**: WebSocket for instant messaging