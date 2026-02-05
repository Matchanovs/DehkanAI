
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation, NavPage } from './components/Navigation';
import { useHistory } from './hooks/useHistory';
import { useProfile } from './hooks/useProfile';
import { DiagnosePage } from './pages/DiagnosePage';
import { HistoryPage } from './pages/HistoryPage';
import { MapPage } from './pages/MapPage';
import { HelpPage } from './pages/HelpPage';
import { HomePage } from './pages/HomePage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdvicePage } from './pages/AdvicePage';
import { AuthPage } from './pages/AuthPage';
import { authService } from './services/authService';

type AppScreen = NavPage | 'diagnose' | 'advice';

const App: React.FC = () => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);

  const [page, setPage] = useState<AppScreen>('home');
  const { history, addHistoryItem } = useHistory();
  const { profile, updateProfile, setProfile } = useProfile();
  
  // State to manage active items
  const [activeHistoryItem, setActiveHistoryItem] = useState(null);
  const [selectedAdvice, setSelectedAdvice] = useState<any>(null);

  // Check auth status on load
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setIsAuthenticated(true);
      setProfile(user); // Sync profile hook with stored session
    }
    setIsAuthChecking(false);
  }, [setProfile]);

  const handleLoginSuccess = (user: any) => {
    setProfile(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setPage('home');
  };

  const viewHistoryItem = (item: any) => {
    setActiveHistoryItem(item);
    setPage('diagnose');
  };
  
  const handleAdviceClick = (adviceData: any, weatherData: any) => {
      setSelectedAdvice({ advice: adviceData, weather: weatherData });
      setPage('advice');
  };
  
  const resetActiveItem = () => {
    setActiveHistoryItem(null);
  };

  const renderContent = () => {
    switch (page) {
      case 'home':
        return <HomePage 
                  history={history}
                  onDiagnoseClick={() => {
                    resetActiveItem();
                    setPage('diagnose');
                  }}
                  onSelectItem={viewHistoryItem}
                  onAdviceClick={handleAdviceClick}
                  userProfile={profile}
               />;
      case 'history':
        return <HistoryPage history={history} onSelect={viewHistoryItem} />;
      case 'map':
        return <MapPage history={history} onBack={() => setPage('home')} />;
      case 'help':
        return <HelpPage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'profile':
        return (
          <div className="space-y-6">
            <ProfilePage profile={profile} onSave={updateProfile} />
            <button 
              onClick={handleLogout}
              className="w-full text-red-500 font-bold py-4 rounded-xl border border-red-100 bg-red-50 hover:bg-red-100 transition-colors"
            >
              Chiqish
            </button>
          </div>
        );
      case 'advice':
        return <AdvicePage data={selectedAdvice} onBack={() => setPage('home')} />;
      case 'diagnose':
      default:
        return (
          <DiagnosePage 
            addHistoryItem={addHistoryItem} 
            activeItem={activeHistoryItem}
            resetActiveItem={resetActiveItem}
            setActiveItem={setActiveHistoryItem}
          />
        );
    }
  };

  if (isAuthChecking) {
    return <div className="min-h-screen bg-brand-light-gray flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-brand-green"></div>
    </div>;
  }

  if (!isAuthenticated) {
    return <AuthPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="bg-brand-light-gray min-h-screen flex flex-col font-sans">
      <Header 
        onMapClick={() => setPage('map')}
        onNotificationClick={() => setPage('notifications')}
        onProfileClick={() => setPage('profile')}
      />
      <main className="flex-grow container mx-auto p-4 md:p-6 flex flex-col items-center overflow-auto">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-6 min-h-[500px]">
          {renderContent()}
        </div>
      </main>
      <Navigation activePage={page} setPage={setPage} />
    </div>
  );
};

export default App;
