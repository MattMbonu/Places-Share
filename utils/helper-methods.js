exports.checkNotFound = (entityName, entity, id) => {
  if (!entity) {
    throw new HttpError(`Could not find ${entityName} with id ${id}`, 404);
  }
};

exports.validate = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid request input", 400);
  }
};
