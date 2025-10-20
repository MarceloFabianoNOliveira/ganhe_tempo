
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { AuthFormHeader } from '@/components/auth/AuthFormHeader';
import { LoginFormContent } from '@/components/auth/LoginFormContent';
import { SignupFormContent } from '@/components/auth/SignupFormContent';
import { PasswordForgotFormContent } from '@/components/auth/PasswordForgotFormContent';

export const LoginForm = () => {
  const [variant, setVariant] = useState<'login' | 'passwordForgot'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Se usuário já está logado, envia para homepage
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    checkSession();
  }, [navigate]);

  /*const handleSwitchToSignup = () => {
    setVariant('signup');
  };*/

  const handleSwitchToPasswordForgot = () => {
    setVariant('passwordForgot');
  };
  const handleSwitchToLogin = () => {
    setVariant('login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <Card className="w-full max-w-md">
        <AuthFormHeader variant={variant} />
        <CardContent>
          {variant === 'login' ? (
            <LoginFormContent
              onSwitchToSignup={handleSwitchToPasswordForgot}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          ) : (
            /*<SignupFormContent
              onSwitchToLogin={handleSwitchToLogin}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />*/
            <PasswordForgotFormContent
              onSwitchToLogin={handleSwitchToLogin}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
