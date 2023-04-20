import multer from "multer"


export let fileValidation = {
    image: ["image/jpeg", "image/png", "image/tif"],
    file: ["application/pdf", "application/pdf"]
}

export function fileUploud(customValidation = fileValidation.image) {
    const Storage = multer.diskStorage({})

    let fileFilter = (req, file, cb) => {
        if (customValidation.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb("invalid-format", false)
        }
    }
    const upload = multer({ fileFilter,  storage:Storage })
    return upload
}