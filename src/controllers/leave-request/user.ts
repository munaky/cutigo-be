import { RequestHandler } from "express";
import { supabase } from "../../utils/supabase";
import { resSuccess } from "../../utils/response-format";
import { signToken } from "../../utils/jwt";
import { createValidator } from "../../validators/leave-request-user";

export const handleGet: RequestHandler = async (req, res, next) => {
  try {
    const userId = (req as any).user.id;

    const leaveRequests = await supabase
      .from("LeaveRequest")
      .select()
      .eq("userId", userId)
      .order('id', {ascending: false})
      .limit(50);
    if (leaveRequests.error) throw {};

    resSuccess(res, 200, "Fetch data success!", leaveRequests.data);
  } catch (error: any) {
    next({ message: "Fetch data failed!", detail: error?.message || error });
  }
};

export const handleCreate: RequestHandler = async (req, res, next) => {
    try {
      const userId = (req as any).user.id;
      const {startDate, endDate, reason} = await createValidator({...req.body, userId});
  
      const leaveRequests = await supabase
        .from("LeaveRequest")
        .insert({
            userId, startDate, endDate, reason 
        })
        .select().single()
      if (leaveRequests.error) throw {};
  
      resSuccess(res, 200, "Leave request created!", leaveRequests.data);
    } catch (error: any) {
      next({ message: error?.message || "Failed to create leave request!", detail: error?.message || error });
    }
  };


  export const handleDelete: RequestHandler = async (req, res, next) => {
    try {
      const leaveRequestId = req.params.leaveRequestId;
      const userId = (req as any).user.id;
      const leaveRequests = await supabase
        .from("LeaveRequest")
        .delete()
        .eq('id', leaveRequestId)
        .eq('userId', userId)
        .select()
        .single();
      if (leaveRequests.error) throw {};
  
      resSuccess(res, 200, "Delete data success!", leaveRequests.data);
    } catch (error: any) {
      next({ message: "Delete data failed!", detail: error?.message || error });
    }
  };