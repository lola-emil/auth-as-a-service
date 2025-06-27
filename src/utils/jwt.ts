import jwt from "jsonwebtoken";


export function signToken(payload: string | object | Buffer, secretKey: jwt.Secret, opt?: any): Promise<string | undefined> {
    opt = opt ?? { expiresIn: "15m" };

    return new Promise((resolve, reject) => {
        jwt.sign(payload, secretKey, opt, (err, token) => {
            if (err) reject(err);
            resolve(token);
        });
    });
}

export function verifyToken(token: string, secretKey: jwt.Secret): Promise<{ id: number; }> {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secretKey, {}, (err, decoded) => {
            if (err) reject(err);
            resolve(decoded as any);
        });
    });
}