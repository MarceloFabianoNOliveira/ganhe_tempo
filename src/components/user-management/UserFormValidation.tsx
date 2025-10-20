
import React from 'react';
import { toast } from '@/hooks/use-toast';
import { SystemUser, NewUserFormData } from '@/types/user';
import { validatePassword } from '@/utils/userValidation';

interface ValidationProps {
  formData: NewUserFormData;
  existingEmails: string[];
  editUser?: SystemUser | null;
  profileRoles: string[];
}

export const validateUserForm = ({ 
  formData, 
  existingEmails, 
  editUser, 
  profileRoles 
}: ValidationProps) => {
  const { name, email, password, role, laundryId } = formData;

  if (!name || !email || (!editUser && !password) || !role || !laundryId) {
    toast({
      title: "Campos obrigatórios",
      description: "Todos os campos são obrigatórios.",
      variant: "destructive",
    });
    return false;
  }

  if (profileRoles.length === 0) {
    toast({
      title: "Nenhum perfil disponível",
      description: "É necessário cadastrar pelo menos um perfil antes de criar usuários.",
      variant: "destructive",
    });
    return false;
  }

  if (!editUser) {
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      toast({
        title: "Senha inválida",
        description: "A senha deve atender a todos os critérios de segurança.",
        variant: "destructive",
      });
      return false;
    }
  }

  if (
    existingEmails.includes(email) &&
    (!editUser || email !== editUser.email)
  ) {
    toast({
      title: "Email já cadastrado",
      description: "Este email já está sendo usado por outro usuário.",
      variant: "destructive",
    });
    return false;
  }

  return true;
};
