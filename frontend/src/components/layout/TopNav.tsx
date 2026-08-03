// import { Search, Bell, Grid } from 'lucide-react';

export default function TopNav() {
  return (
    <header className="flex justify-between items-center px-4 w-full h-12 sticky top-0 z-50 bg-surface border-b-2 border-on-surface neo-shadow-bottom">
      <div className="flex items-center gap-6">
        {/* Mobile Brand */}
        <div className="md:hidden font-geist text-lg font-extrabold text-on-surface">
          AI Sentinel
        </div>
        {/* Search */}
        {/* <div className="relative group hidden sm:block">
          <span className="absolute inset-y-0 left-3 flex items-center text-on-surface-variant">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search system logs..."
            className="pl-9 pr-4 py-1 bg-surface-container-low border-2 border-on-surface font-mono text-xs focus:ring-2 focus:ring-primary outline-none transition-all w-56"
          />
        </div> */}
      </div>

      <div className="flex items-center gap-4">
        {/* Top Links */}
        <nav className="hidden lg:flex items-center gap-4">
          <a href="#" className="font-mono text-[20px] font-bold text-on-surface-variant hover:text-primary transition-colors">
            Docs
          </a>
          <a href="#" className="font-mono text-[20px] font-bold text-on-surface-variant hover:text-primary transition-colors">
            Support
          </a>
          <a href="#" className="font-mono text-[20px] font-bold text-on-surface-variant hover:text-primary transition-colors">
            Changelog
          </a>
        </nav>

        {/* <div className="flex items-center gap-2">
          <button type="button" aria-label="Notifications" className="p-1.5 hover:bg-surface-container-low transition-all cursor-pointer">
            <Bell size={20} />
          </button>
          <button type="button" aria-label="Apps" className="p-1.5 hover:bg-surface-container-low transition-all cursor-pointer">
            <Grid size={20} />
          </button>
          <div className="w-7 h-7 border-2 border-on-surface bg-primary-container flex items-center justify-center overflow-hidden">
            <span className="text-on-primary-container font-bold text-[10px]">AS</span>
          </div>
        </div> */}
      </div>
    </header>
  );
}
