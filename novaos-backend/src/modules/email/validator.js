const validateEmailReply = ({ emailId, replyText }) => {
  const errors = [];

  if (!emailId) {
    errors.push('emailId is required');
  }

  if (!replyText || replyText.trim().length === 0) {
    errors.push('Reply text is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = { validateEmailReply };