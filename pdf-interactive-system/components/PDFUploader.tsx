"use client";

import { useState, useCallback } from "react";
import { Upload, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface PDFUploaderProps {
    onFileSelect: (file: File) => void;
}

export default function PDFUploader({ onFileSelect }: PDFUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files[0];
            if (file && file.type === "application/pdf") {
                onFileSelect(file);
            }
        },
        [onFileSelect]
    );

    const handleFileInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file && file.type === "application/pdf") {
                onFileSelect(file);
            }
        },
        [onFileSelect]
    );

    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center w-full max-w-xl p-12 border-2 border-dashed rounded-xl transition-colors duration-200 ease-in-out cursor-pointer",
                isDragging
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400 bg-white"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById("file-upload")?.click()}
        >
            <input
                id="file-upload"
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleFileInput}
            />
            <div className="flex flex-col items-center gap-4 text-center">
                <div className="p-4 bg-gray-100 rounded-full">
                    <Upload className="w-8 h-8 text-gray-500" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        Upload your PDF
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Drag and drop or click to browse
                    </p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
                    <FileText className="w-3 h-3" />
                    <span>PDF files only</span>
                </div>
            </div>
        </div>
    );
}
