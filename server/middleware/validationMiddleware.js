import { body, validationResult } from 'express-validator';

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: 'Validation error',
      errors: errors.array().map(err => ({ field: err.param, message: err.msg }))
    });
  }
  next();
};

export const registerValidator = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('confirmPassword').custom((value, { req }) => value === req.body.password).withMessage('Passwords do not match'),
];

export const loginValidator = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

export const expenseValidator = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('amount').isFloat({ min: 0 }).withMessage('Valid amount is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
];

export const incomeValidator = [
  body('source').trim().notEmpty().withMessage('Source is required'),
  body('amount').isFloat({ min: 0 }).withMessage('Valid amount is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
];

export const budgetValidator = [
  body('totalBudget').isFloat({ min: 0 }).withMessage('Valid budget is required'),
  body('month').isInt({ min: 1, max: 12 }).withMessage('Valid month is required'),
  body('year').isInt({ min: 2000 }).withMessage('Valid year is required'),
];

export const updateProfileValidator = [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('monthlyIncome').optional().isFloat({ min: 0 }).withMessage('Valid monthly income is required'),
  body('currency').optional().isLength({ min: 1, max: 3 }).withMessage('Valid currency is required'),
];
