import React from 'react';
import { 
  LayoutDashboard, 
  Baby, 
  School, 
  Users, 
  CalendarCheck, 
  CreditCard, 
  Sparkles, 
  Clock, 
  Calendar, 
  Megaphone, 
  MessageSquare, 
  FileText, 
  Settings, 
  LogOut, 
  ClipboardList,
  HeartHandshake,
  UserCheck,
  Award,
  X,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const { role, logout, user } = useAuth();

  // Navigation configurations tailored by user role with logical section groupings
  const getNavSections = () => {
    if (role === 'parent') {
      return [
        {
          title: 'Family Hub',
          items: [
            { id: 'parent_dashboard', label: 'Parent Dashboard', icon: LayoutDashboard },
            { id: 'children', label: 'My Children', icon: Baby },
            { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
            { id: 'fees', label: 'Fees & Receipts', icon: CreditCard },
          ]
        },
        {
          title: 'Preschool Life',
          items: [
            { id: 'activities', label: 'Activities & Progress', icon: Sparkles },
            { id: 'timetable', label: 'Class Timetable', icon: Clock },
            { id: 'events', label: 'Events & Calendar', icon: Calendar },
          ]
        },
        {
          title: 'Communication',
          items: [
            { id: 'announcements', label: 'Announcements', icon: Megaphone },
            { id: 'messages', label: 'Teacher Messages', icon: MessageSquare },
            { id: 'leave_requests', label: 'Leave Requests', icon: HeartHandshake },
            { id: 'profile', label: 'Account Profile', icon: Settings },
          ]
        }
      ];
    }

    if (role === 'teacher') {
      return [
        {
          title: 'My Classroom',
          items: [
            { id: 'teacher_dashboard', label: 'Teacher Dashboard', icon: LayoutDashboard },
            { id: 'classes', label: 'Assigned Classes', icon: School },
            { id: 'children', label: 'Class Students', icon: Baby },
            { id: 'attendance', label: 'Daily Attendance', icon: CalendarCheck },
          ]
        },
        {
          title: 'Curriculum & Growth',
          items: [
            { id: 'activities', label: 'Sensory Activities', icon: Sparkles },
            { id: 'progress', label: '5-Domain Progress', icon: Award },
            { id: 'timetable', label: 'Weekly Timetable', icon: Clock },
          ]
        },
        {
          title: 'School Connect',
          items: [
            { id: 'announcements', label: 'Bulletins', icon: Megaphone },
            { id: 'messages', label: 'Parent Messages', icon: MessageSquare },
            { id: 'profile', label: 'My Profile', icon: Settings },
          ]
        }
      ];
    }

    // Default: Super Admin & School Admin
    return [
      {
        title: 'Overview',
        items: [
          { id: 'admin_dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'admissions', label: 'Admissions Pipeline', icon: ClipboardList, badge: '4', badgeColor: 'bg-amber-100 text-amber-800' },
        ]
      },
      {
        title: 'Preschool Operations',
        items: [
          { id: 'children', label: 'Children Directory', icon: Baby },
          { id: 'classes', label: 'Classes & Ratios', icon: School },
          { id: 'teachers', label: 'Teachers & Staff', icon: Users },
          { id: 'attendance', label: 'Attendance Sheet', icon: CalendarCheck },
          { id: 'fees', label: 'Fees & Invoices', icon: CreditCard },
        ]
      },
      {
        title: 'Learning & Schedule',
        items: [
          { id: 'activities', label: 'Activities & Milestones', icon: Sparkles },
          { id: 'timetable', label: 'Class Timetables', icon: Clock },
          { id: 'events', label: 'Calendar & Events', icon: Calendar },
        ]
      },
      {
        title: 'Engagement & System',
        items: [
          { id: 'announcements', label: 'Notices & Bulletins', icon: Megaphone },
          { id: 'messages', label: 'Communication Hub', icon: MessageSquare },
          { id: 'reports', label: 'Audits & Reports', icon: FileText },
          { id: 'profile', label: 'Settings', icon: Settings },
        ]
      }
    ];
  };

  const navSections = getNavSections();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-white/95 backdrop-blur-xl border-r border-slate-200/80 z-50 flex flex-col justify-between transition-transform duration-300 ease-in-out shrink-0 shadow-lg lg:shadow-none ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Brand Logo Header */}
        <div className="p-5 border-b border-slate-100/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-300 flex items-center justify-center text-white text-2xl shadow-md shadow-purple-200/60 transition-transform hover:scale-105">
              🧸
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight leading-none font-heading flex items-center gap-1">
                Kinder<span className="text-purple-600">Hub</span>
              </h1>
              <p className="text-[10px] text-purple-700/80 font-bold tracking-wider uppercase mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                Preschool Suite
              </p>
            </div>
          </div>

          {/* Mobile close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 overflow-y-auto px-3.5 py-4 space-y-5">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              <p className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 font-heading">
                {section.title}
              </p>
              <div className="space-y-0.5 pt-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsOpen(false);
                      }}
                      className={`w-full group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 relative ${
                        isActive
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-300/40 font-bold'
                          : 'text-slate-600 hover:bg-purple-50/70 hover:text-purple-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                          isActive ? 'text-white' : 'text-slate-400 group-hover:text-purple-600'
                        }`} />
                        <span className="tracking-tight">{item.label}</span>
                      </div>
                      
                      {item.badge && !isActive && (
                        <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${item.badgeColor || 'bg-purple-100 text-purple-700'}`}>
                          {item.badge}
                        </span>
                      )}

                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-white shadow-sm animate-pulse" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Card & Logout Footer */}
        <div className="p-3.5 border-t border-slate-100 bg-gradient-to-b from-transparent to-slate-50/80">
          <div className="flex items-center justify-between gap-2 p-2 rounded-2xl bg-white border border-slate-200/70 shadow-sm">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="relative shrink-0">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100'}
                  alt={user?.name || 'User'}
                  className="w-9 h-9 rounded-xl object-cover border-2 border-purple-100 shadow-sm"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-800 truncate leading-tight">{user?.name || 'User'}</p>
                <span className="inline-block text-[9px] font-extrabold text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded uppercase tracking-wide mt-0.5 capitalize truncate">
                  {role.replace('_', ' ')}
                </span>
              </div>
            </div>

            <button
              onClick={logout}
              title="Sign Out"
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
