import mongoose, { Schema, Types, model } from "mongoose"

let productSchema = new Schema({
    customId: { type: String, required: true },
    productName: {
        type: String, required: true, trim: true, unique: true, lowercase: true
    },
    slug: { type: String, required: true },
    description: { type: String, required: true },
    stock: { type: Number, required: true, default: 1 },
    price: { type: Number, required: true, default: 0 },
    discount: { type: Number, default: 0 },
    finalPrice: { type: Number, required: true, default: 0 },
    colors: [String],
    sizes: { type: [String], enum: ["sm", "lg", "xl", "xxl"] },
    mainImage: { type: Object, required: true },
    subImages: { type: [Object] },
    categoryId: { type: Types.ObjectId, ref: "Category", required: true },
    subCategoryId: { type: Types.ObjectId, ref: "SubCategory", required: true },
    brandId: { type: Types.ObjectId, ref: "Brand", required: true },
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Types.ObjectId, ref: "User" },
    wishList: [{ type: Types.ObjectId, ref: "User" }],
    isDeleted: { type: Boolean, default: false },

}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true
})

productSchema.virtual("reviews",{
    localField:"_id",
    foreignField:"productId",    
    ref: "Review",
})


export let productModel = mongoose.models.Product || model("Product", productSchema) 