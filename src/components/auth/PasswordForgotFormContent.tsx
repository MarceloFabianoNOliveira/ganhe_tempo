
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

interface PasswordForgotFormContentProps {
  onSwitchToLogin: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

//FUNÇÃO DE VALIDAÇÃO DE EMAIL
const validateEmail = (value: string): boolean => {
    // Regex simples para validar e-mail
    return /\S+@\S+\.\S+/.test(value);
  };

console.log("PASS");
export const PasswordForgotFormContent: React.FC<PasswordForgotFormContentProps> = ({
  onSwitchToLogin,
  isLoading,
  setIsLoading
}) => {
  const [email, setEmail] = useState('');
 
  
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();  

    setIsLoading(true);

    const redirectUrl = `${window.location.origin}/`;

    

      // Supondo que sua tabela se chame "users" e tenha a coluna "email"
      const { data, error } = await supabase
        .from("system_users")
        .select("id") // só precisa de algum campo
        .eq("email", email)
        .maybeSingle(); // retorna no máximo 1 resultado

      //INCLUIR NO BANCO DE DADOS A DEMANDA
     
      const { data: userData, error: userError } = await supabase
          .from("system_users")
          .select("id")
          .eq("email", email)
          .maybeSingle(); // retorna no máximo 1 resultado

          console.log('antes');
        if (userError) {
          console.error(userError);
          setIsLoading(false);
          //setMessage("❌ Erro ao buscar usuário.");
          return;
        }

        if (!userData) {
          setIsLoading(false);
          console.error('teste');
          //setMessage("❌ Usuário não encontrado.");
          return;
        }

        console.log('depois');
        // 👉 Aqui você já tem userData.id disponível se precisar
        console.log("ID do usuário encontrado:", userData.id);

        const { data: insertData, error: insertError } = await supabase
          .from("passwordForgot")
          .insert([
            {
              email: email,             
              flag_envio: false
            },
          ])
          .select();

        setIsLoading(false);

        if (insertError) {
          console.error(insertError);
          //setMessage("❌ Erro ao inserir demanda.");
          toast({
            title: "Erro1 1'!",
            description: "❌ Erro ao inserir demanda.",
          });
          return;
        }

        if (insertData) {
          //setMessage(`✅ Demanda inserida! ID: ${insertData[0].id}`);
        }
      setIsLoading(false);
      
      toast({
        title: "Email enviado!",
        description: "Foi enviado um email com os procedimentos para recuperar a senha. Verifique sua caixa de entrada.",
      });
      onSwitchToLogin();

    
  };

  return (
    <form onSubmit={handleSignup} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signup-email">Email de Cadastro</Label>
        <Input
          id="signup-email"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
      </div>
            
      
      <Button
        type="submit"
        value={email}
        className="w-full bg-laundry-blue hover:bg-laundry-blue-dark"
        disabled={isLoading || !validateEmail(email) }
      >
        Enviar
      </Button>
      
    </form>
  );
};
