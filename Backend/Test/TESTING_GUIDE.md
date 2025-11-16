# Complete Guide: How to Run and Understand Tests

## 📍 How to Run Tests

### Step 1: Navigate to Backend Directory
```bash
cd Backend
```

### Step 2: Run All Tests
```bash
npm run test
```

### Step 3: Run Specific Test File
```bash
npm run test userRegister.spec.js
```

### Step 4: Run Tests in Watch Mode (Auto-rerun on changes)
```bash
npm run test -- --watch
```

### Step 5: Run Tests with Coverage Report
```bash
npm run test -- --coverage
```

---

## 🔍 Understanding the Test File Structure

### 1. **Imports** (Line 1)
```javascript
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
```
- `describe`: Groups related tests together
- `it` or `test`: Defines a single test case
- `expect`: Makes assertions (checks if something is true)
- `beforeEach`: Runs before each test (setup)
- `jest`: Provides mocking functions

### 2. **Test Suite** (Line 10)
```javascript
describe('User Registration Controller - Example Tests', () => {
```
- Groups all tests for the User Registration Controller
- Creates a test suite

### 3. **Setup (beforeEach)** (Line 13-26)
```javascript
beforeEach(() => {
  mockReq = { body: {} };
  mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    // ...
  };
});
```
- Runs before EACH test
- Creates fresh mock objects for each test
- `jest.fn()` creates a mock function
- `mockReturnThis()` allows chaining like `res.status(200).json()`

### 4. **Individual Test** (Line 29-49)
```javascript
it('should validate that name, email, and password are required', () => {
  // ARRANGE: Set up test data
  mockReq.body = { name: 'John Doe' };
  
  // ACT: (In real test, call the function here)
  
  // ASSERT: Check the results
  expect(mockReq.body.email).toBeUndefined();
});
```

---

## 🎯 How Tests Work: The Three A's Pattern

### **ARRANGE** - Set up your test data
```javascript
mockReq.body = {
  name: 'John Doe',
  email: 'test@example.com',
  password: 'password123'
};
```

### **ACT** - Execute the function you're testing
```javascript
await registerUser(mockReq, mockRes);
```

### **ASSERT** - Verify the expected outcome
```javascript
expect(mockRes.status).toHaveBeenCalledWith(201);
expect(mockRes.json).toHaveBeenCalledWith({
  message: 'User registered',
  user: { ... }
});
```

---

## 📊 Understanding Test Results

When you run `npm run test`, you'll see:

```
PASS  Test/userRegister.spec.js
  ✓ User Registration Controller - Example Tests
    ✓ registerUser - Test Examples
      ✓ should validate that name, email, and password are required (2ms)
      ✓ should check if email already exists in database (1ms)
      ✓ should successfully register a new user (1ms)
    ✓ loginUser - Test Examples
      ✓ should require email and password (1ms)
      ✓ should reject login if user does not exist (1ms)
      ✓ should reject login if password is incorrect (1ms)
      ✓ should successfully login with correct credentials (1ms)
    ✓ logoutUser - Test Examples
      ✓ should clear the authentication cookie (1ms)
    ✓ Test Structure Guidelines
      ✓ demonstrates the Arrange-Act-Assert pattern (1ms)
      ✓ shows how to test error cases (1ms)
      ✓ shows how to test success cases (1ms)

Test Suites: 1 passed, 1 total
Tests:       12 passed, 12 total
```

### What This Means:
- ✅ **PASS**: Test passed
- ❌ **FAIL**: Test failed (you'll see error details)
- **Test Suites**: Number of test files
- **Tests**: Total number of individual test cases

---

## 🔧 Current Test File Status

**Note**: The current `userRegister.spec.js` file contains **example/structure tests** that demonstrate:
- How to set up tests
- What to test
- Test patterns

**They don't actually call the real controller functions yet** because:
- ES modules require special mocking setup
- Database connections need to be mocked
- External dependencies (bcrypt, jwt) need mocking

---

## 🚀 Next Steps: Making Tests Functional

To make tests actually test your controller functions, you need to:

1. **Mock the dependencies** (User model, bcrypt, jwt)
2. **Import the actual controller functions**
3. **Call the functions in your tests**
4. **Assert the actual responses**

See `userRegister.working.spec.js` for a complete working example!

---

## 📝 Common Jest Matchers

```javascript
// Equality
expect(value).toBe(4);                    // Exact equality (===)
expect(value).toEqual({ name: 'John' }); // Deep equality

// Truthiness
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeDefined();
expect(value).toBeUndefined();
expect(value).toBeNull();

// Numbers
expect(value).toBeGreaterThan(3);
expect(value).toBeLessThan(5);
expect(value).toBeGreaterThanOrEqual(3.5);

// Strings
expect(str).toMatch(/pattern/);
expect(str).toContain('substring');

// Arrays
expect(array).toContain('item');
expect(array).toHaveLength(3);

// Objects
expect(obj).toHaveProperty('key');
expect(obj).toMatchObject({ name: 'John' });

// Functions (Mocks)
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
expect(mockFn).toHaveBeenCalledTimes(2);
expect(mockFn).toHaveReturnedWith('value');
```

---

## 🐛 Debugging Tests

### Run a single test:
```bash
npm run test -- -t "should validate that name"
```

### See verbose output:
```bash
npm run test -- --verbose
```

### Stop on first failure:
```bash
npm run test -- --bail
```

---

## ✅ Best Practices

1. **One assertion per test** (when possible)
2. **Test one thing at a time**
3. **Use descriptive test names**
4. **Keep tests independent** (don't rely on other tests)
5. **Clean up after tests** (use `beforeEach`/`afterEach`)
6. **Test both success and failure cases**
7. **Mock external dependencies** (database, APIs, etc.)

