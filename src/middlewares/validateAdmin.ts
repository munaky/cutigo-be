import { RequestHandler } from "express";
import { verifyToken } from "../utils/jwt";
import { resError } from "../utils/response-format";

export const validateAdmin: RequestHandler = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;
        if (!token) {
            resError(res, 401, 'Unauthorized!');
            return;
        };

        const decoded: any = verifyToken(token);
        if(decoded.role != 'ADMIN'){
            resError(res, 401, 'Unauthorized!');
            return;
        }

        next();
    } catch {
        resError(res, 401, 'Invalid Token');
    }
};