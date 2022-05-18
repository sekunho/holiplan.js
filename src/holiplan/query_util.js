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
      case '23502':
        return {
          code: 400,
          payload: {
            error_code: 'E002',
            message: `E002: Column '${e.column}' cannot be null`
          }
        }
      case '22P02':
        return {
          code: 400,
          payload: {
            error_code: 'E003',
            message: 'E003: Invalid data type'
          }
        }
      default:
        return {
          code: 500,
          payload: {
            error_code: 'E000',
            message: 'E000: Something terribly wrong has happened.'
          }
        };
    }
  }
};

module.exports = query_util;
