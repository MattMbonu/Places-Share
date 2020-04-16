class HttpError extends Error {
  constructor(message, errorCode) {
    super(message); //Adds default message property
    this.code = errorCode;
  }
}

module.exports = HttpError;
