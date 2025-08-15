import Joi from "joi";

const updateSchema = Joi.object({
    status: Joi.string().valid('PENDING', 'APPROVED', 'REJECTED').required(),
  });
export const updateValidator = (data: any) => {
    const {error, value} = updateSchema.validate(data);
    if (error) throw error;

    return value;
}