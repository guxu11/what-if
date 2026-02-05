# Contributing to What-If Game

Thank you for your interest in contributing! This document provides guidelines for contributing to the What-If Game project.

## 🤝 How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:
- A clear description of the problem
- Steps to reproduce the bug
- Expected vs actual behavior
- Browser and OS information
- Screenshots if applicable

### Suggesting Features

We welcome feature suggestions! Please:
- Check if the feature has already been requested
- Describe the feature clearly and concisely
- Explain why the feature would be useful
- Consider how it fits with the game's core philosophy

### Code Contributions

#### Setting Up Development Environment

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone git@github.com:YOUR_USERNAME/what-if.git
   cd what-if
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

#### Development Workflow

1. Make your changes
2. Write/update tests
3. Ensure all tests pass:
   ```bash
   npm test
   npm run build
   ```
4. Commit your changes with a clear message
5. Push to your fork
6. Create a pull request

#### Code Style Guidelines

- Use functional components with hooks
- Follow React best practices
- Use meaningful variable and function names
- Add comments for complex logic
- Keep components small and focused
- Write tests for new features

### Adding Scenarios

To add a new scenario:

1. Open `src/data/scenarios.js`
2. Add your scenario following this structure:

```javascript
{
  id: 'unique-id',
  title: 'Scenario Title',
  description: 'Brief description',
  icon: '🎮',
  color: '#hexcolor',
  start: {
    text: 'Opening narrative...',
    choices: [
      {
        text: 'First choice',
        outcome: 'unique-outcome-id',
        next: {
          text: 'Narrative after this choice...',
          choices: [
            {
              text: 'Continue',
              reflection: 'Final insight text...'
            }
          ]
        }
      }
    ]
  }
}
```

3. Follow the branching pattern (2-3 levels deep)
4. Include meaningful reflections at endpoints
5. Test your scenario thoroughly

### Adding Tests

We use Vitest and React Testing Library.

#### Example Test Structure

```javascript
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { YourComponent } from '../components/YourComponent';

describe('YourComponent', () => {
  it('renders correctly', () => {
    const { getByText } = render(<YourComponent />);
    expect(getByText('Expected text')).toBeInTheDocument();
  });
});
```

## 📋 Pull Request Process

1. Ensure your code follows our style guidelines
2. Update documentation if needed
3. Add or update tests
4. All tests must pass
5. Update the README if you've changed features
6. Create a descriptive PR title and description

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe how you tested your changes

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code where necessary
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix works
- [ ] New and existing tests pass locally
```

## 🎯 Project Goals

The What-If Game aims to:
- Help people explore life's "what if" scenarios
- Encourage reflection on the present moment
- Provide a meditative, thoughtful experience
- Be accessible and easy to use

Contributions should align with these goals.

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 💬 Questions?

Feel free to open an issue with any questions or reach out to the maintainers.

Thank you for contributing! 🎉
