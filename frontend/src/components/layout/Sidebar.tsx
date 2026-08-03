import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FlaskConical,
  Blocks,
  MessageSquare,
  ClipboardCheck,
  BarChart3,
  CircleHelp,
  UserCircle,
  Settings,
  type LucideIcon,
} from 'lucide-react';

type NavItem = {
  icon: LucideIcon;
  label: string;
  path: string;
};

const navItems: NavItem[] = [
  {
    icon: LayoutDashboard,
    label: 'Overview',
    path: '/',
  },
  {
    icon: FlaskConical,
    label: 'Playground',
    path: '/playground',
  },
  {
    icon: Blocks,
    label: 'Applications',
    path: '/applications',
  },
  {
    icon: MessageSquare,
    label: 'Conversations',
    path: '/conversations',
  },
  {
    icon: ClipboardCheck,
    label: 'Evaluations',
    path: '/evaluations',
  },
 
];

const secondaryNavItems: NavItem[] = [
  {
    icon: BarChart3,
    label: 'Analytics',
    path: '/analytics',
  },
];

const bottomNavItems: NavItem[] = [
  {
    icon: CircleHelp,
    label: 'Support',
    path: '#',
  },
  {
    icon: UserCircle,
    label: 'Profile',
    path: '/profile',
  },
];

export default function Sidebar() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }

    return location.pathname.startsWith(path);
  };

  const activeClass =
    'flex items-center gap-2.5 px-3 py-2 bg-primary-container text-on-primary-container border-2 border-on-surface text-sm font-bold neo-shadow-sm transition-all';

  const inactiveClass =
    'flex items-center gap-2.5 px-3 py-2 text-sm text-on-surface-variant hover:bg-surface-container transition-all hover:translate-x-1 hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]';

  return (
    <aside className="hidden md:flex flex-col h-screen p-4 sticky top-0 overflow-y-auto bg-surface border-r-2 border-on-surface neo-shadow-right w-56 z-40 shrink-0 custom-scrollbar">
      {/* Brand */}
      <div className="mb-6">
        <h1 className="font-geist text-lg font-bold text-on-surface tracking-tight">
          AI Sentinel
        </h1>

        <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">
          Governance &amp; Observability
        </p>
      </div>

      {/* Primary + Secondary Navigation */}
      <nav className="flex-grow space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={
                isActive(item.path) ? activeClass : inactiveClass
              }
            >
              <Icon
                size={20}
                strokeWidth={2}
                className="shrink-0"
              />

              <span>{item.label}</span>
            </NavLink>
          );
        })}

        <div className="h-px bg-outline-variant my-3" />

        {secondaryNavItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={
                isActive(item.path) ? activeClass : inactiveClass
              }
            >
              <Icon
                size={20}
                strokeWidth={2}
                className="shrink-0"
              />

              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="mt-auto pt-4 space-y-1">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.label}
              to={item.path}
              className={
                isActive(item.path) ? activeClass : inactiveClass
              }
            >
              <Icon
                size={20}
                strokeWidth={2}
                className="shrink-0"
              />

              <span>{item.label}</span>
            </NavLink>
          );
        })}

        <button className="w-full mt-3 flex items-center justify-center gap-2 bg-on-surface text-surface py-2 text-sm font-bold border-2 border-on-surface neo-shadow hover:neo-shadow-active transition-all cursor-pointer">
          <Settings size={18} strokeWidth={2} />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}