#!/bin/bash

# End-to-End Testing Script for What-If Game

set -e

echo "🧪 Running End-to-End Tests for What-If Game"
echo "============================================="
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "❌ node_modules not found. Installing dependencies..."
    npm install
fi

# 1. Run unit tests
echo "📋 Running unit tests..."
npm run test:run
echo ""

# 2. Build for production
echo "🏗️  Building for production..."
npm run build
echo ""

# 3. Check build output
if [ ! -d "dist" ]; then
    echo "❌ Build failed: dist directory not found"
    exit 1
fi

echo "✅ Build successful!"
echo ""
echo "📊 Build output:"
ls -lh dist/
echo ""

# 4. Check for critical files
echo "🔍 Checking critical files..."

critical_files=(
    "dist/index.html"
    "dist/assets"
)

for file in "${critical_files[@]}"; do
    if [ ! -e "$file" ]; then
        echo "❌ Critical file missing: $file"
        exit 1
    fi
done

echo "✅ All critical files present"
echo ""

# 5. Check package.json scripts
echo "📝 Checking package.json scripts..."
required_scripts=("dev" "build" "test" "preview")

for script in "${required_scripts[@]}"; do
    if npm run | grep -q "^  $script$"; then
        echo "  ✅ $script"
    else
        echo "  ❌ Missing script: $script"
        exit 1
    fi
done

echo ""

# 6. Check documentation
echo "📚 Checking documentation..."
if [ -f "README.md" ]; then
    echo "  ✅ README.md exists"
else
    echo "  ❌ README.md missing"
    exit 1
fi

if [ -f "CONTRIBUTING.md" ]; then
    echo "  ✅ CONTRIBUTING.md exists"
else
    echo "  ❌ CONTRIBUTING.md missing"
    exit 1
fi

echo ""

# 7. Check source code structure
echo "🏗️  Checking source code structure..."
required_dirs=(
    "src/components"
    "src/data"
    "src/hooks"
    "src/utils"
    "src/__tests__"
)

for dir in "${required_dirs[@]}"; do
    if [ -d "$dir" ]; then
        echo "  ✅ $dir/"
    else
        echo "  ❌ Missing directory: $dir/"
        exit 1
    fi
done

echo ""

# 8. Check for critical components
echo "🎮 Checking for critical components..."
critical_components=(
    "src/components/MenuScreen.jsx"
    "src/components/GameScreen.jsx"
    "src/components/LoadScreen.jsx"
    "src/data/scenarios.js"
    "src/hooks/useGameState.js"
    "src/utils/glm.js"
)

for component in "${critical_components[@]}"; do
    if [ -f "$component" ]; then
        echo "  ✅ $component"
    else
        echo "  ❌ Missing component: $component"
        exit 1
    fi
done

echo ""
echo "============================================="
echo "✅ All End-to-End Tests Passed!"
echo ""
echo "📝 Next Steps:"
echo "  1. Start development server: npm run dev"
echo "  2. Preview production build: npm run preview"
echo "  3. Deploy the dist/ directory to your hosting platform"
echo ""
