import Link from "next/link";

export function BlogSiteFooter() {
  return (
    <footer className="bg-muted/30 border-t border-border w-full mt-auto">
      <div className="w-full py-8 px-4 flex flex-col justify-between items-center gap-4 max-w-5xl mx-auto text-center">
        <div className="text-sm font-bold mb-2">
          Syafiq Galih Rengga Buana
        </div>
        <div className="flex flex-wrap justify-center gap-4 mb-2 text-sm">
          <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
          <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
          <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">RSS Feed</Link>
        </div>
        <div className="text-xs text-muted-foreground opacity-80 mt-2 border-t border-border/50 pt-4 w-full font-mono">
          © {new Date().getFullYear()} Syafiq Galih Rengga Buana. Built on the Minimalist Editorial Platform.
        </div>
      </div>
    </footer>
  );
}