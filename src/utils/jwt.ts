import jwt from "jsonwebtoken";


export function signToken(payload: string | object | Buffer, secretKey: jwt.Secret, opt?: jwt.SignOptions): Promise<string | undefined> {

    return new Promise((resolve, reject) => {
        jwt.sign(payload, secretKey)
        jwt.sign(payload, secretKey, opt ?? {}, (err, token) => {
            if (err) reject(err);
            resolve(token);
        });
    });
}

export function verifyToken(token: string, secretKey: jwt.Secret): Promise<{ id: number; }> {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) reject(err);
            resolve(decoded as any);
        });
    });
}