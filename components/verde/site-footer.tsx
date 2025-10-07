export function SiteFooter() {
  return (
    <footer className="mt-12 border-t">
      <div className="container mx-auto px-4 py-8 text-sm text-muted-foreground flex flex-wrap items-center gap-4 justify-between">
        <nav className="flex items-center gap-4">
          <a href="#" className="hover:underline">
            About
          </a>
          <a href="#" className="hover:underline">
            Contact
          </a>
          <a href="/verde/strategy" className="hover:underline">
            Strategy Studio
          </a>
          <a href="#" className="hover:underline">
            Terms
          </a>
        </nav>
        <div>Powered by Verde Bites AI</div>
      </div>
    </footer>
  )
}
