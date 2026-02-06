# What-If Game v2 🌟⚔️

An epic multi-language interactive story game with branching narratives, consequences, and deep state tracking. Built with **React** and **Vite** for a modern, responsive experience.

## 🎮 New Features in v2.0

### 🌍 Multi-Language Support
- **7 Languages**: English, Spanish, French, German, Chinese, Japanese, Portuguese
- **Auto-Detection**: Automatically detects user input language
- **UI Translations**: Complete UI translation in all supported languages
- **Language Selector**: Easy-to-use dropdown in the header
- **Seamless Switching**: Change language at any time without losing progress

### ⚔️ Epic Mode
- **Deep Branching**: 8+ levels of story branching with meaningful consequences
- **State Tracking**: Track characters, factions, resources, quests, and flags
- **Narrative Engine**: Sophisticated story progression system
- **Skill Checks**: Optional dice rolls for skill-based decisions
- **Multiple Endings**: Several unique endings based on choices

### 🏰 Epic Scenario: "The King's Destiny"
A medieval political intrigue story featuring:
- Multiple chapters with deep branching
- Character relationships and reputation tracking
- Faction politics and alliances
- Quest progression system
- Timeline and consequence tracking
- Multiple unique endings

## 🎨 Features

### Cinematic Experience
- **Epic Title Screen**: Animated title with sparkle particles and pulsing effects
- **Confetti Celebration**: Explosive confetti animation (150 pieces) when completing scenarios
- **Achievement Badge**: Visual notification with trophy icon when game is completed
- **Screen Shake**: Dramatic shake effect on key moments
- **Cinematic Transitions**: Smooth, movie-like scene transitions
- **Interactive Audio**: Sound effects for all interactions (click, hover, success, choice, insight, save)

### Core Gameplay
- **4 Pre-built Scenarios**: Career change, relationship decision, relocation, and epic medieval tale
- **Custom Scenario Creator**: Define your own life crossroads
- **Branching Paths**: Each decision leads to different outcomes
- **Path History**: Track your journey step by step

### Visual Experience
- **Animated Background**: Dynamic particle effects with gradient animation
- **Smooth Transitions**: Fade, slide, and scale animations between screens
- **Choice Reveal**: Staggered animations for choice buttons
- **Hover Effects**: Interactive feedback with glow and shadow effects
- **Glassmorphism**: Modern frosted glass UI design
- **Responsive Design**: Works beautifully on all screen sizes

### Save/Load System
- **Auto-save**: Progress saves automatically after each decision
- **Manual Save**: Save at any point with custom name
- **Load Game**: Restore any saved state from localStorage
- **Persistent Storage**: Your progress persists between browser sessions

### Audio System

#### Background Music (BGM)
- **Ambient Drone**: Generated with Web Audio API (no external files)
- **Volume Controls**: Adjust volume with slider (0-100%)
- **Mute Toggle**: Easy on/off control with emoji indicator
- **No External Assets**: All audio generated locally, no downloads needed
- **Persistent Settings**: Volume and play state saved to localStorage

#### Sound Effects (SFX)
- **Click Sound**: Feedback for button clicks
- **Hover Sound**: Subtle feedback for hover interactions
- **Success Sound**: Celebratory chord progression (C5-E5-G5)
- **Choice Sound**: Feedback for making game choices
- **Insight Sound**: Ascending chord for insights (E4-G4-B4-E5)
- **Save Sound**: Confirmation tone for game saves

#### Audio Attribution
All audio (BGM and SFX) is generated in real-time using the **Web Audio API**. No external audio files, samples, or licensed music is used. All audio is created programmatically and requires no external licensing or attribution.

## 🏗️ Project Structure

```
what-if/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── MenuScreen.jsx
│   │   ├── GameScreen.jsx
│   │   ├── LoadScreen.jsx
│   │   ├── CustomScenarioModal.jsx
│   │   ├── SaveModal.jsx
│   │   ├── Toast.jsx
│   │   ├── LanguageSelector.jsx  # NEW: Language selector component
│   │   └── ...other components
│   ├── data/               # Game data
│   │   ├── scenarios.js        # Pre-built scenario templates
│   │   └── epicScenarios.js   # NEW: Epic scenario definitions
│   ├── hooks/              # Custom React hooks
│   │   └── useGameState.js # Game state management
│   ├── i18n/               # NEW: Internationalization
│   │   ├── translations.js     # UI translations for 7 languages
│   │   ├── useTranslation.js  # React hook for i18n
│   │   ├── languageDetection.js # Auto-detect language from text
│   │   └── index.js          # Module exports
│   ├── engine/             # NEW: Narrative engine
│   │   ├── storyState.js     # State model (world, characters, factions)
│   │   └── narrativeEngine.js # Branching, consequences, skill checks
│   ├── utils/              # Utility functions
│   │   └── glm.js         # Guidance & Learning Model
│   ├── __tests__/          # Test files
│   │   ├── setup.js
│   │   ├── scenarios.test.js
│   │   ├── glm.test.js
│   │   └── useGameState.test.js
│   ├── App.jsx             # Main application component
│   ├── main.jsx            # React entry point with i18n provider
│   └── index.css           # Global styles
├── .prettierrc            # NEW: Prettier config
├── .prettierignore        # NEW: Prettier ignore patterns
├── index.html              # HTML template
├── vite.config.js          # Vite configuration
└── package.json            # Project dependencies
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone git@github.com:guxu11/what-if.git
cd what-if

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🛠️ Build & Deploy

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

The optimized build will be in the `dist/` directory.

### Preview Production Build
```bash
npm run preview
```

### Deployment
You can deploy the `dist/` directory to any static hosting service:
- **Vercel**: Automatic deployment on git push
- **Netlify**: Drag and drop the dist/ folder
- **GitHub Pages**: Deploy from the gh-pages branch
- **Any static hosting**: Nginx, Apache, AWS S3, etc.

## 🧪 Testing

The project includes comprehensive tests using Vitest and React Testing Library.

### Run Tests

```bash
# Run tests in watch mode
npm test

# Run tests with UI
npm run test:ui

# Run tests once
npm run test:run

# Run tests with coverage
npm run test:coverage
```

### Test Coverage

- **Scenarios**: Test data structure, branching paths, and scenario loading
- **GLM Engine**: Test outcome and reflection generation
- **Game State Hook**: Test state management, save/load functionality
- **Components**: Component rendering and user interactions

## 🎨 Code Style

The project uses **Prettier** for code formatting and **ESLint** for linting.

### Format Code

```bash
# Format all source files
npm run format

# Check formatting without making changes
npm run format:check

# Lint code
npm run lint
```

## 📊 Architecture

### Multi-Language System

```
┌─────────────────────────────────────┐
│         TranslationProvider         │
│  (React Context + LocalStorage)    │
└──────────────┬──────────────────┘
               │
               ├─► LanguageSelector
               │
               ├─► useTranslation()
               │
               └─► All Components
                    (via t() function)
```

### Epic Story Engine

```
┌─────────────────────────────────────────┐
│         NarrativeEngine              │
│                                    │
│  ┌────────────────────────────┐   │
│  │     StoryState           │   │
│  │                         │   │
│  │  • Locations           │   │
│  │  • Characters          │   │
│  │  • Factions           │   │
│  │  • Quests             │   │
│  │  • Flags              │   │
│  │  • Timeline           │   │
│  │  • Inventory          │   │
│  │  • Resources          │   │
│  └────────────────────────────┘   │
│                                    │
│  ┌────────────────────────────┐   │
│  │     Chapter             │   │
│  │  ┌────────────────┐   │   │
│  │  │   Scene       │   │   │
│  │  │  ◄ Choices   │   │   │
│  │  │  ◄ Conseq.  │   │   │
│  │  │  ◄ Conditions │   │   │
│  │  │  ◄ Skill Chk │   │   │
│  │  └────────────────┘   │   │
│  └────────────────────────────┘   │
└─────────────────────────────────────────┘
```

## 🎮 Game Modes

### Standard Mode
- 3 classic life crossroads scenarios
- 2-3 levels of branching
- Focus on single decisions
- Quick, reflective gameplay (5-10 minutes)

### Epic Mode
- 1 deep epic scenario
- 8+ levels of branching
- Complex state tracking
- Multiple endings and consequences
- Longer, immersive gameplay (20-40 minutes)

## 🌐 Supported Languages

| Language | Code | Flag | Coverage |
|-----------|-------|-------|----------|
| English | en | 🇬🇧 | 100% |
| Spanish | es | 🇪🇸 | 100% |
| French | fr | 🇫🇷 | 100% |
| German | de | 🇩🇪 | 100% |
| Chinese | zh | 🇨🇳 | 100% |
| Japanese | ja | 🇯🇵 | 100% |
| Portuguese | pt | 🇧🇷 | 100% |

## 📝 API Reference

### Translation Hook

```javascript
const { t, language, changeLanguage, autoDetect, enableAutoDetect } = useTranslation();

// Translate a key
t('app.title') // "🌟 What-If Game"

// Change language
changeLanguage('es') // Switch to Spanish

// Enable auto-detection
enableAutoDetect() // Auto-detect from user input

// Translate with parameters
t('game.complete', { scenario: 'The King's Destiny' })
```

### Story State Model

```javascript
import { StoryState, Location, Character, Faction, Quest } from './engine/storyState';

const state = new StoryState();

// Add world elements
state.addLocation(new Location('castle', 'Royal Castle', 'The seat of power'));
state.addCharacter(new Character('king', 'King Aldric', 'The aging ruler'));
state.addFaction(new Faction('royalty', 'Royal Court', 'The ruling class'));

// Track quests
state.addQuest(new Quest('main_discovery', 'Uncover the Truth', 'main'));
state.startQuest('main_discovery');

// Manage flags
state.setFlag('met_king', true);
state.unlockBranch('secret_path');

// Record history
state.recordChoice('choice_1', 'Accepted the offer', { reputation: 10 });
```

## 🎯 Epic Scenario: "The King's Destiny"

### Story Arc

1. **Chapter 1: The Letter** - The revelation of your true heritage
2. **Chapter 2: Revelation** - Meeting the King and learning the truth
3. **Chapter 3: Crossroads** - Choosing your path (rule, rebel, negotiate)
4. **Chapter 4: Alliance** - Building relationships and factions
5. **Chapter 5: Conflict** - The rebellion begins
6. **Chapter 6: Decision** - Making hard choices
7. **Chapter 7: Consequence** - Living with your decisions
8. **Chapter 8: Resolution** - The endings

### Key Mechanics

- **Character Relationships**: Your choices affect how NPCs view you
- **Faction Standing**: Support different factions and see consequences
- **Resource Management**: Balance gold, health, mana, influence
- **Quest System**: Track main and side quests
- **Flag System**: Unlock paths based on previous choices
- **Skill Checks**: Optional dice rolls for difficult decisions

### Endings

- **Peaceful Reign** - Diplomatic victory through alliances
- **Militant Victory** - Military victory at great cost
- **Compromise** - Middle path with mixed results
- **Sacrifice** - Giving up power for the greater good
- **Tragedy** - Poor choices lead to disaster
- ...and more!

## 🤝 Contributing

Contributions are welcome! To add a new scenario:

1. Add the scenario to `src/data/scenarios.js` or create an epic scenario in `src/data/epicScenarios.js`
2. Follow the existing scenario structure
3. Include branching choices and meaningful reflections
4. Test the scenario in the game
5. Add translations to `src/i18n/translations.js`

### Adding Translations

To add support for a new language:

1. Add the language code to `supportedLanguages` in `src/i18n/translations.js`
2. Add translation keys for all UI strings
3. Add language detection patterns in `src/i18n/languageDetection.js`
4. Test the implementation

### Code Style

- Use functional components with hooks
- Follow React best practices
- Include PropTypes or TypeScript (if adding)
- Write tests for new features
- Format code with Prettier before committing
- Update documentation as needed

## 📄 License

MIT License - feel free to use and modify for personal or commercial projects.

## 🙏 Acknowledgments

- Inspired by the idea that we all wonder "what if" about life's choices
- Built with modern web technologies for accessibility and performance
- Designed to encourage reflection on living in the present moment
- Multi-language support powered by a custom detection algorithm
- Epic storytelling engine inspired by classic RPG narrative systems

---

**Remember**: The game's purpose is exploration, not prediction. Whatever paths you imagine, the only reality is the present moment. 💫

**Version 2.0**: Epic mode, multi-language support, and deep narrative engine.
