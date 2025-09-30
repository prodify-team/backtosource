# AI Training Administration Guide

## 🎯 How to Customize the AI Bot

### Adding New Recipes
1. Create a new `.md` file in `ai-training/recipes/`
2. Follow the format of `dal-makhani.md`
3. Include: ingredients, cooking method, chef tips, common problems
4. Restart backend server to load new recipe

### Adding New SOPs
1. Create a new `.md` file in `ai-training/sops/`
2. Include: step-by-step procedures, checklists, safety guidelines
3. Use clear headings and bullet points
4. Restart backend server

### Adding Training Materials
1. Create a new `.md` file in `ai-training/training/`
2. Structure by role: `new-chef-training.md`, `manager-training.md`
3. Include: day-by-day curriculum, assessment criteria
4. Restart backend server

### Adding FAQs
1. Edit `ai-training/faqs/common-questions.json`
2. Add new questions in appropriate category
3. Include both Hindi and English versions
4. Restart backend server

### Adding Location Data
1. Create new `.md` file in `ai-training/locations/`
2. Include: address, staff structure, local challenges, suppliers
3. Follow format of `delhi-cp.md`
4. Restart backend server

## 🔄 Testing Your Changes

### After Adding New Content:
1. Restart backend: `cd backend && node src/server.js`
2. Check console for "Training data loaded successfully"
3. Test in chatbot with relevant questions
4. Verify AI uses your new knowledge

### Example Test Queries:
- **Recipe**: "दाल मखनी कैसे बनाएं?"
- **SOP**: "Kitchen hygiene के rules क्या हैं?"
- **Training**: "New waiter को क्या सिखाना चाहिए?"
- **FAQ**: "Customer complaint कैसे handle करें?"

## 📊 Monitoring AI Performance

### Check if AI is Using Your Data:
1. Ask specific questions about your content
2. AI should reference your exact procedures/recipes
3. Responses should be detailed and restaurant-specific
4. Check console logs for "Training data loaded"

### Common Issues:
- **AI not using new data**: Restart backend server
- **Incomplete responses**: Add more detail to training files
- **Wrong information**: Update the relevant training file

## 🚀 Advanced Customization

### Role-Specific Training:
- Create separate folders for each role
- AI automatically matches content to user role
- Example: `training/chef/`, `training/waiter/`

### Location-Specific Knowledge:
- Add location-specific files
- AI uses location context from user profile
- Include local suppliers, regulations, challenges

### Seasonal Updates:
- Create seasonal recipe files
- Update menu-specific training
- Add festival/event specific procedures

## 📝 Content Guidelines

### Writing Style:
- Use simple, clear language
- Include both Hindi and English terms
- Add practical examples
- Use bullet points and checklists

### Recipe Format:
- Ingredients with quantities
- Step-by-step method
- Cooking times and temperatures
- Chef tips and troubleshooting
- Storage and serving instructions

### SOP Format:
- Clear procedures
- Safety guidelines
- Checklists for verification
- Emergency procedures
- Training requirements

## 🔧 Technical Notes

### File Formats:
- **Recipes/SOPs/Training**: Markdown (.md)
- **FAQs/Structured Data**: JSON (.json)
- **Images**: Not supported yet (coming soon)

### Auto-Loading:
- System automatically scans training folders
- New files loaded on server restart
- No manual database updates needed
- Changes take effect immediately

### Backup:
- Keep backup of all training files
- Version control recommended (Git)
- Test changes before production deployment

Remember: The AI learns from YOUR content. The better your training materials, the smarter your bot becomes!