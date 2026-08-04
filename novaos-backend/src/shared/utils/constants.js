const CONSTANTS = {
  PLANS: {
    BASIC: 'basic',
    PRO: 'pro',
    BUSINESS: 'business'
  },
  
  USER_ROLES: {
    OWNER: 'owner',
    MEMBER: 'member'
  },

  REQUEST_LIMITS: {
    BASIC: 500,
    PRO: 10000,
    BUSINESS: 'unlimited'
  },

  FILE_SIZE_LIMITS: {
    PDF: 10 * 1024 * 1024,
    IMAGE: 5 * 1024 * 1024,
    AUDIO: 25 * 1024 * 1024
  },

  API_PREFIXES: {
    AUTH: '/api/auth',
    COMMUNICATION: '/api/communication',
    SALES: '/api/sales',
    PRODUCTIVITY: '/api/productivity',
    REPORTS: '/api/reports'
  },

  STATUS_CODES: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER: 500
  }
};

module.exports = CONSTANTS;