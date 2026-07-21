import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js"
import pool from "../config/database.js"

//upload ảnh lên cloudinary
const uploadToCloudinary = async (file) => {

    //trả về một Promise để xử lý stream async
    return new Promise((resolve, reject) => {
        //tạo một stream upload gửi dữ liệu lên cloudinary
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                //option
                folder: "admin-images",
            },
            //cb nhận result trả về từ Cloudinary
            (error, result) => {
                //error
                if (error) {

                    return reject(error);
                }
                //result null
                if (!result) {
                    return reject(
                        new Error("Upload Image Failed")
                    );
                }
                //Upload thành công
                resolve({
                    public_id: result.public_id,
                    secure_url: result.secure_url
                });
            }

        )
        //chuẩn hóa file.buffer thành stream và upload lên cloudinary
        streamifier.createReadStream(file.buffer).pipe(uploadStream)
    });

};

//generate 3 url image
const generateImageUrls = (publicId) => {

    //tạo url ảnh thumbnail
    const thumbnail = cloudinary.url(publicId,
        {
            width: 150,
            height: 150,
            crop: "fill",
            quality: "auto:good",
            fetch_format: "auto"
        });

    //tạo url ảnh medium
    const medium = cloudinary.url(publicId,
        {
            width: 600,
            height: 600,
            crop: "fill",
            gravity: "auto",
            quality: "auto:good",
            fetch_format: "auto"
        });

    //tạo url ảnh large
    const large = cloudinary.url(publicId,
        {
            width: 1200,
            height: 1200,
            crop: "limit",
            quality: "auto:good",
            fetch_format: "auto"
        });

    return {
        url_thumbnail: thumbnail,
        url_medium: medium,
        url_large: large,
    }
};

//save image and metadata vào database
const saveImage = async (imageData) => {
    //tạo object 
    const {
        title,
        description,
        mime_type,
        public_id,
        url_thumbnail,
        url_medium,
        url_large,
    } = imageData;

    //viết lệnh SQl thực thi
    const [result] = await pool.query(
        `INSERT INTO images (title,description,mime_type,public_id,url_thumbnail,url_medium,url_large)
      VALUES (?,?,?,?,?,?,?) `
        , [title,
            description,
            mime_type,
            public_id,
            url_thumbnail,
            url_medium,
            url_large]
    );

    return {
        //trả về id tự động tăng
        id: result.insertId,
        ...imageData
    }
}

//xử lí và upload ảnh
export const PostImage = async ({ file, title, description }) => {

    if (!file) {
        throw new Error("Image file is required.");
    }
    if (!title) {
        throw new Error("Title is required.");
    }
    if (!description) {
        throw new Error("Description is required.");
    }
    //
    const uploadedImage = await uploadToCloudinary(file);

    const publicId = uploadedImage.public_id;
    const imageUrls = generateImageUrls(publicId);

    const imageData = {
        title,
        description,
        mime_type: file.mimetype,
        public_id: uploadedImage.public_id,
        ...imageUrls
    };

    const savedImage = await saveImage(imageData);

    return savedImage;

};

//
export const GetImage = async () => {
    return {
        message: "data1 data2"
    }

}

