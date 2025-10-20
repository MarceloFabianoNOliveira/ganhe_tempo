import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, Shirt, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useLaundries } from '@/contexts/LaundryContext';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { laundries } = useLaundries();

  // Recupera informações do negócio/lavanderia principal (primeira da lista)
  const mainLaundry = laundries.length > 0 ? laundries[0] : null;
  const showBusinessBranding = user && (user.role === 'operator' || user.role === 'manager');

  // Nome do negócio ou título default
  const businessName = showBusinessBranding
    ? mainLaundry?.name || 'Lavanderia'
    : mainLaundry?.name;

  // Caminho para o logo, se existir, do contrário undefined
  const businessLogo = showBusinessBranding && mainLaundry?.logo ? mainLaundry.logo : undefined;

  console.log("teste");
  const handleLogout = async () => {
    console.log("sair");
    await logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              {/* Logo ou imagem do negócio */}
              <div className="p-2 bg-laundry-blue rounded-lg flex items-center justify-center h-10 w-10">
                {businessLogo ? (
                  <img
                    src={businessLogo}
                    alt={businessName}
                    className="h-8 w-8 object-contain rounded bg-white"
                    style={{ maxHeight: 32, maxWidth: 32 }}
                  />
                ) : (
                  <Shirt className="h-6 w-6 text-white" />
                )}
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-laundry-blue">{businessName}</h1>
                <p className="text-sm text-muted-foreground">
                  {showBusinessBranding ? 'Gestão de Demandas' : 'Gestão de Demandas'}
                </p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-lg font-bold text-laundry-blue">{businessName}</h1>
              </div>
            </div>
            {/* BARRA DE NAVEGAÇÃO */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Mobile user info - simplified */}
              <div className="hidden sm:flex items-center space-x-2 text-sm">
                <User className="h-4 w-4" />
                <span className="font-medium">{user?.name}</span>
                <span className="text-muted-foreground">({user?.role})</span>
              </div>
              
              {/* Mobile user info - compact */}
              <div className="sm:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-2">
                      <User className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-72">
                    <div className="space-y-4 pt-6">
                      <div className="flex items-center space-x-2">
                        <User className="h-5 w-5" />
                        <div>
                          <p className="font-medium">{user?.name}</p>
                          <p className="text-sm text-muted-foreground">{user?.role}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sair</span>
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
              
             <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="hidden sm:flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {children}
      </main>
    </div>
  );
};
