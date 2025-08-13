import { RequestHandler } from "express";
import { supabase } from "../utils/supabase";
import bcrypt from "bcrypt";
import { resSuccess } from "../utils/response-format";

export const handleGet: RequestHandler = async (req, res, next) => {
  try {
    const leaveRequests = await supabase
      .from("User")
      .select('id, name, email')
      .neq('role', 'ADMIN')
      .order('id', {ascending: false});
    if (leaveRequests.error) throw {};

    resSuccess(res, 200, "Fetch data success!", leaveRequests.data);
  } catch (error: any) {
    next({ message: "Fetch data failed!", detail: error?.message || error });
  }
};

export const handleCreate: RequestHandler = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const user = await supabase
      .from("User")
      .insert({
        name,
        email,
        password: hashed,
      })
      .select('id, name, email, role')
      .single();

      if(user.error) throw{}

      resSuccess(res, 200, 'New user created!', user.data);
  } catch (error: any) {
    next({ message: "Unable to add user!", detail: error?.message || error });
  }
};

export const handleUpdate: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const { name, email, password } = req.body;

    const user = await supabase
      .from("User")
      .update({
        name,
        email,
        ...(password ? {password: await bcrypt.hash(password, 10)} : {})
      })
      .eq('id', userId)
      .select('id, name, email, role')
      .single();

      if(user.error) throw{}

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
    if (user.error) throw {message: user.error};

    resSuccess(res, 200, "Delete data success!", user.data);
  } catch (error: any) {
    next({ message: "Delete data failed!", detail: error?.message || error });
  }
};

/* export const handleBulkAddUser: RequestHandler = async (req, res, next) => {
    
  
    res.json(null);
  };
 */
