import { RequestHandler } from "express";
import { supabase } from "../../utils/supabase";
import { resSuccess } from "../../utils/response-format";
import { updateValidator } from "../../validators/leave-request-admin";
import { Resend } from "resend";
import { env } from "../../config/env";

export const handleGet: RequestHandler = async (req, res, next) => {
  try {
    const leaveRequests = await supabase
    .from("LeaveRequest")
    .select(`*, User(id, name, email, role)`)
    .order("status", { ascending: true })
    .limit(50);
  
    if (leaveRequests.error) throw {};

    resSuccess(res, 200, "Fetch data success!", leaveRequests.data);
  } catch (error: any) {
    next({ message: "Fetch data failed!", detail: error?.message || error });
  }
};

export const handleUpdate: RequestHandler = async (req, res, next) => {
  try {
    const leaveRequestId = req.params.leaveRequestId;
    const { status } = updateValidator(req.body);

    const leaveRequest = await supabase
      .from("LeaveRequest")
      .update({
        status,
      })
      .eq("id", leaveRequestId)
      .select()
      .single();
    if (leaveRequest.error) throw {};

    const resend = new Resend(env.RESEND_API_KEY)
    resend.emails.send({
      from: 'onboarding@resend.dev',
      to: leaveRequest.data.email,
      subject: `Your Leave Request is ${status}`,
      html: `<p>Hello ${leaveRequest.data.name}, your leave request is ${status}</p>`
    });

    resSuccess(res, 200, "Leave request updated!", leaveRequest.data);
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
