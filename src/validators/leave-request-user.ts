import Joi from "joi";
import { supabase } from "../utils/supabase";

const createSchema = Joi.object({
    userId: Joi.number().integer().min(1).required(),
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
export const createValidator = async (data: any) => {
    const {error, value} = createSchema.validate(data);
    if (error) throw error;

    const pendingRequest = await supabase
    .from('LeaveRequest')
    .select('*')
    .eq('userId', value.userId)
    .eq('status', 'PENDING');

    if(pendingRequest.data?.length || 0 > 0) throw {
      code: 403,
       message: 'You already have a pending leave request. Please wait until it is processed before submitting another.'
      }

    return value;
}