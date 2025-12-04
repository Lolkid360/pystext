"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import PDFUploader from "@/components/PDFUploader";
import ChapterTabs from "@/components/ChapterTabs";
import { FileText, HelpCircle, CheckCircle } from "lucide-react";

const PDFViewer = dynamic(() => import("@/components/PDFViewer"), {
  ssr: false,
});
const TableOfContents = dynamic(() => import("@/components/TableOfContents"), {
  ssr: false,
});

export default function Home() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState("content");
  const [chapterRange, setChapterRange] = useState<{
    start: number;
    end: number;
  } | null>(null);

  return (
    <main className="flex h-screen w-full bg-gray-50 overflow-hidden">
      {!pdfFile ? (
        <div className="flex-1 flex flex-col items-center justify-center p-24 animate-in fade-in zoom-in duration-500">
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Interactive Learning
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Upload your textbook or study material to get started with an
              immersive learning experience.
            </p>
          </div>
          <PDFUploader onFileSelect={setPdfFile} />
        </div>
      ) : (
        <div className="flex w-full h-full">
          {/* Sidebar - Table of Contents */}
          <div className="w-80 h-full border-r bg-white shrink-0">
            <TableOfContents
              file={pdfFile}
              onChapterSelect={(range) => {
                setChapterRange(range);
                setActiveTab("content"); // Switch to content when chapter is selected
              }}
            />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Tabs */}
            <ChapterTabs activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Tab Content */}
            <div className="flex-1 overflow-hidden relative bg-gray-100">
              {activeTab === "content" && (
                <PDFViewer
                  file={pdfFile}
                  pageRange={chapterRange}
                  className="h-full w-full"
                />
              )}

              {activeTab === "questions" && (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8 text-center">
                  <HelpCircle className="w-16 h-16 mb-4 text-gray-300" />
                  <h3 className="text-xl font-semibold mb-2">
                    Chapter Questions
                  </h3>
                  <p>
                    Questions for this chapter would appear here.
                    <br />
                    (Requires content extraction or manual entry)
                  </p>
                </div>
              )}

              {activeTab === "summary" && (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8 text-center">
                  <FileText className="w-16 h-16 mb-4 text-gray-300" />
                  <h3 className="text-xl font-semibold mb-2">
                    Chapter Summary
                  </h3>
                  <p>
                    A summary of this chapter would appear here.
                    <br />
                    (Requires AI summarization or manual entry)
                  </p>
                </div>
              )}

              {activeTab === "answers" && (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8 text-center">
                  <CheckCircle className="w-16 h-16 mb-4 text-gray-300" />
                  <h3 className="text-xl font-semibold mb-2">Answer Sheet</h3>
                  <p>
                    Answers for the chapter questions would appear here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
