import { InferSchemaType, Schema, model } from "mongoose";

// Pasūtījuma shēma
const orderRegSchema = new Schema({
    reg_num: {
        type: String,
        unique: true,
    },
    // zw: Number, // Noskaidrot, kas ir ZW?
    order_name: String,
    order_export: Boolean,
    invoice_no: String,
    invoice_total: Number,
    material_total: Number,
    ordered_total: Number,
    components: {
        frame_system: String,
        frame_count: Number,
        frame_ral_color: String,
        production_time: Number,
        mat_order_date: Date,
        mat_delivery_week: Number,
        in_stock: Boolean,
        order_tech_doc: [{
            filename: String,
            content: Buffer,
        }],
        glass_reg: [{
            type: Schema.Types.ObjectId,
            ref: 'GlassReg',
        }],
    },
    user: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
}, { timestamps: true });

type OrderReg = InferSchemaType<typeof orderRegSchema>;
export default model<OrderReg>('OrderReg', orderRegSchema);