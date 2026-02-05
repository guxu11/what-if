# Quick Start Guide

## Installation & Running

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The game will be available at [http://localhost:5173](http://localhost:5173)

### 3. Build for Production
```bash
npm run build
```

The optimized build will be in the `dist/` directory.

### 4. Preview Production Build
```bash
npm run preview
```

## How to Play

1. **Select a Scenario**: Choose from career, relationship, or relocation scenarios, or create your own custom scenario.

2. **Make Choices**: Each decision point presents 2-3 options. Click your choice to continue.

3. **Explore Paths**: Follow the branching narrative and see where your choices lead.

4. **Receive Insights**: At the end of each path, receive a personalized insight based on your journey.

5. **Save Progress**: Use the Save button to save your game at any point.

6. **Audio Controls**: Use the audio player in the top-right corner to:
   - Toggle music on/off (🔊/🔇)
   - Adjust volume with the slider

7. **Reflect**: The game encourages you to focus on the present moment rather than dwelling on "what if" scenarios.

## Testing

### Run All Tests
```bash
npm test
```

### Run Tests Once
```bash
npm run test:run
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Run End-to-End Tests
```bash
./scripts/test-e2e.sh
```

## Project Structure

```
what-if/
├── src/
│   ├── components/     # React UI components
│   ├── data/          # Game scenarios
│   ├── hooks/         # Custom React hooks
│   ├── utils/         # GLM engine
│   └── __tests__/     # Test files
├── scripts/           # Utility scripts
└── public/            # Static assets
```

## Key Features

- **3 Pre-built Scenarios**: Career, relationship, and relocation dilemmas
- **Custom Scenario Creator**: Create your own what-if scenarios
- **GLM Engine**: Built-in Guidance & Learning Model for generating insights
- **Save/Load System**: Persistent game progress in localStorage
- **Visual Polish**: Animated backgrounds, smooth transitions, and micro-interactions
- **Audio Controls**: Background music with volume adjustment and mute toggle
- **Responsive Design**: Works on desktop, tablet, and mobile

## Troubleshooting

### Port Already in Use
```bash
npm run dev -- --port 3000
```

### Tests Fail
Make sure all dependencies are installed:
```bash
npm install
```

### Build Fails
Try cleaning the cache:
```bash
rm -rf node_modules/.vite
npm run build
```

## Support

For detailed documentation, see [README.md](README.md).

For contribution guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md).

---

**Remember**: The paths we imagine are just imagination. What matters most is how fully we walk the path we're on. Live in the present. No regrets. ✨
