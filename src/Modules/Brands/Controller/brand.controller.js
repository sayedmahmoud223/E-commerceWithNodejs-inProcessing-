import cloudinary from "../../../utils/cloudinary.js"
import slugify from "slugify"
import { ResError } from "../../../utils/asyncHandler.js";
import { brandModel } from "../../../../DB/Models/brand.Model.js";


export let findbrand = async (req, res, next) => {
    let Brands = await brandModel.find();
    return res.status(201).json({ message: "Done", Brands })
}



export let addBrand = async (req, res, next) => {
    let  brandName  = req.body.brandName.toLowerCase();
    if (await brandModel.findOne({ brandName })) {
        return next(new ResError("brand Name must be unique", 409))
    }
    let { secure_url, public_id, folder } = await cloudinary.uploader.upload(req.file.path, { folder: `E-commerce/Categories/${brandName}` })
    let brand = await brandModel.create({
        brandName,
        brandImage: { secure_url, public_id, folder },
        createdBy: req.user._id,

    })
    return res.status(201).json({ message: "Done", brand })
}



export let updateBrand = async (req, res, next) => {
    let { brandId } = req.params;
    let brand = await brandModel.findById(brandId)
    if (!brand) {
        return next(new ResError("In-valid brand ID", 400))
    }
    if (req.body.brandName) {
        if (brand.brandName == req.body.brandName){
            return next(new ResError("brand Name equal the old name please change to new name or don`t sent request for fun", 400))
        }
        if (await brandModel.findOne({ brandName: req.body.brandName.toLowerCase() })) {
            return next(new ResError("brand Name must be unique", 409))
        }
        brand.brandName = req.body.brandName
    }
    if (req.file) {
        let { secure_url, public_id, folder } = await cloudinary.uploader.upload(req.file.path, { folder: `E-commerce/Categories/${req.body.brandName}` })
        await cloudinary.uploader.destroy(brand.brandImage.public_id);
        brand.brandImage = { secure_url, public_id, folder }
    }
    brand.updatedBy = req.user._id
    await brand.save()
    return res.status(200).json({ message: "Done", brand })
}