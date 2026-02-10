# Contributing to Stock Monitoring App

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive feedback
- Keep discussions relevant to the project

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details (OS, Node version, etc.)

### Suggesting Features

Feature requests are welcome! Please include:
- Clear description of the feature
- Use cases and benefits
- Potential implementation approach
- Any relevant examples or mockups

### Code Contributions

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Test your changes**
5. **Commit with clear messages**
   ```bash
   git commit -m "Add feature: description"
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Create a Pull Request**

## Development Guidelines

### Code Style

**Backend (Node.js)**:
- Use ES6+ features
- Follow async/await pattern
- Include error handling
- Add comments for complex logic
- Use descriptive variable names

**Frontend (React)**:
- Use functional components with hooks
- Keep components focused and reusable
- Follow React best practices
- Use descriptive prop names
- Add PropTypes or TypeScript types

### File Structure

```
backend/
├── config/          # Configuration files
├── middleware/      # Express middleware
├── routes/          # API routes
├── services/        # Business logic
└── models/          # Database models (future)

frontend/
├── src/
│   ├── components/  # Reusable components
│   ├── pages/       # Page components
│   ├── context/     # React context
│   ├── services/    # API services
│   └── utils/       # Utility functions
```

### Naming Conventions

- **Files**: camelCase (e.g., `stockService.js`)
- **Components**: PascalCase (e.g., `StockCard.js`)
- **Functions**: camelCase (e.g., `fetchStockData`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
- **Database tables**: snake_case (e.g., `watchlist_stocks`)

### Testing

Before submitting a PR:
1. Test all functionality manually
2. Ensure no console errors
3. Test on different screen sizes (for UI changes)
4. Verify API endpoints work correctly
5. Check for memory leaks or performance issues

### Commit Messages

Use clear, descriptive commit messages:
- `feat: Add stock charting functionality`
- `fix: Resolve authentication token expiry issue`
- `docs: Update API documentation`
- `refactor: Improve stock data fetching logic`
- `style: Format code with prettier`
- `test: Add tests for watchlist routes`

## Areas for Contribution

### High Priority
- [ ] Add unit tests for backend services
- [ ] Add integration tests for API endpoints
- [ ] Implement frontend tests with React Testing Library
- [ ] Add charting with Chart.js
- [ ] Improve error handling and user feedback
- [ ] Add loading states and animations

### Medium Priority
- [ ] Support for multiple watchlists per user
- [ ] Advanced alert types (RSI, moving averages)
- [ ] Export reports as PDF
- [ ] Dark mode support
- [ ] Mobile responsive improvements
- [ ] News integration

### Future Enhancements
- [ ] Real-time WebSocket updates
- [ ] Social features (share watchlists)
- [ ] Advanced analytics dashboard
- [ ] AI-powered stock recommendations
- [ ] Portfolio backtesting
- [ ] Mobile app (React Native)

## API Development

When adding new endpoints:
1. Add route in `backend/routes/`
2. Implement business logic in `backend/services/`
3. Add authentication middleware if needed
4. Update API documentation
5. Test with cURL or Postman
6. Add error handling

Example endpoint structure:
```javascript
router.post('/endpoint', authMiddleware, async (req, res) => {
  try {
    // Validate input
    // Process request
    // Return response
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error message' });
  }
});
```

## Database Changes

When modifying the database:
1. Update `database/schema.sql`
2. Create migration script if needed
3. Update relevant models/services
4. Document the changes
5. Test with sample data

## Frontend Development

When adding new components:
1. Create component in `frontend/src/components/`
2. Add corresponding CSS file
3. Import and use in pages
4. Ensure responsive design
5. Handle loading and error states

Component template:
```jsx
import React, { useState, useEffect } from 'react';
import './ComponentName.css';

const ComponentName = ({ prop1, prop2 }) => {
  const [state, setState] = useState(null);

  useEffect(() => {
    // Side effects
  }, []);

  return (
    <div className="component-name">
      {/* Component content */}
    </div>
  );
};

export default ComponentName;
```

## Pull Request Process

1. **Update documentation** if needed
2. **Add tests** for new features
3. **Ensure all tests pass**
4. **Update CHANGELOG.md**
5. **Request review** from maintainers
6. **Address review feedback**
7. **Wait for approval** before merging

### PR Checklist
- [ ] Code follows project style guidelines
- [ ] Changes are tested and working
- [ ] Documentation is updated
- [ ] Commit messages are clear
- [ ] No console errors or warnings
- [ ] PR description explains changes clearly

## Getting Help

- **Questions?** Open a discussion on GitHub
- **Bug?** Create an issue with details
- **Chat?** Join our community (link TBD)
- **Email?** Contact maintainers (link TBD)

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Given credit in documentation

Thank you for contributing to make this project better! 🎉
