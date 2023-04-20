import { categoryModel } from "../../../../DB/Models/category.Model.js";
import { subCategoryModel } from "../../../../DB/Models/subCategory.Model.js";
import { ResError } from "../../../utils/asyncHandler.js";
import cloudinary from "../../../utils/cloudinary.js"



export let addsubCategory = async (req, res, next) => {

    let { categoryId } = req.params;
    let category = await categoryModel.findById(categoryId)
    if (!category) {
        return next(new ResError("In-valid Category ID", 400))
    }
    let { subCategoryName } = req.body;
    let { secure_url, public_id, folder } = await cloudinary.uploader.upload(req.file.path, { folder: `E-commerce/Categories/${category.categoryName}/${subCategoryName}` })

    let subCategory = await subCategoryModel.create({
        subCategoryName,
        categoryId,
        subCategoryImage: { secure_url, public_id, folder },
        isDeleted: false
    }) // will add createdBy after user model
    if (!category) {
        await cloudinary.uploader.destroy(public_id);
        await cloudinary.api.delete_folder();
        return next(new ResError("In-valid Category ID", 400))
    }
    return res.status(201).json({ message: "Done", subCategory })
}



export let updatesubCategory = async (req, res, next) => {
    let { subCategoryId } = req.params;
    let { categoryId } = req.params;
    let subCategory = await subCategoryModel.findOne({ _id: subCategoryId, categoryId })
    if (!subCategory) {
        return next(new ResError("In-valid subCategory ID", 400))
    }
    if (req.body.subCategoryName) {
        subCategory.subCategoryName = req.body.subCategoryName
    }
    if (req.file) {
        let { secure_url, public_id, folder } = await cloudinary.uploader.upload(req.file.path, { folder: `E-commerce/Categories/${req.body.subCategoryName}` })
        await cloudinary.uploader.destroy(subCategory.subCategoryImage.public_id);
        // await cloudinary.api.delete_folder(subCategory.subCategoryImage.folder);
        subCategory.subCategoryImage = { secure_url, public_id, folder }
    }
    await subCategory.save()
    return res.status(201).json({ message: "Done", subCategory })
}
