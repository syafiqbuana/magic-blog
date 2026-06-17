// components/ui/image-upload.tsx
"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { X, Loader2, UploadCloud } from "lucide-react";
import imageCompression from "browser-image-compression"; // Tambahkan import ini

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      // 1. PROSES KOMPRESI GAMBAR DI CLIENT
      const options = {
        maxSizeMB: 1, // Membatasi ukuran maksimal menjadi 1MB
        maxWidthOrHeight: 1920, // Membatasi resolusi maksimal menjadi 1920px
        useWebWorker: true, // Agar browser tidak freeze saat proses kompresi
      };

      const compressedFile = await imageCompression(file, options);

      // (Opsional) Kamu bisa melihat perbandingan ukurannya di console browser
      console.log(`Ukuran asli: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
      console.log(`Ukuran dikompres: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);

      // 2. PERSIAPKAN FORM DATA UNTUK CLOUDINARY
      const formData = new FormData();
      // Gunakan 'compressedFile', BUKAN 'file' asli
      formData.append("file", compressedFile); 
      formData.append("upload_preset", "magic-blogs"); // Preset Unsigned kamu

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      if (!cloudName) throw new Error("Cloud name tidak ditemukan");

      // 3. UPLOAD KE CLOUDINARY
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Gagal mengunggah gambar");
      }

      const data = await response.json();
      // Kirim URL gambar yang berhasil diunggah ke parent component
      onChange(data.secure_url);
      
    } catch (error) {
      console.error("Upload error:", error);
      alert("Terjadi kesalahan saat mengunggah gambar.");
    } finally {
      setIsUploading(false);
      // Reset input agar pengguna bisa memilih file yang sama lagi jika dihapus
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  // Jika sudah ada gambar, tampilkan preview-nya
  if (value) {
    return (
      <div className="relative w-full max-w-md aspect-video rounded-md overflow-hidden border shadow-sm">
        <Image 
          fill 
          src={value} 
          alt="Cover Preview" 
          className="object-cover" 
        />
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-sm z-10"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Jika belum ada gambar, tampilkan area drop/klik
  return (
    <div
      onClick={() => !isUploading && inputRef.current?.click()}
      className={`w-full max-w-md border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors aspect-video 
        ${isUploading ? "bg-muted cursor-not-allowed border-border" : "cursor-pointer border-muted-foreground/25 bg-muted/10 hover:bg-muted/30"}`}
    >
      <input
        type="file"
        ref={inputRef}
        onChange={handleUpload}
        accept="image/*"
        className="hidden"
        disabled={isUploading}
      />
      
      {isUploading ? (
        <div className="flex flex-col items-center text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin mb-2 text-primary" />
          <p className="text-sm font-medium">Compressing & Uploading...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center text-muted-foreground">
          <UploadCloud className="w-10 h-10 mb-2 opacity-50" />
          <p className="font-medium text-sm text-foreground">Click to upload</p>
          <p className="text-xs mt-1 opacity-70">JPG, PNG, WEBP (will be compressed)</p>
        </div>
      )}
    </div>
  );
}