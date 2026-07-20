import * as ImageService from "../service/imageService.js"

//
export const PostImage = async (req, res) => {
    try {
        const file = req.file;


        const result = await ImageService.PostImage(file);

        return res.status(201).json({
            success: true,
            message: "đã tải ảnh lên thành công",
            data: result
        });
    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "hệ thống đang bị lỗi hãy thử lại sau.",
            error: error.message,
        });

    }
};

//
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

        return res.status(500).json({
            success: false,
            message: "hệ thống đang bị lỗi hãy thử lại sau. ",
            error: error.message

        });
    }
}