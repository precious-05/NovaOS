const validateUser = (data) => {
  const errors = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }

  if (!data.email) {
    errors.push('Email is required');
  } else {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(data.email)) {
      errors.push('Please provide a valid email address');
    }
  }

  if (!data.password) {
    errors.push('Password is required');
  } else if (data.password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (!data.companyName || data.companyName.trim().length < 2) {
    errors.push('Company name must be at least 2 characters long');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

const validateLogin = (data) => {
  const errors = [];

  if (!data.email) {
    errors.push('Email is required');
  } else {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(data.email)) {
      errors.push('Please provide a valid email address');
    }
  }

  if (!data.password) {
    errors.push('Password is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = { validateUser, validateLogin };