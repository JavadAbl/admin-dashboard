import React, { useRef, useState } from "react";
import { cn } from "../../Utils/Cn";

interface ImageDropzoneProps {
  disabled: boolean;
  onFilesSelected?: (files: FileList) => void;
  onDialogToggle?: (isOpen: boolean) => void;
}

export default function ImageDropzone({
  disabled,
  onFilesSelected,
  onDialogToggle,
}: ImageDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList) => {
    if (!disabled && files && files.length > 0) {
      const file = files[0];

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      setSelectedFile(file);

      if (onFilesSelected) {
        onFilesSelected(files);
      }
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      onDialogToggle?.(true);
      fileInputRef.current.click();
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div
      className={cn(
        "border-2 border-dashed rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer min-h-18.75 border-primary/50",
        isDragging
          ? " bg-primary/5"
          : " hover:border-primary hover:bg-base-200/30",
        disabled && "pointer-events-none opacity-60",
      )}
      onDragOver={(e) => {
        if (!preview) {
          e.preventDefault();
          setIsDragging(true);
        }
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        if (!preview) {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
          }
        }
      }}
      onClick={handleClick}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/jpeg, image/png, image/webp"
        multiple={false}
        disabled={disabled}
        onChange={(e) => {
          onDialogToggle?.(false);
          if (e.target.files && e.target.files.length > 0) {
            handleFiles(e.target.files);
          }
          e.target.value = "";
        }}
        onBlur={() => onDialogToggle?.(false)}
      />

      {preview && selectedFile ? (
        <div className="flex flex-col items-center gap-4 w-full">
          <div className="relative w-24 h-24">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover rounded-lg"
            />
            <button
              onClick={handleRemove}
              className="absolute -top-2 -right-2 bg-error rounded-full p-1 text-white hover:bg-error/80 transition-colors"
              type="button"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-base-content">
              {selectedFile.name}
            </p>
            <p className="text-xs text-base-content/60">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <button
            onClick={handleRemove}
            className="btn btn-sm btn-ghost gap-2"
            type="button"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            حذف
          </button>
        </div>
      ) : (
        <>
          <div className="w-12 h-12 rounded-full bg-base-200 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-base-content/40"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-sm text-base-content/60 font-medium">
            عکس محصول را بکشید اینجا رها کنید
          </p>
          <p className="text-xs text-base-content/40">
            یا کلیک کنید برای انتخاب فایل
          </p>
          <p className="text-[10px] text-base-content/30 mt-1">
            JPG, PNG, WebP — حداکثر ۵ مگابایت
          </p>
        </>
      )}
    </div>
  );
}
