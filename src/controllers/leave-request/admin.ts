import { RequestHandler } from "express";
import { supabase } from "../../utils/supabase";
import { resSuccess } from "../../utils/response-format";

export const handleGet: RequestHandler = async (req, res, next) => {
  try {
    const leaveRequests = await supabase
      .from("LeaveRequest")
      .select(
        `*,
        User(id, name, email, role)`
      )
      .order("id", { ascending: false });
    if (leaveRequests.error) throw {};

    resSuccess(res, 200, "Fetch data success!", leaveRequests.data);
  } catch (error: any) {
    next({ message: "Fetch data failed!", detail: error?.message || error });
  }
};

export const handleUpdate: RequestHandler = async (req, res, next) => {
  try {
    const leaveRequestId = req.params.leaveRequestId;
    const { status } = req.body;

    const leaveRequests = await supabase
      .from("LeaveRequest")
      .update({
        status,
      })
      .eq("id", leaveRequestId)
      .select()
      .single();
    if (leaveRequests.error) throw {};

    resSuccess(res, 200, "Leave request updated!", leaveRequests.data);
  } catch (error: any) {
    next({
      message: "Failed to update leave request!",
      detail: error?.message || error,
    });
  }
};

export const handleDelete: RequestHandler = async (req, res, next) => {
  try {
    const leaveRequestId = req.params.leaveRequestId;
    const leaveRequests = await supabase
      .from("LeaveRequest")
      .delete()
      .eq("id", leaveRequestId)
      .select()
      .single();
    if (leaveRequests.error) throw {};

    resSuccess(res, 200, "Delete data success!", leaveRequests.data);
  } catch (error: any) {
    next({ message: "Delete data failed!", detail: error?.message || error });
  }
};
