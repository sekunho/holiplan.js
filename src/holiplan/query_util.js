query_util = {
  parse_error: (e) => {
    console.log(e);
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

      case 'P0002':
        return {
          code: 404,
          payload: {
            error_code: 'E004',
            message: 'E004: Resource does not exist'
          }
        }

      case '23514':
        return {
          code: 400,
          payload: {
            error_code: 'E006',
            message: `E006: Failed to insert due to violating the constraint '${e.constraint}' of table '${e.table}'.`
          }
        }

      case '23P01':
        return {
          code: 400,
          payload: {
            error_code: 'E006',
            message: `E006: Failed to insert due to violating the constraint '${e.constraint}' of table '${e.table}'.`
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
