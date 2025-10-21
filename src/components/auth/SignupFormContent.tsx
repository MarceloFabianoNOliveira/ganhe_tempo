
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Shield, Building2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useProfileRoles } from '@/hooks/useProfileRoles';
import { useLaundries } from '@/contexts/LaundryContext';

interface SignupFormContentProps {
  onSwitchToLogin: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}
//Type '{}' is missing the following properties from type 'SignupFormContentProps': onSwitchToLogin, isLoading, setIsLoadingts(2739)

export const SignupFormContent: React.FC<SignupFormContentProps> = ({
  //onSwitchToLogin,
  isLoading,
  setIsLoading
}) => {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [signupError, setSignupError] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  //const [selectedLaundryId, setSelectedLaundryId] = useState('');
  const [selectedLaundryId, setSelectedLaundryId] = React.useState<string>("");

  const profileRoles = useProfileRoles();
  const { laundries } = useLaundries();

  useEffect(() => {
    setSelectedRole(profileRoles.length > 0 ? profileRoles[0] : '');
    setSelectedLaundryId(laundries.length > 0 ? laundries[0].id : '');
  }, [profileRoles, laundries]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');//ELIMINA A LISTA DE ERROS ANTERIOR

    console.log("NOME ", name);
    //SEÇÃO DE CRÍTICAS
    if (!name || !email || !password || !confirmPassword || !selectedRole || !selectedLaundryId) {
      setSignupError('Todos os campos são obrigatórios.');
      return;
    }
    if (password !== confirmPassword) {
      setSignupError('As senhas não coincidem.');
      return;
    }
    if(name.length < 6){
      setSignupError('O Nome de Usuário deve ter, pelo menos, 6 caracteres!');
      return;
    }

    if(!email){
     const { data, error } = await supabase
          .from('system_users')
          .select('*')
          .eq('Email', email);
         
        if (error) {
          console.error('Erro ao atualizar usuário:', error.message);
        } else {
          const quantidade = data.length;
          if(quantidade > 0 ){
            setSignupError('Esse e-mail consta da base de usuários cadastrados!');
            return;
          }
        }   
    }
    setIsLoading(true);

    const redirectUrl = `${window.location.origin}/`;  //REDIRECIONA PARA O LOCAL ORIGINAL

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: selectedRole,
          laundryId: selectedLaundryId,
        },
        emailRedirectTo: redirectUrl,
      }
    });

    if (error) {
      setIsLoading(false);
      setSignupError(error.message || 'Erro ao criar conta');
      return;
    }

    const user = data?.user;
    
    
    if (user && user.id) {
      const { error: sysUsersError } = await supabase
        .from('system_users')
        .insert([{
          auth_uid: user.id,
          name: name,
          email,
          role: selectedRole,
          laundryId: selectedLaundryId
        }]);
      if (sysUsersError) {
        setIsLoading(false);
        setSignupError(
          'Usuário criado no sistema, mas houve problema ao salvar os dados complementares. '
          + (sysUsersError.message ?? '')
        );
        return;
      }
    }

    setIsLoading(false);
    toast({
      title: "Cadastro realizado",
      description: "Foi enviado um email de confirmação. Verifique sua caixa de entrada.",
    });
    //onSwitchToLogin();
  };

  return (
    <form onSubmit={handleSignup} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signup-name">Nome do Usuário</Label>
        <Input
          id="signup-name"
          type="name"
          placeholder="Nome do Usuário"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-password">Senha</Label>
        <Input
          id="signup-password"
          type="password"
          placeholder="Crie uma senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-confirm">Confirmar Senha</Label>
        <Input
          id="signup-confirm"
          type="password"
          placeholder="Repita sua senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-role">Perfil de Usuário *</Label>
        <div className="relative">
          <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
          <Select
            value={selectedRole}
            onValueChange={setSelectedRole}
            required
            disabled={profileRoles.length === 0}
          >
            <SelectTrigger className="pl-10">
              <SelectValue placeholder={
                profileRoles.length === 0
                  ? "Nenhum perfil disponível"
                  : "Selecione um perfil"
              } />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {profileRoles.length > 0 ? (
                profileRoles.map(perfil => (
                  <SelectItem key={perfil} value={perfil}>
                    {perfil}
                  </SelectItem>
                ))
              ) : null}
            </SelectContent>
          </Select>
          {profileRoles.length === 0 && (
            <p className="mt-1 text-xs text-destructive">
              Nenhum perfil de usuário cadastrado. Peça para o admin cadastrar no painel antes de criar contas.
            </p>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="signup-laundry">Negócio/Lavanderia *</Label>
        <div className="relative">
          <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
          <Select
            value={selectedLaundryId}
            onValueChange={setSelectedLaundryId}            
            disabled={laundries.length === 0}
          >
            <SelectTrigger className="pl-10">
              <SelectValue placeholder="Selecione um negócio" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {laundries.length > 0 ? (
                laundries.map((laundry) => (
                  <SelectItem key={laundry.id} value={String(laundry.id)}>
                   <div className="flex flex-col">
                      <span className="font-medium">{laundry.name}</span>
                      <span className="text-xs text-muted-foreground">{laundry.phone}</span>
                      <span className="text-xs text-muted-foreground">{laundry.address}</span>
                    </div>
                  </SelectItem>
                ))
              ) : null}
            </SelectContent>
          </Select>
          {laundries.length === 0 && (
            <p className="mt-1 text-xs text-destructive">
              Nenhum negócio cadastrado. Peça para o admin cadastrar ao menos um no painel antes de criar contas.
            </p>
          )}
        </div>
      </div>
      {signupError && (
        <div className="text-sm text-red-600">{signupError}</div>
      )}
      <Button
        type="submit"
        className="w-full bg-laundry-blue hover:bg-laundry-blue-dark"
        disabled={isLoading || profileRoles.length === 0 || laundries.length === 0}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Cadastrando...
          </>
        ) : (
          'Cadastrar Novo Usuário'
        )}
      </Button>
      {/*<div className="mt-6 text-sm text-muted-foreground">
        <div className="flex flex-col items-center gap-2">
          <p>
            Já possui uma conta?{' '}
            <button
              type="button"
              className="underline text-laundry-blue hover:text-laundry-blue-dark"
              //onClick={onSwitchToLogin}
              disabled={isLoading}
            >
              Fazer login
            </button>
          </p>
        </div>
      </div>*/}
    </form>
  );
};
