
import { useState, useEffect } from 'react';
import { SystemUser, NewUserFormData } from '@/types/user';
import { toast } from '@/hooks/use-toast';
import { validateUserForm } from './UserFormValidation';

interface UseUserFormProps {
  onAddUser: (user: SystemUser) => void;
  onEditUser?: (user: SystemUser) => void;
  existingEmails: string[];
  editUser?: SystemUser | null;
  onCancelEdit?: () => void;
  profileRoles: string[];
}

export const useUserForm = ({
  onAddUser,
  onEditUser,
  existingEmails,
  editUser,
  onCancelEdit,
  profileRoles
}: UseUserFormProps) => {
  const [formData, setFormData] = useState<NewUserFormData>({
    name: '',
    email: '',
    password: '',
    role: '',
    laundryId: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (editUser) {
      setFormData({
        name: editUser.name,
        email: editUser.email,
        password: '',
        role: editUser.role,
        laundryId: editUser.laundryId || ''
      });
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        role: profileRoles.length > 0 ? profileRoles[0] : '',
        laundryId: ''
      });
    }
    setShowPassword(false);
  }, [editUser, profileRoles]);

  useEffect(() => {
    if (!formData.role && profileRoles && profileRoles.length > 0) {
      setFormData((prev) => ({ ...prev, role: profileRoles[0] }));
    }
  }, [profileRoles, formData.role]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = validateUserForm({
      formData,
      existingEmails,
      editUser,
      profileRoles
    });

    if (!isValid) return;

    if (editUser) {
      const updatedUser: SystemUser = {
        ...editUser,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        laundryId: formData.laundryId,
      };
      onEditUser && onEditUser(updatedUser);
      toast({
        title: "Usuário atualizado!",
        description: `${updatedUser.name} foi atualizado.`,
      });
      onCancelEdit && onCancelEdit();
    } else {
      // Remove id, let the backend assign it (now SERIAL)
      const user: SystemUser = {
        id: 0, // Placeholder, real id will come from backend
        name: formData.name,
        email: formData.email,
        role: formData.role,
        laundryId: formData.laundryId,
        created_at: new Date(),
      };

      onAddUser(user);
      toast({
        title: "Usuário criado!",
        description: `${user.name} foi adicionado ao sistema.`,
      });
      setFormData({
        name: '',
        email: '',
        password: '',
        role: profileRoles.length > 0 ? profileRoles[0] : '',
        laundryId: ''
      });
    }
  };

  const updateFormData = (field: keyof NewUserFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    showPassword,
    setShowPassword,
    handleSubmit,
    updateFormData
  };
};
