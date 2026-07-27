export interface UploadImageRequest {
    title: string;
    description: string;
}

export interface Image {
    id: number;
    title: string;
    description: string;
    url_thumbnail: string;
    created_by: number;
    created_at: string;
}

export interface Pagination {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
}

export interface GetImagesResponse {
    data: Image[];
    pagination: Pagination;
}