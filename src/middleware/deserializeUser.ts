import {NextFunction, Response, Request} from "express";
import {get} from "lodash";
import {verify} from "crypto";
import {verifyToken} from "../utills/jwt.utils";
import {reIssueAccessToken} from "../service/session.service";

export const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = get(req, "headers.authorization", "").replace(/^Bearer\s/, "");
    const refreshToken = get(req, "headers.x-refresh");

    if(!accessToken){
        return next();
    }

    const { decoded, expired } = await verifyToken(accessToken);

    if(decoded){
        res.locals.user = decoded;
        return next();
    }

    if (expired && refreshToken){
         const new_access_token = await reIssueAccessToken({refreshToken});

         if (new_access_token) {
             res.setHeader("x-access-token", new_access_token);
         }

        const result = await  verifyToken(new_access_token);

         res.locals.user = (await result).decoded;
         return next();

    }

    return next();
}