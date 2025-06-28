import { Request, Response } from "express";
import UserRepo, { loginSchema } from "../../repositories/user";
import { User, userSchema } from "../../repositories/user";
import ValidationError from "../../exceptions/ValidationError";
import { signToken, verifyToken } from "../../utils/jwt";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../../config/constants";
import { RefreshToken } from "../../repositories/refresh-token";
import RefreshTokenRepo from "../../repositories/refresh-token";
import argon2 from "argon2";


export async function login(req: Request, res: Response) {
    const body = req.body as User;

    const { error } = loginSchema.validate(body, { abortEarly: false });

    if (!!error)
        throw new ValidationError(error.details);

    const user = (await UserRepo.find({ email: body.email }))[0];

    if (!user)
        throw new ValidationError([{
            message: "Incorrect email or password",
            path: [],
            type: ""
        }]);

    if (!(await argon2.verify(user.password, body.password)))
        throw new ValidationError([{
            message: "Incorrect email or password",
            path: [],
            type: ""
        }]);

    const accessToken = await signToken({ id: user.id }, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
    const refreshToken = await signToken({ id: user.id }, REFRESH_TOKEN_SECRET, { expiresIn: "1d" });

    await RefreshTokenRepo.insert({ token: refreshToken });

    return res.status(200).json({
        accessToken,
        refreshToken
    });
}

export async function register(req: Request, res: Response) {
    const body = req.body as User ?? {};

    const { error } = userSchema.validate(body, { abortEarly: false });

    if (!!error)
        throw new ValidationError(error.details);

    body.password = await argon2.hash(body.password);

    const result = await UserRepo.insert(body);

    return res.status(200).json({
        data: result
    });
}

export async function refresh(req: Request, res: Response) {
    const body = req.body as Partial<RefreshToken>;

    if (!body.token)
        throw new ValidationError([{
            message: "Missing refresh token",
            path: [],
            type: ""
        }]);

    const matchedToken = (await RefreshTokenRepo.find({ token: body.token }))[0];

    if (!matchedToken)
        return res.status(403).send("Invalid token");

    try {
        const decoded = await verifyToken(matchedToken.token, REFRESH_TOKEN_SECRET);

        const newAccessToken = await signToken(decoded, ACCESS_TOKEN_SECRET);

        return res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
        return res.status(403).send("Token expired or invalid");
    }
}