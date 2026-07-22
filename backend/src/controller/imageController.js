import * as ImageService from "../service/imageService.js"

//Upload Image
export const PostImage = async (req, res, next) => {
    try {
        const file = req.file;
        const { title, description } = req.body;


        const result = await ImageService.PostImage({ file, title, description });

        return res.status(201).json({
            success: true,
            message: "Upload Image Success",
            data: result
        });

    } catch (error) {
        next(error);
    }
};

// Get List Image
export const GetImage = async (req, res) => {
    try {

        const { page, limit } = req.query;
        const result = await ImageService.GetImage({ page, limit });

        return res.status(200).json({
            success: true,
            message: "Get Image List Success",
            ...result
        });
    } catch (error) {

        const status = error.statusCode || 500;

        return res.status(status).json({
            success: false,
            message: error.message || "Internal Server Error"
        });

    }
}