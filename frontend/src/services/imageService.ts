import api from "@/lib/axios";
import type { UploadImageRequest } from "@/types/image";

export const uploadImage = async (
    data: UploadImageRequest,
    file: File
) => {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("image", file);

    const response = await api.post("/api/admin/images", formData);

    return response.data;
};
