
'use client';

import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "./theme-toggle";

export function AdminHeader() {
    return (
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <SidebarTrigger />
            <div className="relative ml-auto flex-1 md:grow-0">
                {/* Maybe a search bar later */}
            </div>
            <ThemeToggle />
        </header>
    )
}
