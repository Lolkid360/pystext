"use client";

import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { cn } from "@/lib/utils";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
    file: File | string;
    pageRange?: { start: number; end: number } | null;
    className?: string;
}

export default function PDFViewer({
    file,
    pageRange,
    className,
}: PDFViewerProps) {
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [scale, setScale] = useState<number>(1.0);

    // Reset page number when range changes
    useEffect(() => {
        if (pageRange) {
            setPageNumber(pageRange.start);
        } else {
            setPageNumber(1);
        }
    }, [pageRange]);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    const goToPrevPage = () => {
        if (pageRange) {
            setPageNumber((prev) => Math.max(prev - 1, pageRange.start));
        } else {
            setPageNumber((prev) => Math.max(prev - 1, 1));
        }
    };

    const goToNextPage = () => {
        if (pageRange) {
            setPageNumber((prev) => Math.min(prev + 1, pageRange.end));
        } else {
            setPageNumber((prev) => Math.min(prev + 1, numPages));
        }
    };

    const canGoPrev = pageRange ? pageNumber > pageRange.start : pageNumber > 1;
    const canGoNext = pageRange
        ? pageNumber < pageRange.end
        : pageNumber < numPages;

    return (
        <div className={cn("flex flex-col h-full bg-gray-100", className)}>
            {/* Toolbar */}
            <div className="flex items-center justify-between p-2 bg-white border-b shadow-sm">
                <div className="flex items-center gap-2">
                    <button
                        onClick={goToPrevPage}
                        disabled={!canGoPrev}
                        className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-medium">
                        Page {pageNumber} of {pageRange ? pageRange.end : numPages}
                    </span>
                    <button
                        onClick={goToNextPage}
                        disabled={!canGoNext}
                        className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setScale((s) => Math.max(0.5, s - 0.1))}
                        className="p-1 rounded hover:bg-gray-100"
                    >
                        <ZoomOut className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-medium w-12 text-center">
                        {Math.round(scale * 100)}%
                    </span>
                    <button
                        onClick={() => setScale((s) => Math.min(2.0, s + 0.1))}
                        className="p-1 rounded hover:bg-gray-100"
                    >
                        <ZoomIn className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* PDF Content */}
            <div className="flex-1 overflow-auto flex justify-center p-4">
                <Document
                    file={file}
                    onLoadSuccess={onDocumentLoadSuccess}
                    className="flex flex-col items-center"
                    loading={
                        <div className="flex items-center justify-center h-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                        </div>
                    }
                >
                    <Page
                        pageNumber={pageNumber}
                        scale={scale}
                        className="shadow-lg"
                        renderTextLayer={true}
                        renderAnnotationLayer={true}
                    />
                </Document>
            </div>
        </div>
    );
}
