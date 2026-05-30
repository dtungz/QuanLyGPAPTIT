import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  GraduationCap,
  CalendarDays,
  Settings,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useState } from 'react';
import './Sidebar.css';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Tổng quan' },
  { path: '/grades', icon: GraduationCap, label: 'Bảng điểm' },
  { path: '/schedule', icon: CalendarDays, label: 'Lịch học' },
  { path: '/settings', icon: Settings, label: 'Cài đặt' },
];

export default function Sidebar() {
  const { settings, toggleDarkMode } = useAppContext();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
        <div className="sidebar__header">
          <div className="sidebar__logo">
            <div className="sidebar__logo-icon">
              <BookOpen size={22} />
            </div>
            {!collapsed && (
              <div className="sidebar__logo-text">
                <span className="sidebar__app-name">GPA Manager</span>
                <span className="sidebar__app-subtitle">PTIT</span>
              </div>
            )}
          </div>
          <button
            className="sidebar__collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? 'Mở rộng' : 'Thu gọn'}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        <nav className="sidebar__nav">
          {navItems.map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
              }
              title={label}
            >
              <Icon size={20} />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__footer">
          <button
            className="sidebar__theme-btn"
            onClick={toggleDarkMode}
            title={settings.darkMode ? 'Chế độ sáng' : 'Chế độ tối'}
          >
            {settings.darkMode ? <Sun size={18} /> : <Moon size={18} />}
            {!collapsed && (
              <span>{settings.darkMode ? 'Sáng' : 'Tối'}</span>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="mobile-topbar">
        <div className="sidebar__logo-icon" style={{ width: 32, height: 32 }}>
          <BookOpen size={18} />
        </div>
        <span className="mobile-topbar__title">GPA PTIT</span>
        <div style={{ flex: 1 }}></div>
        <button
          className="sidebar__theme-btn mobile-theme-btn"
          onClick={toggleDarkMode}
          title={settings.darkMode ? 'Chế độ sáng' : 'Chế độ tối'}
        >
          {settings.darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="bottom-nav">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `bottom-nav__link ${isActive ? 'bottom-nav__link--active' : ''}`
            }
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}
