import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js"
import pool from "../config/database.js"
import AppError from "../errors/AppError.js"
//Upload Image cloudinary
const uploadToCloudinary = async (file) => {

    // Returns a Promise to handle the stream async   
    return new Promise((resolve, reject) => {
        // Create an upload stream to send data to Cloudinary
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                //option
                folder: "admin-images",
            },
            //cb receive the results returned from Cloudinary.
            (error, result) => {
                //Error
                if (error) {

                    return reject(error);
                }
                //Result null
                if (!result) {
                    return reject(
                        new AppError("Upload Image Failed")
                    );
                }
                //Upload success
                resolve({
                    public_id: result.public_id,
                    secure_url: result.secure_url
                });
            }

        )
        //Normalize the buffer file into a data stream and upload it to Cloudinary
        streamifier.createReadStream(file.buffer).pipe(uploadStream)
    });

};

//Generate 3 Url Image
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

//Save image and metadata vào database
const saveImage = async (imageData) => {
    //create object 
    const {
        title,
        description,
        mime_type,
        public_id,
        url_thumbnail,
        url_medium,
        url_large,
        created_by = 1
    } = imageData;

    try {
        //Exce Sql
        const [result] = await pool.query(
            `INSERT INTO images (title,description,mime_type,public_id,url_thumbnail,url_medium,url_large,created_by)
      VALUES (?,?,?,?,?,?,?,?) `
            , [title,
                description,
                mime_type,
                public_id,
                url_thumbnail,
                url_medium,
                url_large,
                created_by
            ]
        );

        return {
            //Return id auto and object
            id: result.insertId,
            ...imageData
        }
    } catch (error) {
        throw new AppError("Database query failed", 500);

    }
};

//// Delete image if saving to database failed
const deleteImageFromCloudinary = async (publicId) => {
    return cloudinary.uploader.destroy(publicId);
};

//Process and upload images
export const PostImage = async ({ file, title, description }) => {

    //Check validate
    if (!file) {
        throw new AppError("Image file is required.", 400);

    }
    if (!title) {
        throw new AppError("Title is required.", 400);

    }
    if (!description) {
        throw new AppError("Description is required.", 400);
    }

    //Call fun 
    const uploadedImage = await uploadToCloudinary(file);

    const publicId = uploadedImage.public_id;

    //Call fun 
    const imageUrls = generateImageUrls(publicId);

    //Create object
    const imageData = {
        title,
        description,
        mime_type: file.mimetype,
        public_id: publicId,
        ...imageUrls
    };

    try {
        //Save data success
        return await saveImage(imageData);

    } catch (error) {
        //If save data error, rollback 
        await deleteImageFromCloudinary(publicId);

        throw new AppError("Failed to save image uploaded file was rolled back.", 500);
    }

};


//
export const GetImage = async ({ page, limit }) => {
    //Return Image/page
    const currentPage = Math.max(1, Number.parseInt(page, 10) || 1);
    //Return Image/request
    const currentLimit = Math.min(
        100, Math.max(1, Number.parseInt(limit, 10) || 20)
    );
    //
    const offset = (currentPage - 1) * currentLimit;
    try {
        //total Image SQL
        const [[countResult]] = await pool.query(
            `SELECT COUNT(*) AS total FROM images`
        );
        //Total Image 
        const total = countResult.total;
        //Totalpage
        const totalPages = Math.ceil(total / currentLimit);
        //Exce Sql
        const [result] = await pool.query(
            `SELECT
        id, title, description, url_thumbnail,created_by, created_at 
        FROM images ORDER BY created_at DESC, id DESC
        LIMIT ?
        OFFSET ?`,
            [currentLimit, offset]
        );

        return {
            data: result,
            pagination: {
                page: currentPage,
                limit: currentLimit,
                total,
                total_pages: totalPages,
            },
        };
    } catch (error) {
        throw new AppError("Database query failed.", 500);
    }
}


