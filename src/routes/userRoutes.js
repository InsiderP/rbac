const express = require('express');
const { body } = require('express-validator');
const { auth, authorize } = require('../middleware/auth');
const userController = require('../controllers/userController');

const router = express.Router();

// Validation middleware
const validateUser = [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('role').optional().isIn(['admin', 'user']).withMessage('Invalid role')
];

// Routes
router.post('/users', validateUser, userController.addUser);
router.get('/users', auth, authorize('admin'), userController.listUsers);
router.get('/users/:id', auth, userController.viewUser);
router.patch('/users/:id', auth, userController.updateUser);

module.exports = router; 