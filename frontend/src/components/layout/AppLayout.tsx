import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

export default function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-grow flex flex-col overflow-y-auto">
        <TopNav />
        <div className="flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
