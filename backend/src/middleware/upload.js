import multer from "multer";

const upload = multer({
    //dung lượng tải file cho phép 
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter(req, file, cb) {
        //file được cho phép
        const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];
        //kiểm tra định dạng
        if (!allowedTypes.includes(file.mimetype)) {
            //nếu sai định dạng
            return cb(new Error(`Định dạng file ảnh không được hỗ trợ, xin chọn lại file ảnh`));
        }
        //null: không có lỗi gì hết
        //true: chấp nhận file
        cb(null, true);
    }

});

export default upload;