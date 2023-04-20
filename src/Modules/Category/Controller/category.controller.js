import cloudinary from "../../../utils/cloudinary.js"
import slugify from "slugify"
import { ResError } from "../../../utils/asyncHandler.js";
import { categoryModel } from "../../../../DB/Models/category.Model.js";


export let findSubCategoryAndCategory = async (req, res, next) => {
    
    let category = await categoryModel.find().populate([
        {
            path: "subCategory"
        }
    ])
    // return next(new ResError("In-valid Category ID", 400))    
    return res.status(200).json({ message: "Done", categories: category })
}



export let addCategory = async (req, res, next) => {
    let categoryName = req.body.categoryName.toLowerCase();
    let { secure_url, public_id, folder } = await cloudinary.uploader.upload(req.file.path, { folder: `E-commerce/Categories/${categoryName}` })
    let category = await categoryModel.create({
        categoryName,
        categorySlug: slugify(categoryName, "_"),
        categoryImage: { secure_url, public_id, folder },
        createdBy: req.user._id
    }) 

    return res.status(201).json({ message: "Done", category })
}



export let updateCategory = async (req, res, next) => {
    let { categoryId } = req.params;
    let category = await categoryModel.findById(categoryId)
    if (!category) {
        return next(new ResError("In-valid Category ID", 400))
    }
    if (req.body.categoryName) {
        category.categoryName = req.body.categoryName.toLowerCase();
        category.categorySlug = slugify(req.body.categoryName,"_")
    }

    if (req.file) {
        let { secure_url, public_id, folder } = await cloudinary.uploader.upload(req.file.path, { folder: `E-commerce/Categories/${req.body.categoryName}` })
        await cloudinary.uploader.destroy(category.categoryImage.public_id);
        category.categoryImage = { secure_url, public_id, folder }
    }
    await category.save()
    return res.status(200).json({ message: "Done", category })
}
