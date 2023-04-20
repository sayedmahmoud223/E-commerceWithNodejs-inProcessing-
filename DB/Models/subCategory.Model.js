import mongoose, { Schema, model, Types } from "mongoose"

let subCategorySchema = new Schema({
    subCategoryName: {
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
    subCategoryImage: {
        type: Object,
        required: true
    },
    createdBy: {
        type: Types.ObjectId,
        ref: "User",
        required: false // will convert after user model
    },
    categoryId:{
        type: Types.ObjectId,
        ref: "Category",
        required: false // will convert after user model
    }
}, { timestamps: true })

export let subCategoryModel = mongoose.models.SubCategory || model("SubCategory", subCategorySchema)
