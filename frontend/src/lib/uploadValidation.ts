// src/lib/uploadValidation.ts
import type { UploadImageRequest } from "@/types/image";

export type UploadErrors = {
    title?: string;
    description?: string;
    image?: string;
};

export function validateUpload(
    data: UploadImageRequest,
    image: File | null,
): UploadErrors {
    const errors: UploadErrors = {};

    //check validation
    if (!data.title.trim()) errors.title = "Title is required.";
    if (!data.description.trim()) errors.description = "Description is required.";

    if (!image) {
        errors.image = "Image is required.";
    } else {
        const extension = image.name.split(".").pop()?.toLowerCase();
        const validExtension = ["png", "jpg", "jpeg"].includes(extension ?? "");
        const validMimeType = ["image/png", "image/jpeg"].includes(image.type);

        if (image.size > 5 * 1024 * 1024) {
            errors.image = "Image must be less than 5MB.";
        } else if (!validExtension || !validMimeType) {
            errors.image = "Only PNG and JPG images are allowed.";
        }
    }

    return errors;

}
