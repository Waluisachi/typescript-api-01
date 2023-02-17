import jwt from 'jsonwebtoken';
import config from "config";

const privateKey = config.get<string>("privateKey");
const publicKey = config.get<string>("publicKey");

export const singToken  = async (payload: Object, options?: jwt.SignOptions | undefined) => {
    return jwt.sign(
            payload,
            privateKey,
            {
                ...(options && options),
                algorithm: "RS256"
            }
            );
}

export const verifyToken = async (token: string) => {
    try {
        const decoded = jwt.verify(token, publicKey);

        return (
                {
                    valid: true,
                    expired: false,
                    decoded
                }
        )
    } catch (e: any) {
        return (
                {
                    valid: false,
                    expired: e.message === "jwt expired",
                    decoded: null
                }
                )
    }
}