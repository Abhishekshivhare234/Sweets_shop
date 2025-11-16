# ⚡ Quick Reference: Running Tests

## 🚀 How to Run Tests

### Basic Commands
```bash
# Navigate to Backend folder first
cd Backend

# Run all tests
npm run test

# Run specific test file
npm run test userRegister.spec.js

# Run tests in watch mode (auto-rerun on file changes)
npm run test -- --watch

# Run with coverage report
npm run test -- --coverage

# Run only tests matching a name
npm run test -- -t "should validate"
```

---

## 📁 File Locations

```
Backend/
├── Test/                          ← All tests go here
│   ├── userRegister.spec.js       ← Your test file
│   ├── id.spec.js                 ← Basic test
│   ├── TESTING_GUIDE.md          ← Detailed guide
│   ├── HOW_TESTS_WORK.md         ← Step-by-step explanation
│   └── QUICK_REFERENCE.md         ← This file
├── src/
│   └── controllers/
│       └── user/
│           └── userRegister.js    ← Code being tested
└── jest.config.js                 ← Jest configuration
```

---

## 🎯 Test File Structure

```javascript
// 1. Import Jest functions
import { describe, it, expect, beforeEach, jest } from '@jest/globals';

// 2. Create test suite
describe('Test Suite Name', () => {
  let mockReq, mockRes;

  // 3. Setup (runs before each test)
  beforeEach(() => {
    mockReq = { body: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  });

  // 4. Group related tests
  describe('Function Name', () => {
    // 5. Individual test
    it('should do something', () => {
      // ARRANGE: Set up data
      mockReq.body = { name: 'John' };
      
      // ACT: Call function (if testing real code)
      // await functionName(mockReq, mockRes);
      
      // ASSERT: Check results
      expect(mockReq.body.name).toBe('John');
    });
  });
});
```

---

## ✅ Understanding Test Results

### Success Output
```
PASS  Test/userRegister.spec.js
  ✓ should validate that name... (8 ms)
  ✓ should check if email... (2 ms)

Test Suites: 1 passed, 1 total
Tests:       11 passed, 11 total
```

### Failure Output
```
FAIL  Test/userRegister.spec.js
  ✕ should validate that name...
    Expected: "John"
    Received: undefined
```

---

## 🔧 Common Jest Functions

| Function | Purpose |
|----------|---------|
| `describe()` | Groups related tests |
| `it()` or `test()` | Defines a single test |
| `expect()` | Makes assertions |
| `beforeEach()` | Runs before each test |
| `afterEach()` | Runs after each test |
| `jest.fn()` | Creates a mock function |

---

## 📝 Common Assertions

```javascript
// Equality
expect(value).toBe(4);
expect(obj).toEqual({ name: 'John' });

// Truthiness
expect(value).toBeTruthy();
expect(value).toBeUndefined();
expect(value).toBeNull();

// Numbers
expect(value).toBeGreaterThan(3);

// Strings
expect(str).toMatch(/pattern/);
expect(str).toContain('text');

// Functions (Mocks)
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledWith('arg');
```

---

## 🎭 Mock Objects Explained

### Mock Request (simulates HTTP request)
```javascript
mockReq = {
  body: { name: 'John', email: 'john@example.com' },
  params: { id: '123' },
  query: { page: 1 }
}
```

### Mock Response (simulates HTTP response)
```javascript
mockRes = {
  status: jest.fn().mockReturnThis(),  // res.status(200)
  json: jest.fn().mockReturnThis(),    // res.json({})
  cookie: jest.fn()                    // res.cookie('name', 'value')
}
```

---

## 🔍 What the Current Tests Do

The current `userRegister.spec.js` file contains **example/structure tests** that:

✅ **Show you:**
- How to structure tests
- What to test
- How to use mocks
- Test patterns

❌ **Don't actually:**
- Call the real controller functions
- Test the actual code behavior
- Mock database calls

**Why?** They're examples showing the structure. To make them functional, you need to:
1. Import the actual controller functions
2. Mock dependencies (User model, bcrypt, jwt)
3. Call the functions in tests
4. Assert actual responses

---

## 🐛 Troubleshooting

### Tests not running?
- Make sure you're in `Backend` folder
- Check `package.json` has test script
- Verify Jest is installed: `npm list jest`

### Can't find test file?
- Check file is in `Backend/Test/` folder
- Verify filename ends with `.spec.js` or `.test.js`
- Check `jest.config.js` testMatch pattern

### Import errors?
- Make sure imports use correct paths
- For ES modules, use `.js` extension in imports
- Check file actually exists

---

## 📚 More Resources

- **TESTING_GUIDE.md** - Complete testing guide with commands
- **HOW_TESTS_WORK.md** - Detailed step-by-step explanation
- **Jest Documentation**: https://jestjs.io/docs/getting-started

---

## 💡 Quick Tips

1. **One test = One thing** - Test one behavior per test
2. **Descriptive names** - Test names should explain what they test
3. **Arrange-Act-Assert** - Follow this pattern
4. **Test both paths** - Test success AND failure cases
5. **Keep tests independent** - Don't rely on other tests
6. **Use mocks** - Don't hit real database/APIs in tests

