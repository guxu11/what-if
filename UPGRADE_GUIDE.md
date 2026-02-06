# What-If Game - v3.0 Upgrade Guide

## 🚀 Major Features

This upgrade transforms the What-If Game into a fully dynamic, AI-powered storytelling experience with complete multi-language support.

### Key Features

1. **AI-Powered Stories**: Generate infinite, epic stories using GLM (Z.AI) API
2. **Complete Multi-Language Support**: All content (including AI-generated stories) respects language selection
3. **Server-Side API Integration**: Secure backend proxies all GLM calls
4. **Streaming Responses**: Real-time story generation for better UX
5. **Session Persistence**: Save and continue AI-generated stories
6. **Auto Language Detection**: Automatically detects input language

## 📋 Requirements

- Node.js v18+
- npm or yarn
- Z.AI GLM API key (get one at https://z.ai/manage-apikey/apikey-list)

## 🔧 Installation

### 1. Clone and Install Frontend Dependencies

```bash
cd /Users/xugu/Documents/projects/what-if
npm install
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
cd ..
```

### 3. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and add your GLM API key:

```env
VITE_GLM_API_KEY=your_actual_api_key_here
VITE_API_URL=http://localhost:3001/api
```

**IMPORTANT**: The backend needs the API key in its own `.env` file:

```bash
cp .env server/.env
```

The backend uses `GLM_API_KEY` (without `VITE_` prefix), so make sure both files have:

- Frontend `.env`: `VITE_GLM_API_KEY=...`
- Backend `server/.env`: `GLM_API_KEY=...` (same value)

## 🎮 How to Run

### Development (Frontend + Backend)

**Terminal 1 - Start Backend:**

```bash
npm run dev:server
```

The backend will start on `http://localhost:3001`

**Terminal 2 - Start Frontend:**

```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

### Or Run Both Simultaneously

```bash
npm run dev:all
```

This starts both frontend and backend in parallel.

### Production Build

```bash
npm run build
npm run preview
```

For production, you'll need to run the backend separately and configure a reverse proxy (nginx, Apache, etc.).

## 🧪 Testing

### Run All Tests

```bash
npm test
```

### Run Tests in UI Mode

```bash
npm run test:ui
```

### Run Smoke Tests

```bash
# Frontend smoke test
npm run smoke-test

# Backend smoke test (requires API key)
npm run smoke-test:backend
```

## 🌐 Multi-Language Support

### Supported Languages

- 🇬🇧 English (en)
- 🇪🇸 Spanish (es)
- 🇫🇷 French (fr)
- 🇩🇪 German (de)
- 🇨🇳 Chinese (zh)
- 🇯🇵 Japanese (ja)
- 🇧🇷 Portuguese (pt)

### How Multi-Language Works

1. **UI Strings**: All static text is fully translated
2. **Auto-Detection**: When you type a scenario in any language, AI detects it automatically
3. **Manual Selection**: You can explicitly choose the output language in the AI story screen
4. **Story Content**: AI-generated stories are created in the selected language
5. **Persistent**: Your language preference is saved with your story sessions

## 🤖 AI-Powered Stories

### Starting an AI Story

1. From the main menu, click the "🤖 AI-Powered Story" card
2. Enter your scenario or prompt in any language
3. Select your preferred output language
4. Click "🚀 Begin Story"

### How It Works

1. Your scenario is sent to the backend API
2. Backend calls GLM API with appropriate prompts
3. Story is generated in your chosen language
4. Choices are presented for you to continue
5. Each choice affects the next generation
6. Continue until you decide to end

### Ending Your Story

When you're ready to conclude:

1. Click "✨ End Story & Get Reflection"
2. AI generates a profound, soul-stirring reflection on your journey
3. Your story is automatically saved

## 🔌 API Endpoints

### Backend Server (`http://localhost:3001`)

#### Health Check
```
GET /health
```

#### Story Generation
```
POST /api/story/generate
Content-Type: application/json

{
  "scenario": "Your scenario text",
  "userChoice": "Optional previous choice",
  "storyHistory": ["Array of story events"],
  "language": "en",
  "sessionId": "Optional session ID"
}
```

#### Generate Ending
```
POST /api/story/ending
Content-Type: application/json

{
  "storyHistory": ["Array of story events"],
  "finalChoice": "Your final choice",
  "language": "en",
  "sessionId": "Optional session ID"
}
```

#### Stream Story
```
POST /api/story/stream
Content-Type: application/json

{
  "scenario": "Your scenario text",
  "userChoice": "Optional previous choice",
  "storyHistory": ["Array of story events"],
  "language": "en",
  "sessionId": "Optional session ID"
}
```

Returns: Server-Sent Events (SSE)

#### Detect Language
```
POST /api/story/detect-language
Content-Type: application/json

{
  "text": "Text to analyze"
}
```

#### Session Management
```
POST   /api/sessions           # Create session
GET    /api/sessions/:id       # Get session
PUT    /api/sessions/:id       # Update session
DELETE /api/sessions/:id       # Delete session
GET    /api/sessions           # List all sessions (debug)
POST   /api/sessions/:id/export # Export session
POST   /api/sessions/import     # Import session
```

## 📁 Project Structure

```
what-if/
├── server/                    # Backend server
│   ├── src/
│   │   ├── routes/           # API routes
│   │   │   ├── story.js      # Story generation endpoints
│   │   │   └── sessions.js  # Session management
│   │   ├── services/         # Business logic
│   │   │   ├── glmService.js # GLM API integration
│   │   │   └── sessionService.js # Session management
│   │   └── server.js        # Express server
│   ├── package.json
│   └── .env                 # Backend env (needs GLM_API_KEY)
├── src/
│   ├── components/
│   │   ├── GLMStoryScreen.jsx  # AI story UI
│   │   └── ...
│   ├── hooks/
│   │   ├── useGLMStory.js     # AI story state management
│   │   └── useGameState.js   # Game state management
│   ├── utils/
│   │   └── glm.js           # GLM API client
│   └── ...
├── scripts/
│   ├── smoke-test.sh         # Frontend smoke test
│   └── smoke-test-backend.sh # Backend smoke test
├── .env                     # Frontend env (needs VITE_GLM_API_KEY)
├── .env.example
└── package.json
```

## 🔒 Security Notes

- **API Keys**: Never commit `.env` files to git
- **Backend Proxy**: All GLM calls go through the backend to hide the API key
- **CORS**: Backend is configured for specific origins
- **Input Validation**: All inputs are validated before sending to GLM

## 🐛 Troubleshooting

### Backend Won't Start

- Check that port 3001 is not in use
- Verify `server/.env` exists with `GLM_API_KEY`
- Run `npm run smoke-test:backend` for diagnostics

### Stories Not Generating

- Verify your GLM API key is valid
- Check browser console for errors
- Check backend logs for API errors
- Ensure both frontend and backend are running

### Language Detection Not Working

- Check the `/api/story/detect-language` endpoint
- Verify text is being sent correctly
- Fallback to English is automatic on errors

### Save/Load Issues

- Check localStorage is enabled
- Verify session IDs are being generated
- Check backend session storage (in-memory by default)

## 🚀 Deployment

### Frontend (Vite)

```bash
npm run build
# Output: dist/
```

Deploy `dist/` to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

### Backend (Node/Express)

For production:

1. Use a process manager: PM2, systemd, etc.
2. Set up environment variables
3. Configure reverse proxy (nginx)
4. Enable HTTPS
5. Consider database for session persistence (instead of in-memory)

Example PM2 config:

```javascript
module.exports = {
  apps: [{
    name: 'what-if-backend',
    script: 'server/src/server.js',
    instances: 1,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
};
```

## 📝 Development Notes

### GLM Prompt Engineering

The system prompt in `glmService.js` is designed to produce:
- Epic, soul-stirring narratives ("dàng qì huí cháng")
- Meaningful choices with consequences
- Emotional depth and character development
- World building and thematic richness

Adjust the prompt in `server/src/services/glmService.js` to change story style.

### Session Persistence

Current implementation uses in-memory storage. For production:
- Add Redis, MongoDB, or PostgreSQL
- Implement the database service in `sessionService.js`
- Sessions expire after 24 hours (configurable)

## 🎯 Future Enhancements

Potential improvements:
- User accounts and authentication
- Story sharing and community features
- Advanced story templates and genres
- Voice input and output
- Visual story elements
- Multiplayer collaborative stories

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Contributions welcome! Please see CONTRIBUTING.md for guidelines.

---

**Enjoy your epic storytelling journey! ✨**
