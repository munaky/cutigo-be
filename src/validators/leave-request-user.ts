import Joi from "joi";

const createSchema = Joi.object({
    startDate: Joi.date()
      .iso()
      .min(new Date().toISOString().split("T")[0] as string) // ensures not earlier than today
      .required()
      .messages({
        "date.min": "Start date cannot be before today.",
        "date.base": "Start date must be a valid date in YYYY-MM-DD format.",
      }),
  
    endDate: Joi.date()
      .iso()
      .min(Joi.ref("startDate"))
      .required()
      .messages({
        "date.min": "End date cannot be before start date.",
        "date.base": "End date must be a valid date in YYYY-MM-DD format.",
      }),
  
    reason: Joi.string().required(),
  });
export const createValidator = (data: any) => {
    const {error, value} = createSchema.validate(data);
    if (error) throw error;

    return value;
}