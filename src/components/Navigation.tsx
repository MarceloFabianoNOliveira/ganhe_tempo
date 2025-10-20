import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Plus, List, Settings, Building2, Menu, X, Users, Store, User, Tags, FileText } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const { user } = useAuth();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

   
  // Garante que o activeTab tenha um valor padrão ao trocar de usuário/role
  useEffect(() => {
    if (user?.role === 'super_admin' && activeTab !== 'super-admin') {
      setActiveTab('super-admin');
    } else if (user?.role === 'admin' && !["dashboard", "user-management", "business-management", "category-management", "profile"].includes(activeTab)) {
      setActiveTab('dashboard');
    } else if (user?.role === 'manager' && !["dashboard", "new-demand", "demands", "reports", "profile"].includes(activeTab)) {
      setActiveTab('dashboard');
    } else if (!user?.role && activeTab !== 'dashboard') {
      setActiveTab('dashboard');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const getNavItems = () => {
    if (user?.role === 'super_admin') {
      return [
        { id: 'super-admin', label: 'Painel Super Admin', icon: Building2 }
      ];
    }

    if (user?.role === 'admin') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'user-management', label: 'Usuários', icon: Users },
        { id: 'business-management', label: 'Negócio', icon: Store },
        { id: 'category-management', label: 'Categoria de serviço', icon: Tags },
        { id: 'profile', label: 'Perfil do Usuário', icon: User },
       
      ];
    }
    if (user?.role === 'manager') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'new-demand', label: 'Nova Demanda', icon: Plus },
        { id: 'demands', label: 'Demandas', icon: List },
        { id: 'reports', label: 'Relatório', icon: FileText }
      ];
    }
    // Para operadores
    return [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'new-demand', label: 'Nova Demanda', icon: Plus },
      { id: 'demands', label: 'Demandas', icon: List }
    ];
  };

  const navItems = getNavItems();

  const handleTabSelect = (tabId: string) => {
    setActiveTab(tabId);
    setIsSheetOpen(false);
  };

  console.log("teste nave ", navItems);
  const NavButton = ({ item }: { item: any }) => {
    const Icon = item.icon;
    const isActive = activeTab === item.id;

    return (
      <Button
        key={item.id}
        variant={isActive ? "default" : "outline"}
        onClick={() => handleTabSelect(item.id)}
        className={`flex items-center space-x-2 w-full sm:w-auto ${
          isActive
            ? 'bg-laundry-blue hover:bg-laundry-blue-dark'
            : 'hover:bg-laundry-blue-light'
        }`}
      >
        <Icon className="h-4 w-4" />
        <span>{item.label}</span>
      </Button>
    );
  };

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden sm:flex flex-wrap gap-2 mb-8">
        {navItems.map((item) => (
          <NavButton key={item.id} item={item} />
        ))}
      </div>

      {/* Mobile Navigation */}
      <div className="sm:hidden mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {navItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
          </h2>
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="space-y-3 pt-6">
                <h3 className="font-semibold text-lg mb-4">Menu</h3>
                {navItems.map((item) => (
                  <NavButton key={item.id} item={item} />
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  );
};
