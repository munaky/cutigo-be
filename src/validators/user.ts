import Joi from "joi";

const createSchema = Joi.object({
    name: Joi.string().required(),
    email:  Joi.string().email().required(),
    password: Joi.string().min(8).required(),
});

const updateSchema = Joi.object({
    name: Joi.string().required(),
    email:  Joi.string().email().required(),
    password: Joi.string().min(8).allow('').optional(),
});

export const createValidator = (data: any) => {
    const {error, value} = createSchema.validate(data);
    if(error) throw error;

    return value;
}

export const updateValidator = (data: any) => {
    const {error, value} = updateSchema.validate(data);
    if(error) throw error;

    return value;
}