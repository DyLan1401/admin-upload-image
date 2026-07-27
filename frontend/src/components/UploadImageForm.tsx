'use client';

import { AxiosError } from "axios";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { validateUpload, type UploadErrors } from "@/lib/uploadValidation";
import { uploadImage } from "@/services/imageService";
import type { UploadImageRequest } from "@/types/image";


const EMPTY_FORM: UploadImageRequest = {
    title: "",
    description: ""
};

type Feedback = {
    type: "success" | "error";
    text: string;
};

type UploadImageFormProps = {
    onSuccess: () => void;
    onClose: () => void;
};

export default function UploadImageForm({
    onSuccess,
    onClose,
}: UploadImageFormProps) {
    const [formData, setFormData] = useState<UploadImageRequest>(EMPTY_FORM);
    const [errors, setErrors] = useState<UploadErrors>({});
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);



    //xóa previewUrl nếu còn
    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    //form trống
    const resetForm = () => {
        setFormData(EMPTY_FORM);
        setSelectedFile(null);
        setPreviewUrl("");
        setErrors({});
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    //
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        //form không load trang
        event.preventDefault();

        //gọi validateUpload
        const validationErrors = validateUpload(formData, selectedFile);
        setErrors(validationErrors);
        //có lỗi thì dừng lại 
        if (Object.keys(validationErrors).length > 0 || !selectedFile) return;


        setLoading(true);
        setFeedback(null);

        try {
            //gọi api
            await uploadImage(formData, selectedFile);
            //thành công xóa hết thông tin form 
            resetForm();
            //trả về thông báo
            setFeedback({ type: "success", text: "Upload image successfully." });

            onSuccess();
            onClose();

        } catch (error) {
            //trả về thông báo lỗi
            const axiosError = error as AxiosError<{ error?: string }>;
            const message = axiosError.response?.data?.error ?? "Upload failed. Please try again.";

            if (message.toLowerCase().includes("image")) {
                setErrors((previous) => ({ ...previous, image: message }));
            } else {
                setFeedback({ type: "error", text: message });
            }
        } finally {
            setLoading(false);
        }
    };

    //lấy file đầu tiên
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;
        setSelectedFile(file);
        setPreviewUrl(file ? URL.createObjectURL(file) : "");
        setErrors((previous) => ({ ...previous, image: undefined }));
    };

    //cập nhật filed 
    const handleValueChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = event.target;
        const field = name as keyof UploadImageRequest;

        setFormData((previous) => ({ ...previous, [field]: value }));
        setErrors((previous) => ({ ...previous, [field]: undefined }));
    };

    const handleCancel = () => {
        resetForm();
        setFeedback(null);
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            role="presentation"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) handleCancel();
            }}
        >
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md rounded border border-gray-300 bg-white px-8 pt-6 pb-8 font-semibold"
                role="dialog"
                aria-modal="true"
                aria-labelledby="upload-image-title"
            >
                <div className="mb-4 flex items-center justify-between">
                    <h1 id="upload-image-title" className="text-xl font-bold">UPLOAD IMAGE</h1>
                    <button
                        type="button"
                        onClick={handleCancel}
                        aria-label="Close upload form"
                        className="text-2xl leading-none text-gray-500 hover:text-gray-800"
                    >
                        ×
                    </button>
                </div>

                <div className="mb-4">
                    <label htmlFor="title" className="mb-2 block text-sm font-bold text-gray-700">
                        Title
                    </label>
                    <input
                        id="title"
                        name="title"
                        type="text"
                        value={formData.title}
                        onChange={handleValueChange}
                        className="w-full rounded-lg border px-3 py-2 text-gray-700 shadow"
                        placeholder="Title"
                    />
                    {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
                </div>

                <div className="mb-4">
                    <label htmlFor="description" className="mb-2 block text-sm font-bold text-gray-700">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleValueChange}
                        className="w-full rounded-lg border px-3 py-2 text-gray-700 shadow"
                        placeholder="Description"
                    />
                    {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                </div>

                <div className="mb-6">
                    <label htmlFor="image" className="mb-2 block text-sm font-bold text-gray-700">
                        Image
                    </label>
                    <input
                        ref={fileInputRef}
                        id="image"
                        type="file"
                        accept="image/png,image/jpeg"
                        onChange={handleFileChange}
                        className="w-full cursor-pointer rounded-lg border px-3 py-2 text-gray-700 shadow"
                    />
                    {errors.image && <p className="mt-1 text-sm text-red-500">{errors.image}</p>}
                    <p className="text-xs text-gray-400">Only PNG/JPG files smaller than 5 MB are allowed.</p>
                </div>

                <div className="mb-6">
                    <p className="mb-2 text-sm font-bold text-gray-700">Preview image</p>
                    {previewUrl ? (
                        <Image
                            src={previewUrl}
                            alt="Selected image preview"
                            width={100}
                            height={100}
                            unoptimized
                            className="border border-gray-500 object-cover"
                        />
                    ) : (
                        <div className="flex h-25 w-25 items-center justify-center border text-sm text-gray-400">
                            No image
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="rounded px-4 py-2 font-bold text-blue-500 outline-2 outline-gray-400 hover:text-gray-500 hover:outline-blue-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Uploading..." : "Upload"}
                    </button>
                </div>
                {feedback && (
                    <p className={`mt-2 text-center ${feedback.type === "success" ? "text-green-600" : "text-red-600"}`}>
                        {feedback.text}
                    </p>
                )}
            </form>
        </div>
    );
}
