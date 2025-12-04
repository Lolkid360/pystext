"use client";

import { useState } from "react";
import { BookOpen, HelpCircle, FileText, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ChapterTabsProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    className?: string;
}

export default function ChapterTabs({
    activeTab,
    onTabChange,
    className,
}: ChapterTabsProps) {
    const tabs = [
        { id: "content", label: "Study Material", icon: BookOpen },
        { id: "questions", label: "Questions", icon: HelpCircle },
        { id: "summary", label: "Summary", icon: FileText },
        { id: "answers", label: "Answers", icon: CheckCircle },
    ];

    return (
        <div className={cn("flex items-center gap-2 p-2 bg-white border-b", className)}>
            {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={cn(
                            "relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors",
                            isActive
                                ? "text-blue-600 bg-blue-50"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        )}
                    >
                        <Icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                        {isActive && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                                initial={false}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        )}
                    </button>
                );
            })}
        </div>
    );
}
