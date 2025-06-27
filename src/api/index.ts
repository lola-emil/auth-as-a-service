import { Router } from "express";
import authRoute from "./auth/auth.route";
import userRoute from "./user/user.route";


const router = Router();

router.get("/", (req, res) => { res.send("Welcome to the API"); });
router.use("/auth", authRoute);
router.use("/me", userRoute);
export default router;