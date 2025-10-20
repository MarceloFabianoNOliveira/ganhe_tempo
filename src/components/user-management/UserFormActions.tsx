
import React from 'react';
import { Button } from '@/components/ui/button';
import { SystemUser } from '@/types/user';

interface UserFormActionsProps {
  editUser?: SystemUser | null;
  onCancelEdit?: () => void;
  isDisabled: boolean;
}

export const UserFormActions: React.FC<UserFormActionsProps> = ({
  editUser,
  onCancelEdit,
  isDisabled
}) => {
  return (
    <div className="flex gap-2">
      <Button
        type="submit"
        className="w-full bg-laundry-blue hover:bg-laundry-blue-dark"
        disabled={isDisabled}
      >
        {editUser ? 'Salvar Alterações' : 'Criar Conta'}
      </Button>
      {editUser && onCancelEdit && (
        <Button type="button" variant="secondary" onClick={onCancelEdit}>
          Cancelar
        </Button>
      )}
    </div>
  );
};
