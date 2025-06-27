import { Router } from "express";
import asyncHandler from "../../middlewares/asynchandler";
import * as Controller from "./auth.controller";


const router = Router();

router.post("/login", asyncHandler(Controller.login));
router.post("/register", asyncHandler(Controller.register));
router.post("/refresh", asyncHandler(Controller.refresh));

export default router;