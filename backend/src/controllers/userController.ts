import { RequestHandler } from "express";
import UserModel from '../models/user';
import createHttpError from "http-errors";
import bcrypt from 'bcrypt';
import mongoose, { ObjectId } from "mongoose";

export const getUsers:RequestHandler = async (req, res, next) => {
    try {
        const users = await UserModel.find().exec();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;
    console.log(authenticatedUserId);
    try {
        if (!authenticatedUserId) {
            throw createHttpError(401, 'User Not authenticated');
        }

        const user = await UserModel
            .findById(authenticatedUserId)
            .select("+email")
            .exec();
        res.status(200).json(user);
        console.log(user);
    } catch (error) {
        next(error);
    }
};

interface SignUpBody {
    name: string,
    surname?: string,
    email: string,
    password: string,
    phone_number?: string,
    occupation?: string,
    role: string,
    orders?: ObjectId[],
    glass_reg?: ObjectId[]
}

export const signUp: RequestHandler<unknown, unknown, SignUpBody, unknown> = async (req, res, next) => {
    const name = req.body.name;
    const surname = req.body.surname;
    const email = req.body.email;
    const passwordRaw = req.body.password;
    const phoneNumber = req.body.phone_number;
    const occupation = req.body.occupation;
    const role = req.body.role;

    try {
        if (!name || !role || !email || !passwordRaw) {
            throw createHttpError(400, 'Parameters missing');
        }

        const existingEmail = await UserModel.findOne({email: email}).exec();
        if (existingEmail) {
            throw createHttpError(409, 'A user with this email address already exists. Please log-in instead')
        }
        
        const passwordHashed = await bcrypt.hash(passwordRaw, 10);

        const newUser = await UserModel.create<SignUpBody>({
            name: name,
            surname: surname,
            email: email,
            password: passwordHashed,
            phone_number: phoneNumber,
            occupation: occupation,
            role: role,
            orders: [],
            glass_reg: []

        });
        
        req.session.userId = new mongoose.Types.ObjectId(newUser._id);

        res.status(201).json(newUser);
    } catch (error) {
        next(error); 
    }
};

interface LoginBody {
    email: string,
    password: string,
}

export const login: RequestHandler<unknown, unknown, LoginBody, unknown> = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        if (!email || !password) {
            throw createHttpError(400, 'Parameters missing');
        }

        const user = await UserModel.findOne({email: email}).select('+password +email').exec();

        if(!user) {
            throw createHttpError(401, 'Invalid credentials');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            throw createHttpError(401, 'Invalid credentials');
        }

        req.session.userId = user._id;

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

export const logout: RequestHandler = (req, res, next) => {
    req.session.destroy(error => {
        if (error) {
            next(error);
        } else {
            res.sendStatus(200);
        }

    })
}