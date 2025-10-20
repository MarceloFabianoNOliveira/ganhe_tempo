
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

/*interface LoginFormContentProps {
  onSwitchToSignup: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const LoginFormContent: React.FC<LoginFormContentProps> = ({
  onSwitchToSignup,
  isLoading,
  setIsLoading
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha email e senha.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);

    const result = await authLogin(email, password);
    console.log('Result: ', result);

    setIsLoading(false);

    if (!result.success) {
      toast({
        title: "Erro no login",
        description: "Email ou senha incorretos.",
        variant: "destructive",
      });
      return;
    } else {
      toast({
        title: "Login realizado",
        description: "Bem-vindo(a) de volta!",
      });
      
      
    }
  };*/


  //PARA A TELA DE ESQUECER SENHA
  interface LoginFormContentProps {
    onSwitchToSignup: () => void;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
  }

export const LoginFormContent: React.FC<LoginFormContentProps> = ({
  onSwitchToSignup,
  isLoading,
  setIsLoading
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha email e senha.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);

    const result = await authLogin(email, password);
    console.log('Result: ', result);

    setIsLoading(false);

    if (!result.success) {
      toast({
        title: "Erro no login",
        description: "Email ou senha incorretos.",
        variant: "destructive",
      });
      return;
    } else {
      toast({
        title: "Login realizado",
        description: "Bem-vindo(a) de volta!",
      });
      
      /*if (result.redirect) {
        navigate(result.redirect);
      } else {
        navigate('/');
      }*/
    }
  };



  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          type="password"
          placeholder="Sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-laundry-blue hover:bg-laundry-blue-dark"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Entrando...
          </>
        ) : (
          'Entrar'
        )}
      </Button>
      <div className="mt-6 text-sm text-muted-foreground">
        <div className="flex flex-col items-center gap-2">
          <p>
            Esqueceu a Senha?{' '}
            <button
              type="button"
              className="underline text-laundry-blue hover:text-laundry-blue-dark"
              onClick={onSwitchToSignup}
              disabled={isLoading}
            >
              Clique Aqui
            </button>
          </p>
          
        </div>
      </div>
    </form>
  );
};
