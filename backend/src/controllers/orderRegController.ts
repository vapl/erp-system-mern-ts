import { RequestHandler } from "express";
import OrderRegModel from '../models/orderReg';
import UserModel from '../models/user';
import createHttpError from "http-errors";
import mongoose from "mongoose";
import moment from 'moment';
import multer from "multer";
import archiver from 'archiver';
import * as fs from 'fs';
import * as path from 'path';

// set up storage directory
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/files');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// Middleware to handle file upload
export const handleFileUpload: RequestHandler = (req, res, next) => {
    const uploadMiddleware = upload.array('order_tech_doc');

    uploadMiddleware(req, res, function(err) {
        if (err) {
            return next(err);
        }
        // Check if a file was uploaded
        if (!req.files || req.files?.length === 0) {
            return next; 
        }

        const filePaths = Array.isArray(req.files)
            ? req.files.map(file => file.path)
            : [];

        req.body.components.order_tech_doc = filePaths;

        next();
    });
};

export const getOrders:RequestHandler = async (req, res, next) => {
    try {
        const orders = await OrderRegModel.find().exec();
        res.status(200).json(orders);
    } catch (error) {
        next(error);
    }
};

declare module 'express-session' {
    interface Session {
        userId?: mongoose.Types.ObjectId;
    }
}

interface createNewOrder {
    reg_num: string,
    order_name: string,
    order_export?: boolean,
}

export const createOrder: RequestHandler<unknown, unknown, createNewOrder> = async (req, res, next) => {
    const regNumber = req.body.reg_num;
    const orderName = req.body.order_name;
    const exportBoo = req.body.order_export;

    try {
        if (!req.file) {
            throw createHttpError(400, 'File upload failed');
        }
        if (!regNumber) {
            throw createHttpError(400, 'Registration number is missing');
        }
        if (!orderName) {
            throw createHttpError(400, 'Order name is missing');
        }

        // const orderTechDoc = Array.isArray(req.files)
        //     ? req.files.map(file => file.path)
        //     : [];

        const userId = req.session.userId;

        const existingRegNum = await OrderRegModel.findOne({ reg_num: regNumber }).exec();
        if (existingRegNum) {
            throw  createHttpError(409, 'Registration number is already exist');
        }

        const newOrder = await OrderRegModel.create({
            reg_num: regNumber,
            order_name: orderName,
            order_export: exportBoo,
            invoice_no: 0,
            invoice_total: 0,
            material_total: 0,
            components: {
                frame_system: "",
                frame_count: 0,
                frame_ral_color: "",
                production_time: 0,
                mat_order_date: null,
                mat_delivery_week: 0,
                in_stock: false,
                order_tech_doc: [],
                glass_reg: [],
            },
            user: userId
        });

        // Atjauno lietotāja ierakstu, pievienojot jaunā pasūtījuma _id "orders" laukam
        await UserModel.findByIdAndUpdate(userId, { 
            $push: {orders: newOrder._id}
        });

        res.status(200).json(newOrder);
    } catch (error) {
        next(error);
    }
};

interface updateCreatedOrder {
    _id: string,
    invoice_no?: string,
    invoice_total?: number,
    material_total?: number,
    components?: {
        frame_system?: string,
        frame_ral_color?: string,
        frame_count?: number,
        production_time?: number,
        mat_order_date?: number,
        mat_delivery_week?: number,
        in_stock?: number,
    }
}

export const updateOrder: RequestHandler<unknown, unknown, updateCreatedOrder> = async (req, res, next) => {
    const orderId = req.body._id;
    const invoiceNumber = req.body.invoice_no;
    const invoiceTotal = req.body.invoice_total;
    const materialTotal = req.body.material_total;
    const frameSystem = req.body.components?.frame_system;
    const frameCount = req.body.components?.frame_count;
    const frameRalColor = req.body.components?.frame_ral_color;
    const productionTime = req.body.components?.production_time;
    const matOrderDate = req.body.components?.mat_order_date;
    const parsedMatOredrDate = matOrderDate ? moment(matOrderDate, 'DD.MM.YYYY').toDate() : undefined;
    const matDeliveryWeek = req.body.components?.mat_delivery_week;
    const inStock = req.body.components?.in_stock;
    

    try {
        if (!orderId) {
            throw createHttpError(400, 'Order Id is missing')
        }

        const updatedOrder = await OrderRegModel.findByIdAndUpdate(
            orderId, {
                $set: {
                    invoice_no: invoiceNumber,
                    invoice_total: invoiceTotal,
                    material_total: materialTotal,
                    'components.frame_system': frameSystem,
                    'components.frame_count': frameCount,
                    'components.frame_ral_color': frameRalColor,
                    'components.production_time': productionTime,
                    'components.mat_order_date': parsedMatOredrDate,
                    'components.mat_delivery_week': matDeliveryWeek,
                    'components.in_stock': inStock,
                    },
            },
            { new: true }
        );

        if (!updatedOrder) {
            throw createHttpError(404, 'Order not found');
        }

        const regNumber = await OrderRegModel.findOne({_id: orderId}).exec();

        res.status(200).json({ success: true, message: `The order ${regNumber?.reg_num} has been updated`, updateOrder});
    } catch (error) {
        next(error);
    }
};

export const downloadOrderDocument: RequestHandler<{fileId: string}, unknown, unknown, unknown> = async (req, res, next) => {
    const fileId = req.params.fileId;

    try {
        const order = await OrderRegModel.findById(fileId).exec();

        if (!order) {
            throw createHttpError(404, 'Order not found');
        }

        const { components } = order;

        if (!components?.order_tech_doc || components.order_tech_doc.length === 0) {
            throw createHttpError(404, 'Order document not found');
        }

        const archive = archiver('zip');
        res.attachment(`order-${fileId}-documents.zip`);

        archive.on('error', (err) => {
            throw err;
        });

        archive.pipe(res);

        for (const filePath of components.order_tech_doc) {
            const fileContent = await fs.promises.readFile(filePath);
            const fileName = path.basename(filePath);
            archive.append(fileContent, { name: fileName });
        }

        archive.finalize();
        
    } catch (error) {
        next(error);
    }
};

export const deleteOrder: RequestHandler<unknown, unknown, {_id: string}> = async (req, res, next) => {
    const orderId = req.body._id;
    try {
        if (!orderId) {
            return res.status(400).json({ message: 'Order doesn\'t exist' });
        }
        
        if (!orderId || !mongoose.isValidObjectId(orderId)) {
            throw createHttpError(400, 'Invalid user id');
        }

        const user = await UserModel.findOne({orders: orderId});
        if (!user) {
            return res.status(400).json({ message: 'User not found for given order' })
        }

        const orderIdObj = new mongoose.Types.ObjectId(orderId);

        user.orders = user.orders.filter(order => !order.equals(orderIdObj));

        await user.save();

        await OrderRegModel.findByIdAndDelete(orderId).exec();

        res.status(200).json({ message: 'Order has been deleted' });
    } catch (error) {
        next(error);
    }
};