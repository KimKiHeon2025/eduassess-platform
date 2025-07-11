import { useState, useRef } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onFileRemove?: () => void;
  currentImageUrl?: string;
  className?: string;
  accept?: string;
  maxSize?: number; // in MB
}

export default function FileUpload({
  onFileSelect,
  onFileRemove,
  currentImageUrl,
  className,
  accept = "image/*",
  maxSize = 10,
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size must be less than ${maxSize}MB`);
      return;
    }
    onFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  if (currentImageUrl) {
    return (
      <div className={cn("relative", className)}>
        <img
          src={currentImageUrl}
          alt="Uploaded"
          className="w-full h-32 object-cover rounded-lg border border-gray-300"
        />
        {onFileRemove && (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={onFileRemove}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
          isDragOver 
            ? "border-primary-500 bg-primary-50" 
            : "border-gray-300 hover:border-gray-400"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
        <div className="text-sm text-gray-600">
          <span className="font-medium text-primary-600 hover:text-primary-500">
            Upload a file
          </span>{" "}
          or drag and drop
        </div>
        <p className="text-xs text-gray-500 mt-1">
          PNG, JPG, GIF up to {maxSize}MB
        </p>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
}
