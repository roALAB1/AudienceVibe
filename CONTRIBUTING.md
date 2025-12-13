# Contributing to AudienceVibe

Thank you for your interest in contributing to AudienceVibe! We welcome contributions from the community and are grateful for your support.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Community](#community)

## Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow. Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before contributing.

## Getting Started

Before you begin:

- Make sure you have a GitHub account
- Check the [existing issues](https://github.com/roALAB1/AudienceVibe/issues) to see if your concern has already been reported
- Read our [README.md](README.md) to understand the project structure and goals

## Development Setup

### Prerequisites

- Node.js 22+ (recommended)
- pnpm 10.4.1+
- Git
- AudienceLab API key (for testing API integration)

### Installation

```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/YOUR_USERNAME/AudienceVibe.git
cd AudienceVibe

# Add upstream remote
git remote add upstream https://github.com/roALAB1/AudienceVibe.git

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Run development server
pnpm dev
```

### Verify Your Setup

```bash
# Run type checking
pnpm check

# Run tests
pnpm test

# Run linter
pnpm lint

# Build the project
pnpm build
```

All commands should complete without errors.

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue using the [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.md). Include:

- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details (OS, browser, Node.js version)

### Suggesting Features

For feature requests, use the [Feature Request template](.github/ISSUE_TEMPLATE/feature_request.md). Include:

- Clear description of the feature
- Problem it solves
- Proposed solution
- Use cases and benefits

### Submitting Changes

1. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our [coding standards](#coding-standards)

3. **Write tests** for your changes

4. **Run the test suite**:
   ```bash
   pnpm test
   pnpm check
   pnpm lint
   ```

5. **Commit your changes** with a clear commit message:
   ```bash
   git commit -m "feat: add new feature"
   ```

6. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Open a Pull Request** using our [PR template](.github/pull_request_template.md)

## Pull Request Process

### Before Submitting

- [ ] Code follows the project's style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added and passing
- [ ] README.md updated if needed

### PR Guidelines

- **Title**: Use conventional commit format (e.g., `feat:`, `fix:`, `docs:`)
- **Description**: Clearly explain what and why
- **Link issues**: Reference related issues with `Fixes #123`
- **Keep it focused**: One feature/fix per PR
- **Update tests**: Add tests for new functionality
- **Update docs**: Keep documentation in sync

### Review Process

1. Automated CI/CD checks must pass
2. At least one maintainer review required
3. Address all review comments
4. Squash commits if requested
5. Maintainer will merge when approved

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Enable strict mode
- Avoid `any` types
- Use interfaces for object shapes
- Document complex types

### React

- Use functional components with hooks
- Follow React best practices
- Use proper prop types
- Implement error boundaries
- Handle loading and error states

### Styling

- Use Tailwind CSS utility classes
- Follow existing design patterns
- Use shadcn/ui components when available
- Ensure responsive design
- Test on multiple browsers

### Code Style

- Use Prettier for formatting
- Follow ESLint rules
- Use meaningful variable names
- Keep functions small and focused
- Add comments for complex logic

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Test additions or changes
- `chore:` Build process or tooling changes

Examples:
```
feat: add search functionality to audiences page
fix: resolve pagination bug on pixels page
docs: update API integration guide
```

## Testing Guidelines

### Writing Tests

- Write tests for all new features
- Maintain or improve code coverage
- Test edge cases and error scenarios
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run specific test file
pnpm test path/to/test.ts
```

### Test Structure

```typescript
describe('Feature Name', () => {
  it('should do something specific', () => {
    // Arrange
    const input = 'test';
    
    // Act
    const result = functionUnderTest(input);
    
    // Assert
    expect(result).toBe('expected');
  });
});
```

## Documentation

### Code Documentation

- Add JSDoc comments for functions and classes
- Document complex algorithms
- Explain non-obvious code
- Keep comments up to date

### README Updates

Update README.md when:
- Adding new features
- Changing installation steps
- Updating dependencies
- Modifying configuration

### API Documentation

Document new API endpoints:
- Request/response formats
- Parameters and types
- Error responses
- Usage examples

## Community

### Getting Help

- **Issues**: [GitHub Issues](https://github.com/roALAB1/AudienceVibe/issues)
- **Discussions**: [GitHub Discussions](https://github.com/roALAB1/AudienceVibe/discussions)
- **Email**: support@audiencelab.io

### Stay Updated

- Watch the repository for updates
- Follow release notes
- Join community discussions

## License

By contributing to AudienceVibe, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to AudienceVibe!** 🎉

Your contributions help make this project better for everyone.
