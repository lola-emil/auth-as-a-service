import { Router } from "express";
import asyncHandler from "../../middlewares/asynchandler";
import * as Controller from "./user.controller";

const router = Router();

router.get("/", asyncHandler(Controller.getUser));
router.patch("/:id", asyncHandler(Controller.updateUser));


export default router;