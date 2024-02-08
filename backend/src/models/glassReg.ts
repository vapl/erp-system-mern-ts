import { InferSchemaType, Schema, model } from "mongoose";

// Stikla reģistrācijas shēma
const glassRegSchema = new Schema({
    order_date: Date,
    glass_supplier: String,
    glass_order_number: String,
    glass_delivery_week: Number,
    order_total: Number,
    proces_status: String,
    complete_status: String,
    complete_date: Date,
    comments: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    order: [{
        type: Schema.Types.ObjectId,
        ref: 'Order',
    }],
    orderComponents: {
        type: Schema.Types.ObjectId,
        ref: 'OrderComponents',
    },
}, { timestamps: true });

type GlassReg = InferSchemaType<typeof glassRegSchema>;
export default model<GlassReg>('GlassReg', glassRegSchema);