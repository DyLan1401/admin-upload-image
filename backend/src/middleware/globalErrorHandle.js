import multer from "multer";

const globalErrorHandle = (err, req, res, next) => {

    if (err instanceof multer.MulterError) {

        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(413).json({
                success: false,
                error: "Image size must not exceed 5MB."
            });
        }

    }

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        success: false,
        error: message,
    });
};

export default globalErrorHandle;