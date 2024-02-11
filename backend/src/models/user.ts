import { InferSchemaType, Schema, model } from "mongoose";

// Lietotāja shēma
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        min: 2,
        max: 50,
    },
    surname: {
        type: String,
        required: false,
        min: 2,
        max: 100,
    },
    email: {
        type: String,
        validate: {
            validator: (value: string) => /\S+@\S+\.\S+/.test(value),
            message: 'Invalid email format',
        },
        require: true,
        select: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 12,
        select: false,
        unique: true,
    },
    phone_number: String,
    occupation: String,
    role: {
        require: true,
        type: String,
        enum: ['user', 'admin', 'superadmin'],
        default: 'admin',
    },
    profile_image: [{
        filename: String,
        content: Buffer,
    }],
    orders: [{
        type: Schema.Types.ObjectId,
        ref: 'OrderReg',
     }],
    glass_reg: [{
        type: Schema.Types.ObjectId,
        ref: 'GlassReg',
     }],
},
{ timestamps: true });

type User = InferSchemaType<typeof userSchema>;
export default model<User>('User', userSchema);