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

        const queryParams = req.query;

        const result = await ImageService.GetImage(queryParams);

        return res.status(200).json({
            success: true,
            message: "đã lấy được danh sách thành công",
            data: result
        });
    } catch (error) {


        return res.status(400 || 500).json({
            success: false,
            error: error.message || "hệ thống đang bị lỗi hãy thử lại sau."
        });

    }
}