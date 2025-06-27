import { NextFunction, Request, Response } from "express";
import { ACCESS_TOKEN_SECRET } from "../config/constants";
import { verifyToken } from "../utils/jwt";



export default async function auth(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token provided" });

    try {
        const decoded = await verifyToken(token, ACCESS_TOKEN_SECRET);
        res.locals.user = decoded;
        next()
    } catch (error) {
        next(error);
    }
}