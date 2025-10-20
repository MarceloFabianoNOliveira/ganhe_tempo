
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, User } from 'lucide-react';
import { SystemUser } from '@/types/user';
import { useProfileRoles } from "@/hooks/useProfileRoles";
import { useUserForm } from './useUserForm';
import { UserFormFields } from './UserFormFields';
import { UserFormActions } from './UserFormActions';

interface UserFormProps {
  onAddUser: (user: SystemUser) => void;
  onEditUser?: (user: SystemUser) => void;
  existingEmails: string[];
  editUser?: SystemUser | null;
  onCancelEdit?: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({
  onAddUser,
  onEditUser,
  existingEmails,
  editUser,
  onCancelEdit,
}) => {
  const profileRoles = useProfileRoles();
  
  const {
    formData,
    showPassword,
    setShowPassword,
    handleSubmit,
    updateFormData
  } = useUserForm({
    onAddUser,
    onEditUser,
    existingEmails,
    editUser,
    onCancelEdit,
    profileRoles
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {editUser ? <User className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
          <span>{editUser ? 'Editar Usuário' : 'Criar Conta'}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <UserFormFields
            formData={formData}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            updateFormData={updateFormData}
            editUser={editUser}
            profileRoles={profileRoles}
          />
          
          <UserFormActions
            editUser={editUser}
            onCancelEdit={onCancelEdit}
            isDisabled={profileRoles.length === 0}
          />
        </form>
      </CardContent>
    </Card>
  );
};
