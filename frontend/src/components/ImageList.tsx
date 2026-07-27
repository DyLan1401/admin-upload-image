'use client';

import { useCallback, useEffect, useState } from "react";
import type { Image } from "@/types/image";
import { getImages } from "@/services/imageService";

type ImageListProps = {
    reload: number;
};
export default function ImageList({
    reload,
}: ImageListProps) {

    const [images, setImages] = useState<Image[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [page, setPage] = useState(1);
    const [limit] = useState(20);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        total_pages: 1,
    });

    //tránh tạo lại fetch không cần thiết
    const fetchImages = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getImages(page, limit);

            setImages(response.data);
            setPagination(response.pagination);
        } catch {
            setError("Failed to load images.");
        } finally {
            setLoading(false);
        }
    }, [page, limit]);


    //gọi API lúc mở trang và sau khi upload
    useEffect(() => {
        fetchImages();
    }, [fetchImages, reload]);

    //ảnh đầu tiên của mỗi page
    const start = (pagination.page - 1) * pagination.limit + 1;


    //ảnh cuối cùng của mỗi page
    const end = Math.min(
        pagination.page * pagination.limit,
        pagination.total
    );

    //return loading
    if (loading) {
        return (
            <div className="text-center py-8">
                Loading images...
            </div>
        );
    }
    //return lỗi
    if (error) {
        return (
            <div className="text-center py-8 text-red-500">
                {error}
            </div>
        );
    }

    //return không có ảnh
    if (images.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                No images found.
            </div>
        );
    }
    return (
        <div className="w-full h-full">
            <div className="relative flex flex-col w-full h-full overflow-x-auto text-gray-700 bg-white shadow-md rounded-lg bg-clip-border">
                <table className="w-full text-left table-auto min-w-max">
                    <thead>
                        <tr>
                            <th className="p-4 border-b border-slate-200 bg-slate-50">
                                <p className="text-sm font-normal leading-none text-slate-500">
                                    ID
                                </p>
                            </th>
                            <th className="p-4 border-b border-slate-200 bg-slate-50">
                                <p className="text-sm font-normal leading-none text-slate-500">
                                    Title
                                </p>
                            </th>
                            <th className="p-4 border-b border-slate-200 bg-slate-50">
                                <p className="text-sm font-normal leading-none text-slate-500">
                                    Description
                                </p>
                            </th>
                            <th className="p-4 border-b border-slate-200 bg-slate-50">
                                <p className="text-sm font-normal leading-none text-slate-500">
                                    Image
                                </p>
                            </th>
                            <th className="p-4 border-b border-slate-200 bg-slate-50">
                                <p className="text-sm font-normal leading-none text-slate-500">
                                    Updated Date
                                </p>
                            </th>
                            <th className="p-4 border-b border-slate-200 bg-slate-50">
                                <p className="text-sm  font-normal leading-none text-slate-500">
                                    Created By
                                </p>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {images.map((image) => (
                            <tr key={image.id} className="hover:bg-slate-50 border-b border-slate-200">
                                <td className="p-4 py-5">
                                    <p className="block font-semibold text-sm text-slate-800">{image.id}</p>
                                </td>
                                <td className="p-4 py-5">
                                    <p className="text-sm text-slate-500">{image.title}</p>
                                </td>
                                <td className="p-4 py-5">
                                    <p className="text-sm text-slate-500">{image.description}</p>
                                </td>
                                <td className="p-4 py-5">
                                    <img
                                        src={image.url_thumbnail}
                                        alt={image.title}
                                        className=" w-24 h-24 object-cover rounded"
                                    />
                                </td>
                                <td className="p-4 py-5">
                                    <p className="text-sm text-slate-500">{new Date(image.created_at).toLocaleDateString()}</p>
                                </td>
                                <td className="p-4 py-5">
                                    <p className="text-sm text-center text-slate-500">{image.created_by}</p>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="flex justify-between items-center px-4 py-3">
                    <div className="text-sm text-slate-500">
                        Showing <b>{start}-{end}</b> of {pagination.total}
                    </div>
                    <div className="flex space-x-1">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                            className="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease">
                            Prev
                        </button>
                        {Array.from(
                            { length: pagination.total_pages },
                            (_, index) => (
                                <button
                                    key={index + 1}
                                    onClick={() => setPage(index + 1)}
                                    className={
                                        page === index + 1
                                            ? "px-3 py-1 rounded bg-slate-800 text-white"
                                            : "px-3 py-1 rounded border"
                                    }
                                >
                                    {index + 1}
                                </button>
                            )
                        )}
                        <button
                            disabled={page === pagination.total_pages}
                            onClick={() => setPage(page + 1)}
                            className="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease">
                            Next
                        </button>
                    </div>
                </div>
            </div>

        </div >
    )
}
