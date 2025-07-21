import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Outlet />{' '}
        {/* 👈 This renders ProjectView or TaskView inside the layout */}
      </div>
    </div>
  );
}
