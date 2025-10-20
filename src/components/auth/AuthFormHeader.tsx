
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Shirt } from 'lucide-react';

interface AuthFormHeaderProps {
  variant: 'login' | 'passwordForgot';
}

export const AuthFormHeader: React.FC<AuthFormHeaderProps> = ({ variant }) => {
  return (
    <CardHeader className="text-center">
      <div className="flex justify-center mb-4">        
          <img
          src="/ganhe_tempo.png"
          alt="Ícone de Camisa"
          className="h-45 w-45 object-contain"
        />       
      </div>
      <CardTitle className="text-2xl text-laundry-blue">Gestão com Inteligência</CardTitle>
      <CardDescription>
        {variant === 'login'
          ? 'Faça login para acessar o sistema'
          : 'Preencha os dados para criar sua conta'}
      </CardDescription>
    </CardHeader>
  );
};
