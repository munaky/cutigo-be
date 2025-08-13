import { RequestHandler } from "express";
import { supabase } from "../utils/supabase";
import bcrypt from "bcrypt";
import { resSuccess } from "../utils/response-format";
import { signToken } from "../utils/jwt";

export const handleLogin: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;

  const user = await supabase.from("User")
  .select()
  .eq("email", email)
  .single();
  if(user.error) throw {message: user.error};

  const passwordMatched = await bcrypt.compare(password, user.data.password);
  if(!passwordMatched) throw {};
  
  const token = signToken(user.data)

  resSuccess(res, 200, 'Login success!', {
    user: {
      id: user.data.id,
      name: user.data.name,
      email: user.data.email,
      role: user.data.role,
    },
    token
  })
  } catch (error: any) {
    next({ message: 'Invalid login!',detail: error?.message || error });
  }
};
