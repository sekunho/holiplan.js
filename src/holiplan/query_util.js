query_util = {
  parse_error: (e) => {
    switch(e.code) {
      case '42501':
        return {
          code: 401,
          payload: {
            error_code: 'E001',
            message: 'E001: You are not authorized to perform said action on this resource.'
          }
        };
      default:
        return {
          code: 500,
          payload: {
            error_code: 'E002',
            message: 'E002: Something terribly wrong has happened.'
          }
        };
    }
  }
};

module.exports = query_util;
