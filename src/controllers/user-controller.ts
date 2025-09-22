import { RequestHandler } from "express";
import { supabase } from "../utils/supabase";
import bcrypt from "bcrypt";
import { resSuccess } from "../utils/response-format";
import { createValidator, updateValidator } from "../validators/user";

export const handleGet: RequestHandler = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const offset = Number(req.query.offset) || 0;
    const search = req.query.search || '';
    const lastId = Number(req.query.lastId) || null;
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1).toISOString();  // Jan 1st
    const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999).toISOString(); // Dec 31st

    let query = supabase
      .from("User")
      .select(`
    id,
    name,
    email,
    LeaveRequest (
      id,
      createdAt
    )
  `)
      .neq("role", "ADMIN")
      .or(`name.ilike.%${search}%,email.ilike.%${search}%`)
      .order("id", { ascending: false })
      .limit(limit)
      .range(offset, offset + limit - 1);

    if (lastId && lastId > 0) {
      query = query.lt("id", lastId);
    }

    query = query.gte("LeaveRequest.createdAt", startOfYear).lte("LeaveRequest.createdAt", endOfYear);

    const { data, error } = await query;

    if (error) throw error;

    const users = data.map((u) => ({
      ...u,
      leaveRequestCount: u.LeaveRequest?.length ?? 0,
    }));

    resSuccess(res, 200, "Fetch data success!", users);
  } catch (error: any) {
    next({ message: "Fetch data failed!", detail: error?.message || error });
  }
};

export const handleCreate: RequestHandler = async (req, res, next) => {
  try {
    const { name, email, password } = createValidator(req.body);

    const hashed = await bcrypt.hash(password, 10);

    const user = await supabase
      .from("User")
      .insert({
        name,
        email,
        password: hashed,
      })
      .select(`
    id,
    name,
    email,
    LeaveRequest (
      id,
      createdAt
    )
  `)
      .single();

    if (user.error) throw {};

    (user as any).leaveRequestCount = (user as any).LeaveRequest.length ?? 0

    resSuccess(res, 200, 'New user created!', user.data);
  } catch (error: any) {
    next({ message: "Unable to add user!", detail: error?.message || error });
  }
};

export const handleUpdate: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const { name, email, password } = updateValidator(req.body);

    const user = await supabase
      .from("User")
      .update({
        name,
        email,
        ...(password ? { password: await bcrypt.hash(password, 10) } : {})
      })
      .eq('id', userId)
      .select('id, name, email, role')
      .single();

    if (user.error) throw {}

    resSuccess(res, 200, 'User updated!', user.data);
  } catch (error: any) {
    next({ message: "Unable to update user!", detail: error?.message || error });
  }
};

export const handleUpdatePassword: RequestHandler = async (req, res, next) => {
  try {
    const userId = (req as any).user.id;
    const { password } = req.body;

    const user = await supabase
      .from("User")
      .update({
        ...(password ? { password: await bcrypt.hash(password, 10) } : {})
      })
      .eq('id', userId)
      .select('id, name, email, role')
      .single();

    if (user.error) throw {}

    resSuccess(res, 200, 'User updated!', user.data);
  } catch (error: any) {
    next({ message: "Unable to update user!", detail: error?.message || error });
  }
};


export const handleDelete: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await supabase
      .from("User")
      .delete()
      .eq('id', userId)
      .select('id, name, email, role')
      .single();
    if (user.error) throw { message: user.error };

    resSuccess(res, 200, "Delete data success!", user.data);
  } catch (error: any) {
    next({ message: "Delete data failed!", detail: error?.message || error });
  }
};