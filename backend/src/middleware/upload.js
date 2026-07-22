import multer from "multer";
import AppError from "../errors/AppError.js";

const upload = multer({
    //dung lượng tải file cho phép 
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter(req, file, cb) {
        //file được cho phép
        const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];
        //kiểm tra định dạng
        if (!allowedTypes.includes(file.mimetype)) {
            //nếu sai định dạng
            return cb(new AppError(`This image file format is not supported.`, 415));
        }
        //null: không có lỗi gì hết
        //true: chấp nhận file
        cb(null, true);
    }

});

export default upload;