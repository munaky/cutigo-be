import express from "express";
import dotenv from "dotenv";
import { corsMiddleware } from "./middlewares/cors";
import {
  handleCreate as handleCreateUser,
  handleDelete as handleDeleteUser,
  handleGet as handleGetUser,
  handleUpdate as handleUpdateUser,
} from "./controllers/user-controller";
import { handleLogin } from "./controllers/auth-controller";
import { errorHandler } from "./middlewares/error-handler";
import { authMiddleware } from "./middlewares/auth";
import {
  handleDelete as handleDeleteLeaveRequestUser,
  handleGet as handleGetLeaveRequestUser,
  handleCreate as handleCreateLeaveRequest,
} from "./controllers/leave-request/user";
import { validateAdmin } from "./middlewares/validateAdmin";
import {
  handleDelete as handleDeleteLeaveRequestAdmin,
  handleGet as handleGetLeaveRequestAdmin,
  handleUpdate as handleUpdateLeaveRequest,
} from "./controllers/leave-request/admin";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(corsMiddleware);

//AUTH
app.post("/api/v1/auth/info", authMiddleware /* handleInfo */);
app.post("/api/v1/auth/login", handleLogin);

//USER
app.get("/api/v1/users/get", authMiddleware, validateAdmin, handleGetUser);
app.post(
  "/api/v1/users/create",
  authMiddleware,
  validateAdmin,
  handleCreateUser
);
app.patch(
  "/api/v1/users/update/:userId",
  authMiddleware,
  validateAdmin,
  handleUpdateUser
);
app.delete(
  "/api/v1/users/delete/:userId",
  authMiddleware,
  validateAdmin,
  handleDeleteUser
);

//USER LEAVE REQUEST
app.get(
  "/api/v1/leave-request/user/get",
  authMiddleware,
  handleGetLeaveRequestUser
);
app.post(
  "/api/v1/leave-request/user/create",
  authMiddleware,
  handleCreateLeaveRequest
);
app.delete(
  "/api/v1/leave-request/user/delete/:leaveRequestId",
  authMiddleware,
  handleDeleteLeaveRequestUser
);

//ADMIN LEAVE REQUEST
app.get(
  "/api/v1/leave-request/admin/get",
  authMiddleware,
  validateAdmin,
  handleGetLeaveRequestAdmin
);
app.patch(
  "/api/v1/leave-request/admin/update/:leaveRequestId",
  authMiddleware,
  validateAdmin,
  handleUpdateLeaveRequest
);
app.delete(
  "/api/v1/leave-request/admin/delete/:leaveRequestId",
  authMiddleware,
  validateAdmin,
  handleDeleteLeaveRequestAdmin
);

//ERROR HANDLER
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
