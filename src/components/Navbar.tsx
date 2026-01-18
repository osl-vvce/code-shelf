import Link from 'next/link';
import { Search, Plus, Menu, Library } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="bg-[#24292f] text-white p-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <div className="md:hidden cursor-pointer">
            <Menu size={24} />
        </div>
        <Link href="/" className="font-bold text-xl flex items-center gap-2 hover:text-gray-300 transition-colors">
            <Library size={32} />
            <span>Code-Shelf</span>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
            <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
            </div>
            <input 
                type="text" 
                placeholder="Type / to search" 
                className="bg-[#24292f] border border-gray-500 rounded-md py-1.5 pl-8 pr-12 text-sm text-white placeholder-gray-400 focus:bg-white focus:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all w-64"
            />
            <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                 <span className="text-gray-400 text-xs border border-gray-600 rounded px-1.5">/</span>
            </div>
        </div>
        
        <button className="flex items-center gap-1 border border-gray-500 rounded-md px-3 py-1.5 text-sm font-medium hover:bg-gray-700 hover:border-gray-400 transition-all">
            <Plus size={16} />
            <span className="hidden md:inline">New Project</span>
        </button>
        
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 border border-gray-500 hidden md:block cursor-pointer"></div>
      </div>
    </header>
  );
}
