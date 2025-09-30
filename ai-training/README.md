# Back to Source AI Training System

This folder contains all the custom training data for the Back to Source AI assistant. The bot will automatically learn from these files to provide restaurant-specific responses.

## 📁 Folder Structure

```
ai-training/
├── recipes/           # All restaurant recipes
├── sops/             # Standard Operating Procedures
├── training/         # Staff training materials
├── faqs/             # Frequently Asked Questions
├── locations/        # Location-specific information
├── policies/         # Company policies and rules
└── conversations/    # Sample conversations for training
```

## 🔄 How Training Works

1. **Add Content**: Put your restaurant knowledge in the appropriate folders
2. **Auto-Loading**: The AI system automatically reads these files
3. **Context-Aware**: Bot uses this knowledge to answer questions
4. **Real-time Updates**: Changes take effect immediately

## 📝 File Formats Supported

- **Markdown (.md)** - For structured content
- **JSON (.json)** - For structured data
- **Text (.txt)** - For simple content

## 🚀 Quick Start

1. Add your recipes to `recipes/`
2. Add your SOPs to `sops/`
3. Restart the backend server
4. Test the bot with restaurant-specific questions

The AI will now use your custom knowledge to provide accurate, restaurant-specific responses!