const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Company } = require('./model');
const { validateUser, validateLogin } = require('./validator');

const register = async (req, res, next) => {
  try {
    const { name, email, password, companyName } = req.body;

    const validation = validateUser({ name, email, password, companyName });
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const company = await Company.create({
      name: companyName,
      plan: 'basic'
    });

    const user = await User.create({
      name,
      email,
      passwordHash,
      companyId: company._id,
      role: 'owner'
    });

    const token = jwt.sign(
      { id: user._id, email: user.email, companyId: user.companyId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          companyId: user.companyId,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const validation = validateLogin({ email, password });
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, companyId: user.companyId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          companyId: user.companyId,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          companyId: user.companyId,
          role: user.role,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe };