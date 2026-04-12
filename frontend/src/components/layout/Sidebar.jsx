import { NavLink } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { ROLES } from '../../utils/constants';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', roles: null },
  { to: '/transactions', label: 'Transactions', roles: null },
  { to: '/users', label: 'Users',  roles: [ROLES.ADMIN] },
];

export default function Sidebar() {
  const { user, role, logout } = useAuth();

  const visible = navItems.filter((item) => !item.roles || item.roles.includes(role));

  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white flex flex-col">
      <div className="px-6 py-5 border-b border-gray-700">
        <h1 className="text-lg font-bold text-white">FinanceDash</h1>
        <p className="text-xs text-gray-400 mt-0.5">Finance Dashboard</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {visible.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <span>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-gray-700">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 capitalize">{role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full text-left text-sm text-gray-400 hover:text-white transition-colors px-2 py-1"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
