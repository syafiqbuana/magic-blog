import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Rss, UserCircle } from "lucide-react";

export function BlogSiteHeader() {
  return (
    <header className="bg-background sticky top-0 z-50 border-b border-border">
      <div className="flex flex-col w-full">
        <div className="flex justify-between items-center w-full px-4 py-2 max-w-5xl mx-auto">
          <Link href="/" className="text-lg font-bold tracking-tight">
            Syafiq Galih Rengga Buana
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Rss className="h-5 w-5" />
              <span className="sr-only">RSS Feed</span>
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <UserCircle className="h-5 w-5" />
              <span className="sr-only">Account</span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Links */}
        <nav className="flex overflow-x-auto px-4 gap-6 pb-1 hide-scrollbar border-t border-border/50 max-w-5xl mx-auto w-full">
          <Link href="#" className="font-bold border-b-2 border-foreground pb-1 pt-2 whitespace-nowrap">
            Articles
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors pb-1 pt-2 whitespace-nowrap">
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}