import DateExtension from '@joi/date';
import Joi from 'joi';
const joi = Joi.extend(DateExtension)

const customerSchema = joi.object({
    name: joi.string().required(),
    phone: joi.string().min(11).required(),
    cpf: joi.string().alphanum().min(10).max(11).required(),
    birthday: joi.date().format('YYYY-MM-DD').utc()
});

export default customerSchema;