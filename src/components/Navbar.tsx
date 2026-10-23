
import Link from 'next/link';
import { Search, Plus, Menu, Library, ChevronDown } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#30363d] bg-[#0d1117] text-[#f0f6fc]">
      <nav className="mx-auto flex min-h-[68px] max-w-screen-2xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

        {/* Logo and mobile menu */}
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            aria-label="Open navigation menu"
            className="rounded-md p-2 text-[#8b949e] transition-colors hover:bg-[#21262d] hover:text-white md:hidden"
          >
            <Menu size={21} />
          </button>

          <Link
            href="/"
            aria-label="Code-Shelf home"
            className="group flex items-center gap-3"
          >
            
           <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#484f58] bg-[#21262d] shadow-sm transition-colors group-hover:border-[#8b949e] group-hover:bg-[#30363d]">
            <Library
            size={22}
            strokeWidth={2}
            className="text-[#f0f6fc]"
            />
          </span>

<span className="text-lg font-bold tracking-tight text-[#f0f6fc] sm:text-xl">
  Code-Shelf
</span>

          </Link>
        </div>

        {/* Search */}
        <div className="hidden min-w-0 max-w-md flex-1 md:block">
          <label className="relative block">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[#8b949e]">
              <Search size={16} />
            </span>

            <input
              type="search"
              aria-label="Search Code-Shelf"
              placeholder="Search Code-Shelf..."
              className="w-full rounded-lg border border-[#30363d] bg-[#010409] py-2 pl-10 pr-12 text-sm text-[#f0f6fc] placeholder:text-[#8b949e] transition-all focus:border-[#58a6ff] focus:outline-none focus:ring-2 focus:ring-[#1f6feb]/40"
            />

            <kbd className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <span className="rounded border border-[#30363d] px-1.5 py-0.5 text-xs text-[#8b949e]">
                /
              </span>
            </kbd>
          </label>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href="/projects/new"
            className="inline-flex items-center gap-2 rounded-lg border border-[#3d444d] bg-[#21262d] px-3 py-2 text-sm font-medium text-[#f0f6fc] shadow-sm transition-colors hover:border-[#8b949e] hover:bg-[#30363d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#58a6ff]"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">New Project</span>
          </Link>

          <Link
            href="/members"
            className="inline-flex items-center gap-2 rounded-lg border border-[#3d444d] bg-[#21262d] px-3 py-2 text-sm font-medium text-[#f0f6fc] shadow-sm transition-colors hover:border-[#8b949e] hover:bg-[#30363d]"
          >
            <span>Explore</span>
            <ChevronDown size={15} />
          </Link>
        </div>
      </nav>
    </header>
  );
}

