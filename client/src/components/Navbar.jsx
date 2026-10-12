import React, { useState } from 'react';
import { 
  Menu, 
  Search, 
  Bell, 
  Sparkles, 
  ChevronDown, 
  UserCheck, 
  Shield, 
  GraduationCap, 
  Heart,
  Check,
  CalendarDays,
  Sparkle,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { OfflineStatusIndicator } from './OfflineStatusIndicator';

export const Navbar = ({ onToggleSidebar, onSearchQuery }) => {
  const { user, role, switchRole } = useAuth();
  const toast = useToast();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const roles = [
    { id: 'super_admin', label: 'Super Admin', name: 'Eleanor Vance', icon: Shield, color: 'text-purple-600 bg-purple-100/70 border-purple-200' },
    { id: 'school_admin', label: 'School Admin', name: 'Marcus Sterling', icon: UserCheck, color: 'text-sky-600 bg-sky-100/70 border-sky-200' },
    { id: 'teacher', label: 'Lead Teacher', name: 'Clara Oswald', icon: GraduationCap, color: 'text-emerald-600 bg-emerald-100/70 border-emerald-200' },
    { id: 'parent', label: 'Parent Portal', name: 'Sarah Johnson', icon: Heart, color: 'text-orange-600 bg-orange-100/70 border-orange-200' },
  ];

  const handleSwitch = async (targetRole) => {
    try {
      await switchRole(targetRole);
      setShowRoleMenu(false);
      toast.success(`Switched perspective to ${targetRole.replace('_', ' ').toUpperCase()}!`);
    } catch (err) {
      toast.error('Failed to switch role: ' + err.message);
    }
  };

  const handleSearchChange = (val) => {
    setSearchVal(val);
    if (onSearchQuery) onSearchQuery(val);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 px-4 sm:px-8 py-3 transition-all">
      <div className="flex items-center justify-between gap-3">
        {/* Left Side: Mobile Menu Button & Date Badge */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-2xl text-slate-600 hover:text-slate-900 hover:bg-purple-50 transition-colors border border-slate-200/60"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200/60 text-purple-800 text-xs font-bold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            <CalendarDays className="w-3.5 h-3.5 text-purple-600" />
            <span>Autumn Term 2026 • AY 2026-27</span>
          </div>
        </div>

        {/* Center Search Input (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-md relative mx-3">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Quick search student, class, activity, invoice..."
            value={searchVal}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50/80 border border-slate-200/80 rounded-2xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white transition-all shadow-xs"
          />
        </div>

        {/* Right Actions: Mobile search toggle, Role switcher, Notifications, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile search button */}
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="md:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Offline Persistence & Live Sync Status */}
          <OfflineStatusIndicator />

          {/* Quick Demo Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 text-purple-900 text-xs font-extrabold transition-all border border-purple-200/70 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span className="hidden sm:inline text-purple-600/80 font-normal">Perspective:</span>
              <span className="capitalize">{role.replace('_', ' ')}</span>
              <ChevronDown className="w-3.5 h-3.5 text-purple-500" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-3xl shadow-xl border border-purple-100/80 py-2.5 z-50 animate-pop-in">
                <div className="px-4 py-2 border-b border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Sparkle className="w-3.5 h-3.5 text-purple-600" />
                    <p className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider font-heading">
                      1-Click Role Switcher
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Test KinderHub across all stakeholder views</p>
                </div>

                <div className="p-2 space-y-1">
                  {roles.map(r => {
                    const Icon = r.icon;
                    const isCurrent = role === r.id;
                    return (
                      <button
                        key={r.id}
                        onClick={() => handleSwitch(r.id)}
                        className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-left text-xs transition-all ${
                          isCurrent 
                            ? 'bg-purple-50/80 border border-purple-200 text-purple-900 font-extrabold shadow-xs' 
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl border ${r.color}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold tracking-tight">{r.label}</p>
                            <p className="text-[10px] text-slate-400">{r.name}</p>
                          </div>
                        </div>
                        {isCurrent && <Check className="w-4 h-4 text-purple-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Notifications Popover */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-2xl text-slate-500 hover:text-purple-600 hover:bg-purple-50 transition-colors border border-slate-200/60"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-pink-500 ring-2 ring-white animate-pulse" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-xl border border-slate-100 p-4 z-50 animate-pop-in">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider font-heading">
                      Preschool Alerts & Bulletins
                    </h4>
                    <span className="text-[10px] bg-purple-100 text-purple-700 font-extrabold px-2 py-0.5 rounded-full">
                      3 New
                    </span>
                  </div>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="divide-y divide-slate-100 text-xs max-h-72 overflow-y-auto">
                  <div className="py-3 hover:bg-slate-50/50 px-1 rounded-xl transition-colors">
                    <p className="font-bold text-slate-800 flex items-center gap-1.5">
                      <span>🧸</span> Teddy Bear Picnic this Saturday
                    </p>
                    <p className="text-slate-500 text-[11px] mt-1 leading-relaxed">
                      Please pack labeled favorite stuffed plushies and comfortable pajama attire for morning story circle.
                    </p>
                    <span className="text-[10px] text-purple-600 font-semibold mt-1 inline-block">10 mins ago</span>
                  </div>
                  <div className="py-3 hover:bg-slate-50/50 px-1 rounded-xl transition-colors">
                    <p className="font-bold text-slate-800 flex items-center gap-1.5">
                      <span>✨</span> New Admission Approved
                    </p>
                    <p className="text-slate-500 text-[11px] mt-1 leading-relaxed">
                      Theo Clark approved for Butterflies Playgroup (AY 2026-27).
                    </p>
                    <span className="text-[10px] text-emerald-600 font-semibold mt-1 inline-block">1 hour ago</span>
                  </div>
                  <div className="py-3 hover:bg-slate-50/50 px-1 rounded-xl transition-colors">
                    <p className="font-bold text-slate-800 flex items-center gap-1.5">
                      <span>💳</span> Tuition Payment Verified
                    </p>
                    <p className="text-slate-500 text-[11px] mt-1 leading-relaxed">
                      Receipt REC-2026-801 ($1,420) issued for Mia Johnson.
                    </p>
                    <span className="text-[10px] text-sky-600 font-semibold mt-1 inline-block">Yesterday</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar with Online indicator */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="relative">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100'}
                alt={user?.name || 'User'}
                className="w-8 h-8 rounded-full object-cover border-2 border-purple-200 shadow-xs"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar Expansion */}
      {mobileSearchOpen && (
        <div className="md:hidden pt-3 mt-2 border-t border-slate-100">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search students, classes, invoices..."
              value={searchVal}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
        </div>
      )}
    </header>
  );
};
