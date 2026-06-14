import React, { useContext, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  FileText, 
  Video, 
  Award, 
  Code2, 
  BarChart3, 
  BookOpen, 
  ShieldAlert, 
  LogOut, 
  Menu, 
  X,
  User
} from 'lucide-react';

export const DashboardLayout = ({ children }) => {
  const { user, logout, isAdmin } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/resume', label: 'Resume Analyzer', icon: FileText },
    { path: '/interview', label: 'Mock Interview', icon: Video },
    { path: '/assessment', label: 'Assessments', icon: Award },
    { path: '/coding', label: 'Coding Practice', icon: Code2 },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/learning', label: 'Learning Roadmap', icon: BookOpen },
    { path: '/profile', label: 'Profile Settings', icon: User },
  ];

  if (isAdmin) {
    links.push({ path: '/admin', label: 'Admin Panel', icon: ShieldAlert });
  }

  const sidebarVariants = {
    hidden: { x: -280 },
    visible: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-[#F3F4F6] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 glass-panel border-r border-[#1F2A45] h-screen sticky top-0">
        <div className="h-20 flex items-center px-6 border-b border-[#1F2A45]">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-extrabold bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
              InterviewIQ
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/'}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600/30 to-purple-600/20 text-[#F3F4F6] border-l-4 border-indigo-500 shadow-glow'
                    : 'text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#151D30]/50'
                }`
              }
            >
              <link.icon className="h-5 w-5" />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-[#1F2A45]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center font-bold text-white shadow-glow">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="truncate w-32">
                <p className="text-sm font-semibold truncate">{user?.name}</p>
                <p className="text-xs text-[#9CA3AF] capitalize truncate">{user?.role}</p>
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center space-x-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black lg:hidden"
            />
            {/* Drawer */}
            <motion.aside
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#0B0F19] border-r border-[#1F2A45] flex flex-col lg:hidden"
            >
              <div className="h-20 flex items-center justify-between px-6 border-b border-[#1F2A45]">
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-extrabold bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent">
                  InterviewIQ
                </Link>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1 rounded-md text-[#9CA3AF] hover:text-[#F3F4F6]">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {links.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    end={link.path === '/'}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-indigo-600/30 to-purple-600/20 text-[#F3F4F6] border-l-4 border-indigo-500 shadow-glow'
                          : 'text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#151D30]/50'
                      }`
                    }
                  >
                    <link.icon className="h-5 w-5" />
                    <span>{link.label}</span>
                  </NavLink>
                ))}
              </nav>

              <div className="p-4 border-t border-[#1F2A45]">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="h-9 w-9 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white shadow-glow">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold truncate">{user?.name}</p>
                    <p className="text-xs text-[#9CA3AF] capitalize">{user?.role}</p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center space-x-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Body */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden h-20 glass-panel border-b border-[#1F2A45] flex items-center justify-between px-6 sticky top-0 z-30">
          <button onClick={() => setMobileMenuOpen(true)} className="p-1 rounded-md text-[#9CA3AF] hover:text-[#F3F4F6]">
            <Menu className="h-6 w-6" />
          </button>
          <span className="text-xl font-extrabold bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent">
            InterviewIQ
          </span>
          <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white shadow-glow text-xs">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        </header>

        {/* Content Pane */}
        <main className="flex-1 p-6 md:p-10 max-w-7xl w-full mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};
