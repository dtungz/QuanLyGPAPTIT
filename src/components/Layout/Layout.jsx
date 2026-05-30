import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import SyncStatus from './SyncStatus';
import './Layout.css';

export default function Layout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main">
        <SyncStatus />
        <div className="page-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
