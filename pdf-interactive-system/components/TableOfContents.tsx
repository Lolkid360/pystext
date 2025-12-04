"use client";

import { useState } from "react";
import { Document, pdfjs } from "react-pdf";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Ensure worker is configured (it might be redundant if already configured in PDFViewer, but safe to ensure)
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface TOCItem {
    title: string;
    dest: string | any[];
    items: TOCItem[];
    pageNumber?: number;
}

interface TableOfContentsProps {
    file: File | string;
    onChapterSelect: (range: { start: number; end: number }) => void;
    className?: string;
}

export default function TableOfContents({
    file,
    onChapterSelect,
    className,
}: TableOfContentsProps) {
    const [outline, setOutline] = useState<TOCItem[]>([]);
    const [numPages, setNumPages] = useState<number>(0);

    async function onDocumentLoadSuccess(pdf: any) {
        setNumPages(pdf.numPages);
        const outline = await pdf.getOutline();
        if (outline) {
            // Process outline to resolve page numbers
            const processedOutline = await Promise.all(
                outline.map(async (item: any) => {
                    const pageNumber = await getPageNumber(pdf, item.dest);
                    return { ...item, pageNumber };
                })
            );
            setOutline(processedOutline);
        }
    }

    async function getPageNumber(pdf: any, dest: any): Promise<number> {
        if (typeof dest === "string") {
            // Named destination
            const destArray = await pdf.getDestination(dest);
            const ref = destArray[0];
            const pageIndex = await pdf.getPageIndex(ref);
            return pageIndex + 1;
        } else if (Array.isArray(dest)) {
            // Explicit destination [ref, name, ...]
            const ref = dest[0];
            const pageIndex = await pdf.getPageIndex(ref);
            return pageIndex + 1;
        }
        return 1;
    }

    const handleItemClick = (item: TOCItem, index: number) => {
        if (!item.pageNumber) return;

        const start = item.pageNumber;
        // Determine end page: start of next item - 1, or end of document
        let end = numPages;
        if (index + 1 < outline.length) {
            const nextItem = outline[index + 1];
            if (nextItem.pageNumber) {
                end = nextItem.pageNumber - 1;
            }
        }

        onChapterSelect({ start, end });
    };

    return (
        <div className={cn("flex flex-col h-full bg-white border-r", className)}>
            <div className="p-4 border-b bg-gray-50">
                <h2 className="font-semibold text-gray-900">Table of Contents</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
                <Document
                    file={file}
                    onLoadSuccess={onDocumentLoadSuccess}
                    className="hidden" // Hidden because we only want the data
                />
                {outline.length > 0 ? (
                    <div className="space-y-1">
                        {outline.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => handleItemClick(item, index)}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                            >
                                <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
                                <span className="truncate">{item.title}</span>
                                {item.pageNumber && (
                                    <span className="ml-auto text-xs text-gray-400">
                                        p. {item.pageNumber}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="p-4 text-center text-sm text-gray-500">
                        {numPages > 0 ? "No outline found" : "Loading outline..."}
                    </div>
                )}
            </div>
        </div>
    );
}
