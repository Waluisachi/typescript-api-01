import Session, {SchemaDocument} from "../models/session.model";
import {query} from "express";
import {FilterQuery} from "mongoose";
import {singToken, verifyToken} from "../utills/jwt.utils";
import {get} from "lodash";
import {findUser} from "./user.service";
import config from "config";

export const createSession = async (_id: string, userAgent: string) => {
    const session = await Session.create(
            {
                user: _id,
                userAgent
            }
    );

    return session.toJSON();
}

export const fetchSessions = async(query: FilterQuery<SchemaDocument>) => {
    return await Session.find(query).lean()
}


export const updateSession = async(query: FilterQuery<SchemaDocument>, update: FilterQuery<SchemaDocument>) => {
    return await Session.updateOne(query, update);
}

export const reIssueAccessToken = async ({ refreshToken}: { refreshToken: string }) => {
    const { decoded } = await verifyToken(refreshToken);

    if (!decoded || !get(decoded, "_id")) return false;

    const session = await Session.findById(get(decoded, "session"));


    if (!session || !session.is_valid) return false;

    const user = await findUser({ _id: session?.user});
    if (!user) return false;

    const accessToken = await singToken(
                {
                    ...user,
                    session: session?._id
                },
                {
                    expiresIn: config.get<number>("accessTokenTtl")
                }
            );

    return accessToken;
}