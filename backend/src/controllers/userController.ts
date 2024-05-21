import bcrypt from 'bcrypt';
import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose, { ObjectId } from "mongoose";
import multer from "multer";
import UserModel from '../models/user';
import fs from 'fs';
import path from 'path';

// set up storage directory
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/profile-images');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// Get users
export const getUsers:RequestHandler = async (req, res, next) => {
    try {
        const users = await UserModel.find().exec();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

// Get authentificated user
export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
    try {
        const user = await UserModel
            .findById(req.session.userId)
            .select('+email')
            .exec();
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

// Update created user
interface updateUserParams {
    userId: string,
    [key: string]: string,
}

interface updateCreatedUser {
    name?: string,
    surname?: string,
    email?: string,
    phone_number?: string,
    occupation?: string,
    profile_image?: string,

}

// Middleware to handle file upload for profile image
export const handleFileUpload: RequestHandler = (req, res, next) => {
    const uploadMiddleware = upload.single('profile_image');
    uploadMiddleware(req, res, function (err) {
    if (err) {
    // Handle error
    return next(err);
    }
    // Check if a file was uploaded
    if (req.file) {
    // Set the profile_image field to the file path or URL
    req.body.profile_image = req.file; // Update this line with the appropriate field from req.file
    }
    // Call next middleware
      next();
    });
};


// Request handler for updating user
export const updateUser: RequestHandler<updateUserParams, unknown, updateCreatedUser> = async (req, res, next) => {

    // Extract other updated user data from the request body    
    const { name, surname, email, phone_number, occupation } = req.body;
    
    try {
        const userId = req.session.userId;
        if (!userId || !mongoose.isValidObjectId(userId)) {
            throw createHttpError(400, 'Invalid user id');
        }
        
        const user = await UserModel.findByIdAndUpdate(userId).exec();
        if (!user) {
            throw createHttpError(404, 'User not found');
        }
        
        if (name) user.name = name;
        if (surname) user.surname = surname;
        if (email) user.email = email;
        if (phone_number) user.phone_number = phone_number;
        if (occupation) user.occupation = occupation;
        if (req.file) user.profile_image = req.file.originalname;

        const updatedUser = await user.save();

        res.status(200).json(updatedUser);
    } catch (error) {
        next(error);
    }
};

// SignUp
interface SignUpBody {
    name: string,
    surname?: string,
    email: string,
    password: string,
    phone_number?: string,
    occupation?: string,
    role: string,
    profile_image?: string,
    orders?: ObjectId[],
    glass_reg?: ObjectId[],
}

export const updateUserByAdmin: RequestHandler<{_id: string}, unknown, SignUpBody, unknown> = async (req, res, next) => {
    const { name, surname, email, password, phone_number, occupation, role } = req.body;
    const adminId = req.session.userId;
    try {
        if (!adminId || !mongoose.isValidObjectId(adminId)) {
            throw createHttpError(404, 'Admin not found');
        }

        const admin = await UserModel.findById(adminId).exec();
        if (!admin) {
            throw createHttpError(404, 'Admin not found');
        }

        const user = await UserModel.findById(req.params._id).select('+password').exec();
        if (!user) {
            throw createHttpError(404, 'User not found');
        }

        if (admin?.role !== 'admin' && admin?.role !== 'superadmin') {
            throw createHttpError(403, 'Admin anauthorized');
        }

        if (name) user.name = name;
        if (surname) user.surname = surname;
        if (email) user.email = email;
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }
        if (phone_number) user.phone_number = phone_number;
        if (occupation) user.occupation = occupation;
        if (role && (role === 'admin' || role === 'superadmin' || role === 'user')) user.role = role;

        const editedUser = await user.save()

        res.status(200).json(editedUser);
        
    } catch (error) {
        next(error);
    }
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
            profile_image: '',
            orders: [],
            glass_reg: []

        });
        
        req.session.userId = newUser._id;

        res.status(201).json(newUser);
    } catch (error) {
        next(error); 
    }
};

interface LoginBody {
    email?: string,
    password?: string,
}

// Login
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

// Logout
export const logout: RequestHandler = (req, res, next) => {
    req.session.destroy(error => {
        if (error) {
            next(error);
        } else {
            res.setHeader('Cache-Control', 'no-store');
            res.clearCookie('connect.sid');
            res.sendStatus(200);
        }

    })
};

export const deleteUser: RequestHandler<unknown, unknown, {_id: string}> = async (req, res, next) => {
    const userId = req.body._id;
    if (!userId) {
        return res.status(400).json({ message: 'User doesn\'t exist' });
    }

    if (!userId || !mongoose.isValidObjectId(userId)) {
        throw createHttpError(400, 'Invalid user id');
    }

    try {
        await UserModel.findByIdAndDelete(userId).exec();

        res.status(200).send({ message: 'User has been deleted' });
    } catch (error) {
        next(error);
    }
    
}


export const deleteFile: RequestHandler<updateUserParams, unknown, { profile_image: string }> = async (req, res, next) => {
    const { profile_image } = req.body;

    // Check if fileName is not provided
    if (!profile_image) {
        return res.status(400).json({ message: 'File name not provided in the request body' });
    }

    const userId = req.session.userId;
    if (!userId || !mongoose.isValidObjectId(userId)) {
        throw createHttpError(400, 'Invalid user id');
    }
    
    const user = await UserModel.findByIdAndUpdate(userId).exec();
    if (!user) {
        throw createHttpError(404, 'User not found');
    }

    const filePath = path.join(process.cwd(), 'uploads/profile-images', profile_image);
    try {
        fs.stat(filePath, async (err, stats) => {
            if (err || !stats.isFile() || profile_image === 'profile_img_placeholder.jpeg') {
                // File does not exist
                return res.status(404).json({ message: 'File not found' });
            }
    
            fs.unlink(filePath, async (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                    next(err);
                    return res.status(500).json({
                        message: 'Could not delete the file',
                        error: err.message, // Include error message for debugging purposes
                    });
                }
                user.profile_image = 'profile_img_placeholder.jpeg';
                user.save();
                res.status(200).send({
                    message: 'File is deleted.',
                });
            });
        });
    } catch (error) {
        next(error)
    }
    
};