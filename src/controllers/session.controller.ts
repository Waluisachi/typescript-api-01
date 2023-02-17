import {Request, Response} from "express";
import {validatePassword} from "../service/user.service";
import {createSession, fetchSessions, updateSession} from "../service/session.service";
import {singToken} from "../utills/jwt.utils";
import config from "config";

export const createSessionHandler = async (req: Request, res: Response) => {
    //validate password
    const user = await validatePassword(req.body);
    if(!user) {
        return res.status(401).json({ error: "Invalid email or password"});
    }
    //create session
    const session = await createSession(user?._id, req.get("user-agent") || "");
    //create an access token
    const accessToken = await singToken(
            {
                ...user,
                session: session?._id
            },
            {
                expiresIn: config.get<number>("accessTokenTtl")
            }
    )
    //create a refresh token
    const refreshToken = await singToken(
                {
                    ...user,
                    session: session?._id
                },
                {
                    expiresIn: config.get<number>("refreshTokenTtl")
                }
            );


    return res.status(200).send(
            {
                accessToken,
                refreshToken
            }
    )
}

export const getUserSessionsHandler = async (req: Request, res: Response) => {
    const sessions = await fetchSessions({
        user: res.locals?.user?._id,
        is_valid: true
    });

    return res.status(200).json({sessions})
}

export const deleteSessionHandler = async (req: Request, res: Response) => {
    const sessionId = res.locals.user.session;
    console.log(sessionId)
    await updateSession(
            {
                _id: sessionId
            },
            {
                is_valid: false
            }
    )
    return res.send(
            {
                accessToken: null,
                refreshToken: null
            }
    )
}