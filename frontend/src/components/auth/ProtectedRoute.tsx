import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth.store';
import { useCurrentUser } from '../../hooks/useAuth';

/**
 * ProtectedRoute — verifies the session with the backend on every mount.
 *
 * Flow:
 *  1. While the /me query is in-flight → show a loading spinner (no premature redirect).
 *  2. Query resolves as authenticated → render the requested page via <Outlet />.
 *  3. Query resolves as unauthenticated → redirect to /login, preserving the
 *     originally requested URL in location state so the user can be sent back
 *     after a successful login.
 */
export default function ProtectedRoute() {
  const location = useLocation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { isLoading } = useCurrentUser();

  // While the backend /me check is in-flight, show a neutral loading state.
  // This prevents a flash of protected content AND prevents an incorrect
  // redirect to /login before the session has been verified.
  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          width: '100vw',
          background: 'var(--color-background, #0a0a0a)',
        }}
        aria-label="Verifying session…"
      >
        <div
          style={{
            width: 40,
            height: 40,
            border: '3px solid rgba(255,255,255,0.15)',
            borderTopColor: 'var(--color-primary, #6366f1)',
            borderRadius: '50%',
            animation: 'spin 0.75s linear infinite',
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Preserve the originally requested URL so we can redirect back after login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
