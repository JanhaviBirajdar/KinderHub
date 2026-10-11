import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { ChildrenPage } from './pages/ChildrenPage';
import { AdmissionsPage } from './pages/AdmissionsPage';
import { ClassesPage } from './pages/ClassesPage';
import { TeachersPage } from './pages/TeachersPage';
import { AttendancePage } from './pages/AttendancePage';
import { FeesPage } from './pages/FeesPage';
import { ActivitiesPage } from './pages/ActivitiesPage';
import { TimetablePage } from './pages/TimetablePage';
import { EventsPage } from './pages/EventsPage';
import { CommunicationPage } from './pages/CommunicationPage';
import { ReportsPage } from './pages/ReportsPage';
import { TeacherPortal } from './pages/TeacherPortal';
import { ParentPortal } from './pages/ParentPortal';
import { ProfilePage } from './pages/ProfilePage';

export function App() {
  const { user, token, role, loading, switchRole } = useAuth();
  const [activeTab, setActiveTab] = useState('admin_dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLoginPage, setShowLoginPage] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle direct demo logins from landing page
  const handleDirectDemoLogin = async (targetRole) => {
    await switchRole(targetRole);
    if (targetRole === 'teacher') setActiveTab('teacher_dashboard');
    else if (targetRole === 'parent') setActiveTab('parent_dashboard');
    else setActiveTab('admin_dashboard');
  };

  // Synchronize default dashboard tab when role switches
  React.useEffect(() => {
    if (role === 'teacher' && activeTab === 'admin_dashboard') {
      setActiveTab('teacher_dashboard');
    } else if (role === 'parent' && activeTab === 'admin_dashboard') {
      setActiveTab('parent_dashboard');
    } else if ((role === 'super_admin' || role === 'school_admin') && (activeTab === 'teacher_dashboard' || activeTab === 'parent_dashboard')) {
      setActiveTab('admin_dashboard');
    }
  }, [role]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-500">Initializing KinderHub...</p>
        </div>
      </div>
    );
  }

  // If not logged in, show Landing Page or Login Page
  if (!token || !user) {
    if (showLoginPage) {
      return <LoginPage onSwitchToLanding={() => setShowLoginPage(false)} />;
    }
    return (
      <LandingPage
        onGoToLogin={() => setShowLoginPage(true)}
        onDirectDemoLogin={handleDirectDemoLogin}
      />
    );
  }

  // Render Page Content based on activeTab
  const renderContent = () => {
    switch (activeTab) {
      case 'admin_dashboard':
        return <AdminDashboard onNavigate={(tab) => setActiveTab(tab)} />;
      case 'teacher_dashboard':
        return <TeacherPortal onNavigate={(tab) => setActiveTab(tab)} />;
      case 'parent_dashboard':
        return <ParentPortal onNavigate={(tab) => setActiveTab(tab)} />;
      case 'admissions':
        return <AdmissionsPage />;
      case 'children':
        return <ChildrenPage />;
      case 'classes':
        return <ClassesPage />;
      case 'teachers':
        return <TeachersPage />;
      case 'attendance':
        return <AttendancePage />;
      case 'fees':
        return <FeesPage />;
      case 'activities':
      case 'progress':
        return <ActivitiesPage />;
      case 'timetable':
        return <TimetablePage />;
      case 'events':
        return <EventsPage />;
      case 'announcements':
      case 'messages':
      case 'leave_requests':
        return <CommunicationPage />;
      case 'reports':
        return <ReportsPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <AdminDashboard onNavigate={(tab) => setActiveTab(tab)} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Role-Aware Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onSearchQuery={(q) => setSearchQuery(q)}
        />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;
