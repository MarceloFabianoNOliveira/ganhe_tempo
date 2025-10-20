import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { DemandProvider } from '@/contexts/DemandContext';
import { LaundryProvider } from '@/contexts/LaundryContext';
import { LoginForm } from '@/components/LoginForm';
import { Layout } from '@/components/Layout';
import { Navigation } from '@/components/Navigation';
import { Dashboard } from '@/components/Dashboard';
import { DemandForm } from '@/components/DemandForm';
import { DemandList } from '@/components/DemandList';
import { LaundrySettings } from '@/components/LaundrySettings';
import { BusinessManagement } from '@/components/BusinessManagement';
import { SuperAdminPanel } from '@/components/SuperAdminPanel';
//import { UserManagement } from '@/components/UserManagement';
import { SignupFormContent } from '@/components/auth/SignupFormContent';
import { UserProfile } from '@/components/UserProfile';
import { CategoryManagement } from '@/components/CategoryManagement';
import { Reports } from '@/components/Reports';

const AppContent = () => {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading2, setIsLoading] = useState(false);

  //Redirecionamento baseado no papel do usuário
  useEffect(() => {
    if (user) {
      switch (user.role) {
        case 'super_admin':
          setActiveTab('super-admin');
          break;
        case 'admin':
          setActiveTab('dashboard');
          break;
        case 'manager':
          //setActiveTab('dashboard');
          break;
        case 'operator':
          setActiveTab('dashboard');
          break;
        default:
          setActiveTab('dashboard');
      }
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-laundry-blue mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const renderContent = () => {
    if (user.role === 'super_admin') {
      return <SuperAdminPanel />;
    }

    if (user.role === 'admin') {
      switch (activeTab) {
        case 'dashboard':
          return <Dashboard />;
        case 'user-management':
          return <SignupFormContent 
              onSwitchToLogin={null}            
              isLoading={isLoading2}
              setIsLoading={setIsLoading}
            />
        case 'business-management':
          return <BusinessManagement />;
        case 'category-management':
          return <CategoryManagement />;
        case 'profile':
          return <UserProfile />;
        default:
          return <Dashboard />;
      }
    }

    if (user.role === 'manager') {
      switch (activeTab) {
        case 'dashboard':
          return <Dashboard />;
        case 'new-demand':
          return <DemandForm />;
        case 'demands':
          return <DemandList />;
        case 'reports':
          return <Reports />;
        case 'profile':
          return <UserProfile />;
        default:
          return <Dashboard />;
      }
    }

    // Para operador
    if (user.role === 'operator') {
      switch (activeTab) {
        case 'dashboard':
          return <Dashboard />;
        case 'new-demand':
          return <DemandForm />;
        case 'demands':
          return <DemandList />;
        case 'profile':
          return <UserProfile />;
        default:
          return <Dashboard />;
      }
    }

    // Fallback padrão
    return <Dashboard />;
  };

  //parte superior da página
  return (
    <Layout>
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      {renderContent()}
    </Layout>
  );
};

const Index = () => {
  return (
    <AuthProvider>
      <LaundryProvider>
        <DemandProvider>
          <AppContent />
        </DemandProvider>
      </LaundryProvider>
    </AuthProvider>
  );
};

export default Index;
