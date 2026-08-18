const validateSendMessage = ({ conversationId, text }) => {
  const errors = [];

  if (!conversationId) {
    errors.push('conversationId is required');
  }

  if (!text || text.trim().length === 0) {
    errors.push('Message text is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = { validateSendMessage };