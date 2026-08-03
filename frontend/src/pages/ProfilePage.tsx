import { useAuthStore } from '../stores/auth.store';
import { useLogout, useRefresh } from '../hooks/useAuth';
import { User, Mail, RefreshCw, LogOut, Shield } from 'lucide-react';

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const { mutate: refresh, isPending: isRefreshing } = useRefresh();

  if (!user) {
    return (
      <div className="p-6 text-on-surface-variant font-mono font-bold">
        User information not available.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div>
        <h2 className="font-geist text-2xl font-extrabold tracking-tight">Profile</h2>
        <p className="font-geist text-sm text-on-surface-variant mt-1">
          Manage your account settings and session.
        </p>
      </div>

      <div className="bg-surface border-2 border-on-surface p-6 neo-shadow-sm space-y-8">
        
        {/* User Info Section */}
        <div className="space-y-4">
          <h3 className="font-geist text-lg font-bold border-b-2 border-on-surface pb-2">
            User Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="font-mono text-[10px] font-bold uppercase text-on-surface-variant flex items-center gap-1">
                <User size={12} /> Name
              </label>
              <div className="font-geist text-base font-medium">
                {user.name || 'Not provided'}
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="font-mono text-[10px] font-bold uppercase text-on-surface-variant flex items-center gap-1">
                <Mail size={12} /> Email
              </label>
              <div className="font-geist text-base font-medium">
                {user.email}
              </div>
            </div>
            
            <div className="space-y-1 md:col-span-2">
              <label className="font-mono text-[10px] font-bold uppercase text-on-surface-variant flex items-center gap-1">
                <Shield size={12} /> Role
              </label>
              <div className="font-mono text-xs font-bold uppercase bg-surface-container inline-block px-2 py-0.5 border border-outline-variant">
                {user.role}
              </div>
            </div>
          </div>
        </div>

        {/* Session Management Section */}
        <div className="space-y-4">
          <h3 className="font-geist text-lg font-bold border-b-2 border-on-surface pb-2">
            Session Management
          </h3>
          <p className="font-geist text-sm text-on-surface-variant">
            If you are experiencing access issues, you can refresh your session token. You can also securely sign out of your account.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => refresh()}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 bg-surface-container-low text-on-surface border-2 border-on-surface font-mono text-xs font-bold hover:bg-surface-container transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
              {isRefreshing ? 'Refreshing...' : 'Refresh Token'}
            </button>
            <button
              onClick={() => logout()}
              disabled={isLoggingOut}
              className="flex items-center gap-2 px-4 py-2 bg-error-container text-on-error-container border-2 border-error font-mono text-xs font-bold hover:bg-error/10 transition-colors cursor-pointer disabled:opacity-50"
            >
              <LogOut size={16} />
              {isLoggingOut ? 'Signing out...' : 'Sign Out'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
