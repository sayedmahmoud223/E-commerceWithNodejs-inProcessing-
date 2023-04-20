import mongoose, { Schema, model, Types } from "mongoose"

let categorySchema = new Schema({
    categoryName: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true,
        required: true
    },
    categorySlug: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    categoryImage: {
        type: Object,
        required: true
    },
    createdBy: {
        type: Types.ObjectId,
        ref: "User",
        required: true 
    }
}, {
    toJSON: {virtuals: true},
    toJSON: { virtuals: true },
    timestamps: true
})


categorySchema.virtual("subCategory", {
    localField: "_id",
    foreignField: "categoryId",
    ref: "SubCategory",
    justOne: false
})


export let categoryModel = mongoose.models.Category || model("Category", categorySchema)


