import { useEffect, useState } from 'react';
import { Colmeia, SpeciesInfo, HiveStatus } from './types';
import { Navigation } from "./components/Navigation";
import { Hexagon } from 'lucide-react';
import { Dashboard } from "./components/Dashboard";
import { SearchBar } from "./components/SearchBar";
import { Badge } from "./components/ui/badge";
import { HiveList } from "./components/HiveList";
import { OfflineStatus } from "./components/OfflineStatus";
import { Toaster } from "./components/ui/sonner";
import { toast } from 'sonner';
import { isLocalEnvironment, STORAGE_KEYS } from './utils/constants';
import { filterHives } from './utils/hiveUtils';
import { apiService } from './services/apiService';
import './styles/globals.css';
import { Login } from './components/Login';
import { ForgotPassword } from './components/ForgotPassword';
import { ResetPassword } from './components/ResetPassword';
import { UserProfile } from './components/UserProfile';

const AUTH_KEY = 'hive_auth_user';

function App() {
  const [hives, setHives] = useState<Colmeia[]>([]);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [searchCode, setSearchCode] = useState<string>('');
  const [currentView, setCurrentView] = useState<'dashboard' | 'listing' | 'profile'>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [authView, setAuthView] = useState<'login' | 'forgot-password' | 'reset-password'>('login');

  const isLocalhost = isLocalEnvironment();

  // Check for stored auth on mount
    useEffect(() => {
      if (apiService.isAuthenticated()) {
        const storedUser = localStorage.getItem(AUTH_KEY);
        if (storedUser) {
          setCurrentUser(storedUser);
          setIsAuthenticated(true);
          setCurrentView('dashboard'); // Always start on dashboard
        }
      }
    }, []);

  // Load data from localStorage on component mount (only for production)
  useEffect(() => {
    if (!isLocalhost) {
      const savedData = localStorage.getItem(STORAGE_KEYS.HIVES_DATA);
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setHives(parsedData);
        } catch (error) {
          console.error('Error parsing saved data:', error);
        }
      }
    }
  }, [isLocalhost]);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiService.getHives();
        if (result.success && result.data) {
          console.log('Fetched hives data:', result.data);
          setHives(result.data);
          // Save to localStorage for offline persistence
          localStorage.setItem(STORAGE_KEYS.HIVES_DATA, JSON.stringify(result.data));
        } else {
          throw new Error(result.error || 'Failed to fetch hives');
        }
      } catch (err) {
        console.error('Fetch failed:', err);
        // Don't clear hives on fetch error - keep cached data
        if (!isOnline) {
          console.log('Offline - using cached data');
        }
      }
    };

    if (isAuthenticated) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline, isAuthenticated]);

  const handleAddHive = (newHive: {
    code?: number;
    species: SpeciesInfo;
    status: HiveStatus;
  }) => {
    const hive: Colmeia = {
      ID: Date.now().toString(),
      Code: newHive.code,
      Species: {
        ID: newHive.species.ID,
        CommonName: newHive.species.CommonName,
        ScientificName: newHive.species.ScientificName
      },
      Status: newHive.status,
      StartingDate: new Date().toLocaleDateString('pt-BR'),
    };
    
    setHives(prev => [hive, ...prev]);
  };

  const handleQRScan = () => {
    toast.info("Funcionalidade de QR Code em desenvolvimento");
  };

  const handleLogin = (email: string) => {
    setCurrentUser(email);
    setIsAuthenticated(true);
    setCurrentView('dashboard'); // Always open on dashboard after login
    localStorage.setItem(AUTH_KEY, email);
  };

  const handleLogout = () => {
    apiService.logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_KEY);
    toast.info("Você saiu do sistema");
  };

  const handleForgotPassword = () => {
    setAuthView('forgot-password');
  };

  const handleBackToLogin = () => {
    setAuthView('login');
  };

  const handleGoToResetPassword = () => {
    setAuthView('reset-password');
  };

  const handleResetPasswordSuccess = () => {
    setAuthView('login');
    toast.success("Você pode fazer login com sua nova senha");
  };

  // Show authentication screens if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <Toaster position="top-right" />
        {authView === 'login' && (
          <Login onLogin={handleLogin} onForgotPassword={handleForgotPassword} />
        )}
        {authView === 'forgot-password' && (
          <ForgotPassword onBack={handleBackToLogin} onResetPassword={handleGoToResetPassword} />
        )}
        {authView === 'reset-password' && (
          <ResetPassword onSuccess={handleResetPasswordSuccess} />
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background">
    
    {/* Header */}
    <div className="bg-amber-50 border-b border-amber-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="text-center">
            <h1 className="flex items-center justify-center gap-3 text-lg">
              <Hexagon className="w-8 h-8 text-amber-700" />
              B O M B U S  |  Meliponário Isobe
            </h1>
            <p className="text-amber-700 mt-1 text-sm">
              Sistema de gerenciamento de colmeias
            </p>
            <div className="mt-2 flex justify-center gap-4">
              <OfflineStatus />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <Navigation 
        currentView={currentView}
        onViewChange={setCurrentView}
      />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' ? (
          <Dashboard hives={hives} onAddHive={handleAddHive} />
        ) : currentView === 'listing' ? (
          <div className="space-y-6">
            {/* Search and Filters */}
            <SearchBar
              searchTerm={searchCode}
              onSearchChange={setSearchCode}
              onQRScan={handleQRScan}
            />

            {/* Results Summary */}
            {searchCode && (
              <div className="mb-4">
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  {filterHives(hives, searchCode).length} resultados para "{searchCode}"
                </Badge>
              </div>
            )}

            {/* Hive List */}
            <HiveList hives={hives} searchTerm={searchCode} />
          </div>
        ) : (
          <UserProfile userEmail={currentUser} onLogout={handleLogout} />
        )}
      </div>
      <Toaster />
    </div>
  );
}

export default App;
