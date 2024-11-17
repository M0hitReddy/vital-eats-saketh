import express from "express"
import { getUser, loginUser,registerUser } from "../controllers/userController.js"

const userRouter = express.Router()

userRouter.post("/register",registerUser)
userRouter.post("/login",loginUser)
userRouter.get("/me",getUser)

export default userRouter;