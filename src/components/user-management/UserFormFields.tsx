
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Mail, Shield, Building2, Lock, Eye, EyeOff } from 'lucide-react';
import { useLaundries } from '@/contexts/LaundryContext';
import { SystemUser, NewUserFormData } from '@/types/user';
import { validatePassword } from '@/utils/userValidation';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';

interface UserFormFieldsProps {
  formData: NewUserFormData;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  updateFormData: (field: keyof NewUserFormData, value: string) => void;
  editUser?: SystemUser | null;
  profileRoles: string[];
}

export const UserFormFields: React.FC<UserFormFieldsProps> = ({
  formData,
  showPassword,
  setShowPassword,
  updateFormData,
  editUser,
  profileRoles
}) => {
  const { laundries } = useLaundries();
  const passwordValidation = validatePassword(formData.password);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="userName">Nome Completo *</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="userName"
              value={formData.name}
              onChange={(e) => updateFormData('name', e.target.value)}
              placeholder="Nome do usuário"
              className="pl-10"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="userEmail">Email *</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="userEmail"
              type="email"
              value={formData.email}
              onChange={(e) => updateFormData('email', e.target.value)}
              placeholder="usuario@email.com"
              className="pl-10"
              required
              disabled={!!editUser}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="userPassword">
          {editUser ? "Nova Senha (opcional)" : "Senha *"}
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="userPassword"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => updateFormData('password', e.target.value)}
            placeholder={editUser ? "Deixe em branco para não alterar" : "Digite uma senha forte"}
            className="pl-10 pr-10"
            required={!editUser}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-gray-700"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        
        <PasswordStrengthIndicator validation={passwordValidation} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="userRole">Perfil de Usuário *</Label>
          <div className="relative">
            <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
            <Select
              value={formData.role}
              onValueChange={(value: string) => updateFormData('role', value)}
              disabled={profileRoles.length === 0}
              required
            >
              <SelectTrigger className="pl-10">
                <SelectValue placeholder={
                  profileRoles.length === 0
                    ? "Nenhum perfil disponível"
                    : "Selecione um perfil"
                } />
              </SelectTrigger>
              <SelectContent>
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
                Nenhum perfil de usuário cadastrado. Use o Gerenciamento de Perfis para adicionar pelo menos um perfil antes de criar usuários.
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="userBusiness">Negócio/Lavanderia *</Label>
          <div className="relative">
            <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
            <Select 
              value={formData.laundryId} 
              onValueChange={(value: string) => updateFormData('laundryId', value)}
              required
            >
              <SelectTrigger className="pl-10">
                <SelectValue placeholder="Selecione um negócio" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {laundries.length > 0 ? (
                  laundries.map((laundry) => (
                    <SelectItem key={laundry.id} value={laundry.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{laundry.name}</span>
                        <span className="text-xs text-muted-foreground">{laundry.address}</span>
                      </div>
                    </SelectItem>
                  ))
                ) : null}
              </SelectContent>
            </Select>
            {laundries.length === 0 && (
              <p className="mt-1 text-xs text-destructive">
                Nenhum negócio cadastrado. Use o Gerenciamento de Negócios para adicionar pelo menos um negócio antes de criar usuários.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
