import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js"

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

const generateImageUrls = (publicId) => {

    const thumbnail = cloudinary.url(publicId,
        {
            width: 150,
            height: 150,
            crop: "fill",
            quality: "auto:good",
            fetch_format: "auto"
        });
    const medium = cloudinary.url(publicId,
        {
            width: 600,
            height: 600,
            crop: "fill",
            gravity: "auto",
            quality: "auto:good",
            fetch_format: "auto"
        });
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


//
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

    const uploadedImage = await uploadToCloudinary(file);


    const publicId = uploadedImage.public_id;
    const imageUrls = generateImageUrls(publicId);

    return {
        title,
        description,
        ...uploadedImage,
        ...imageUrls
    };

}
//
export const GetImage = async () => {
    return {
        message: "data1 data2"
    }

}

