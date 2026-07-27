'use client'
import UploadImageForm from "@/components/UploadImageForm";
import ImageList from "@/components/ImageList";
import { useState } from "react";

export default function Home() {
  const [reload, setReload] = useState(0);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);


  return (
    <div className="min-h-screen w-full p-8">
      <div className="mb-6 flex justify-end">
        <button
          type="button"
          onClick={() => setIsUploadModalOpen(true)}
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        >
          Upload image
        </button>
      </div>
      <div>
        <ImageList
          reload={reload}
        />
      </div>
      {isUploadModalOpen && (
        <UploadImageForm
          onSuccess={() => setReload(prev => prev + 1)}
          onClose={() => setIsUploadModalOpen(false)}
        />
      )}
    </div>
  );
}
