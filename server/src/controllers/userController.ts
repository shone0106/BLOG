import { RequestHandler } from "express";
import createHttpError from "http-errors";
import bcrypt from 'bcrypt'
import UserModel from '../models/User'


export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
    try {
        const userId = req.session.userId!
        const user = await UserModel.findById(userId).exec();
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};


interface signUpLoginBody{
    username?: string;
    password?: string;
}

export const signUp: RequestHandler<unknown, unknown, signUpLoginBody, unknown> = async (req, res, next) =>{
    const username = req.body.username;
    const password = req.body.password;

    try{
        if (!username || !password){
            throw createHttpError(400, "Parameters missing")
        }
        const existingUsername = await UserModel.findOne({ username: username }).exec();
        
        if (existingUsername) throw createHttpError(409, 'Username already taken. Please choose a different one or log in instead.')

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await UserModel.create({username: username, password: hashedPassword})

        req.session.userId = newUser._id

        res.status(201).json(newUser)
    }
    catch(error){
        next(error)
    }
}

export const login: RequestHandler<unknown, unknown, signUpLoginBody, unknown> = async (req, res, next) => {
    const username = req.body.username
    const password = req.body.password

    try{
        if (!username || !password) {
            throw createHttpError(400, "Parameters missing");
        }

        const user = await UserModel.findOne({username: username}).select("+password").exec()

        if (!user) throw createHttpError(401, "Invalid credentials")

        if(!await bcrypt.compare(password, user.password)){
            throw createHttpError(401, "Invalid credentials")
        }

        req.session.userId = user._id
        await req.session.save()
        res.status(201).json(user)
    }
    catch(error){
        next(error)
    }    
}


export const logout: RequestHandler = (req, res, next) => {
    req.session.destroy(error => {
        if (error) {
            next(error);
        } else {
            res.sendStatus(200);
        }
    });
}