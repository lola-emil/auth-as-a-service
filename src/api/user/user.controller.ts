import { Request, Response } from "express";
import UserRepo from "../../repositories/user";
import NotFoundError from "../../exceptions/NotFoundError";


export async function getUser(req: Request, res: Response) {
    const userId: number = res.locals.user.id;

    const user = await UserRepo.find({ id: userId });

    if (!user)
        throw new NotFoundError("User not found");

    return res.status(200).json(user);
}

export async function updateUser(req: Request, res: Response) {

}