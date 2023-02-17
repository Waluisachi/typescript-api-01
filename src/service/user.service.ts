import {DocumentDefinition, FilterQuery} from "mongoose";
import User, { UserDocument} from "../models/user.model";
import {omit} from "lodash";
import {query} from "express";

export const createUser = async (input: DocumentDefinition<Omit<UserDocument, "createdAt" | "updatedAt" | "comparePassword">>) => {
    try {
        return await User.create(input);
    } catch (e: any) {
        throw new Error(e);
    }
}

export const validatePassword = async({email, password}: {email: string, password: string}) => {
    const user = await User.findOne({email});

    if(!user){
        return false;
    }

    const is_valid = await user.comparePassword(password);

    if(!is_valid) return false;

    return omit(user.toJSON(), "password");
}

export const findUser = async (query: FilterQuery<UserDocument>) => {
    return await User.findOne(query).lean();
}