# Deployment Guide

## Repository

📦 **Repository**: git@github.com:guxu11/what-if.git
🌐 **GitHub**: https://github.com/guxu11/what-if

## Latest Commit

```
commit 48c7897
Add comprehensive documentation and testing

- Added QUICKSTART.md for easy setup
- Added CONTRIBUTING.md with contribution guidelines
- Added end-to-end test script (scripts/test-e2e.sh)
- Fixed all failing tests (25 tests passing)
- Added detailed README with Mermaid diagrams
- Improved error handling in components
- Updated package.json with proper version and metadata
```

## Local Testing Commands

### Install & Run Locally

```bash
# Clone the repository
git clone git@github.com:guxu11/what-if.git
cd what-if

# Install dependencies
npm install

# Run development server
npm run dev
# Opens at http://localhost:5173
```

### Run Tests

```bash
# Run all tests
npm test

# Run tests once (CI-friendly)
npm run test:run

# Run tests with coverage
npm run test:coverage

# Run end-to-end tests
./scripts/test-e2e.sh
```

### Build for Production

```bash
# Build
npm run build

# Preview production build
npm run preview
```

## Deployment Options

### 1. Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Vercel will automatically:
- Detect the Vite project
- Build the application
- Deploy to a global CDN
- Provide HTTPS
- Auto-deploy on git push

### 2. Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

### 3. GitHub Pages

```bash
# Install gh-pages
npm install -D gh-pages

# Deploy to GitHub Pages
npm run build
npx gh-pages -d dist
```

Add to `package.json`:
```json
"scripts": {
  "deploy": "npm run build && gh-pages -d dist"
}
```

### 4. Static Hosting (Nginx, Apache, AWS S3)

Simply upload the contents of `dist/` to your static hosting server.

## Environment Variables

No environment variables are required for this application. All state is managed client-side using localStorage.

## Browser Support

- Chrome/Edge: Latest
- Firefox: Latest
- Safari: Latest
- Mobile browsers: iOS Safari, Chrome Mobile

## Performance

- **Initial Load**: < 100ms
- **Time to Interactive**: < 1s
- **Build Size**: ~220KB (gzipped: ~70KB)

## Monitoring & Analytics

To add analytics:

1. Create a `public/analytics.js` file
2. Add your analytics code (Google Analytics, Plausible, etc.)
3. Import in `index.html`:
```html
<script src="/analytics.js"></script>
```

## Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf node_modules/.vite dist
npm install
npm run build
```

### Tests Fail in CI

```bash
# Install dependencies with CI flag
npm ci
npm run test:run
```

### Deployment Fails

Check the build logs:
1. Ensure `npm run build` passes locally
2. Verify build artifacts in `dist/`
3. Check deployment platform logs

## Support

For issues or questions:
- Open an issue on GitHub
- Check existing documentation
- Review troubleshooting section in README.md

---

**Deployment Status**: ✅ Ready for production
**Tests**: ✅ All 25 tests passing
**Build**: ✅ Production build successful
