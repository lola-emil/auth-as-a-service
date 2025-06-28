import { Request, Response } from "express";
import UserRepo, { patchUserSchema, User } from "../../repositories/user";
import NotFoundError from "../../exceptions/NotFoundError";
import ValidationError from "../../exceptions/ValidationError";


export async function getUser(req: Request, res: Response) {
    const userId: number = res.locals.user.id;

    const user = await UserRepo.find({ id: userId });

    if (!user)
        throw new NotFoundError("User not found");

    return res.status(200).json(user);
}

export async function updateUser(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const body = req.body as Partial<User> ?? {};

    const { error } = patchUserSchema.validate(body, { abortEarly: false });

    if (error)
        throw new ValidationError(error.details);

    const user = await UserRepo.update(id, body);

    return res.status(200).json(user);
}