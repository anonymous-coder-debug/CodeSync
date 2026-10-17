const ApiError = require('../utils/ApiError');

// Simple, dependency-free field validation middleware factory.
// rules: { fieldName: { required, minLength, maxLength, pattern, message } }
const validate = (rules) => (req, res, next) => {
  const errors = [];

  Object.entries(rules).forEach(([field, rule]) => {
    const value = req.body[field];

    if (rule.required && (value === undefined || value === null || String(value).trim() === '')) {
      errors.push(`${field} is required`);
      return;
    }

    if (value !== undefined && value !== null) {
      const strValue = String(value);
      if (rule.minLength && strValue.length < rule.minLength) {
        errors.push(rule.message || `${field} must be at least ${rule.minLength} characters`);
      }
      if (rule.maxLength && strValue.length > rule.maxLength) {
        errors.push(rule.message || `${field} must be at most ${rule.maxLength} characters`);
      }
      if (rule.pattern && !rule.pattern.test(strValue)) {
        errors.push(rule.message || `${field} is invalid`);
      }
    }
  });

  if (errors.length > 0) {
    throw new ApiError(400, 'Validation failed', errors);
  }

  next();
};

module.exports = validate;
