const errorCodes = {
  400: 'The request was improperly formatted, or the server couldn\'t understand it.',
  401: 'The Authorization header was missing or invalid.',
  403: 'The Authorization token you passed did not have permission to the resource.',
  405: 'The HTTP method used is not valid for the location specified.',
  429: 'You are being rate limited, see Rate Limits.',
  502: 'There was not a gateway available to process your request. Wait a bit and retry.'
};

module.exports.getError = (error) => {
  if (error.response) {
    return `${error.response.status} : ${errorCodes[error.response.status]}` || 'Unknown error';
  }
  return error.message;
};