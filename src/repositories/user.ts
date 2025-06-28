import Joi from "joi";
import CrudRepo from "../utils/crudrepo";

export type User = {
    id: number;
    firstname?: string;
    middlename?: string;
    lastname?: string;

    email: string;
    password: string;

    isVerified?: boolean;
};


export const userSchema = Joi.object({
    firstname: Joi.string().optional(),
    middlename: Joi.string().optional(),
    lastname: Joi.string().optional(),

    email: Joi.string().email().required(),
    password: Joi.string().alphanum().min(6)
});

export const patchUserSchema = userSchema.min(1);

export const loginSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
});

export default new CrudRepo<User>("user");