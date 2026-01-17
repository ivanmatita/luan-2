
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import WhatsAppButton from './components/WhatsAppButton';
import LandingPage from './components/LandingPage';
import LoginForm from './components/LoginForm';
import RegisterCompanyWizard from './components/RegisterCompanyWizard';
import Dashboard from './components/Dashboard';
import { AuthState } from './types';
import { supabase } from './lib/supabaseClient';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'login' | 'register' | 'dashboard'>('landing');
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    company: null,
    isAuthenticated: false
  });

  // Verificar sessão persistente ao carregar
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: userData } = await supabase
          .from('utilizadores')
          .select('*, empresas(*)')
          .eq('id', session.user.id)
          .single();
        
        if (userData) {
          handleLoginSuccess(userData, userData.empresas);
        }
      }
    };
    checkSession();
  }, []);

  const handleLoginSuccess = (user: any, company: any) => {
    setAuth({
      user,
      company,
      isAuthenticated: true
    });
    setView('dashboard');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setAuth({ user: null, company: null, isAuthenticated: false });
    setView('landing');
  };

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard auth={auth} onLogout={handleLogout} />;
      case 'login':
        return (
          <div className="min-h-screen bg-[#001D4D]/90 flex items-center justify-center p-4">
             <LoginForm onLoginSuccess={handleLoginSuccess} />
          </div>
        );
      case 'register':
        return <RegisterCompanyWizard onComplete={() => setView('login')} onBack={() => setView('landing')} />;
      case 'landing':
      default:
        return <LandingPage onNavigate={setView} onLoginSuccess={handleLoginSuccess} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {view !== 'dashboard' && <Navbar onNavigate={setView} />}
      <main className="flex-grow">
        {renderView()}
      </main>
      <WhatsAppButton />
    </div>
  );
};

export default App;
