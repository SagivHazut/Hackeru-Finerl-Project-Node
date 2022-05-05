const Joi = require("joi");

function validateCard(womenCard) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(256).required(),
    description: Joi.string().min(10).max(1024).required(),
    phone: Joi.string().min(2).max(14).required(),
    image: Joi.string().min(11).max(256),
  });
  return schema.validate(womenCard);
}
exports.validateCard = validateCard;
