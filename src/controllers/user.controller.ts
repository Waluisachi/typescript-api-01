import {Request, Response} from "express";
import logger from "../utills/logger";
import {createUser} from "../service/user.service";
import {CreateUserInput} from "../schema/user.schema";
import {omit} from "lodash";

export const createUserHandler = async (req: Request<{}, {}, CreateUserInput["body"]>, res: Response) => {
    try {
       const user = await createUser(req.body);
       return res.status(201).json({
           user: omit(user.toJSON(), "password"), 
       });
    } catch (e: any) {
        logger.error(e);
        return res.status(409);
    }
}