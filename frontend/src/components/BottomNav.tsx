/**
 * BottomNav Component
 * Bottom navigation bar with Reports, Submit, and Profile tabs
 */

interface BottomNavProps {
  activeTab?: 'reports' | 'submit' | 'profile';
  onTabChange?: (tab: 'reports' | 'submit' | 'profile') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab = 'reports', onTabChange }) => {
  const handleTabClick = (tab: 'reports' | 'submit' | 'profile') => {
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white backdrop-blur-sm border-t border-black/5">
      <nav className="flex justify-around items-center h-16">
        <button
          onClick={() => handleTabClick('reports')}
          className={`flex flex-col items-center gap-0.5 ${
            activeTab === 'reports'
              ? 'text-primary'
              : 'text-gray-500 hover:text-primary transition-colors'
          }`}
          aria-label="Reports"
        >
          <svg
            className={activeTab === 'reports' ? 'text-primary' : ''}
            fill={activeTab === 'reports' ? 'currentColor' : 'none'}
            height="22"
            stroke={activeTab === 'reports' ? 'none' : 'currentColor'}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="22"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M5 21V3h14v18l-7-3-7 3z"></path>
          </svg>
          <span className="text-xs font-medium">Reports</span>
        </button>

        <button
          onClick={() => handleTabClick('submit')}
          className={`flex flex-col items-center gap-0.5 ${
            activeTab === 'submit'
              ? 'text-primary'
              : 'text-gray-500 hover:text-primary transition-colors'
          }`}
          aria-label="Submit"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            height="22"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="22"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M5 12h14"></path>
            <path d="M12 5v14"></path>
          </svg>
          <span className="text-xs font-medium">Submit</span>
        </button>

        <button
          onClick={() => handleTabClick('profile')}
          className={`flex flex-col items-center gap-0.5 ${
            activeTab === 'profile'
              ? 'text-primary'
              : 'text-gray-500 hover:text-primary transition-colors'
          }`}
          aria-label="Profile"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            height="22"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="22"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span className="text-xs font-medium">Profile</span>
        </button>
      </nav>
      <div className="h-[env(safe-area-inset-bottom)] bg-white"></div>
    </footer>
  );
};
