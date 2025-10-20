import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Trash2, Mail, Building2, Edit } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useLaundries } from '@/contexts/LaundryContext';
import { SystemUser } from '@/types/user';
import { getRoleDisplay, getRoleBadgeColor } from '@/utils/userHelpers';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

interface UserListProps {
  users: SystemUser[];
  onDeleteUser: (id: number) => void; // now integer id
  onEditUser?: (user: SystemUser) => void;
}

export const UserList: React.FC<UserListProps> = ({ users, onDeleteUser, onEditUser }) => {
  const { getLaundryById } = useLaundries();

  //console.log("users--" , users);

  const getLaundryName = (laundryId?: string) => {
    if (!laundryId) return 'Não definida';
    const laundry = getLaundryById(laundryId);
    return laundry ? laundry.name : 'Lavanderia não encontrada';
  };

  const handleDeleteUser = (id: number) => {
    onDeleteUser(id);
    toast({
      title: "Usuário removido!",
      description: "Usuário foi removido do sistema.",
    });
  };

  // Placeholder de ação de status
  const handleStatusClick = (user: SystemUser) => {
    toast({
      title: "Status",
      description: `Status do usuário ${user.name} (ação a definir)`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="h-5 w-5" />
          <span>Usuários Cadastrados ({users.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-semibold text-lg">{user.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                      {getRoleDisplay(user.role)}
                    </span>
                  </div>
                  <p className="text-muted-foreground flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </p>
                  <p className="text-muted-foreground flex items-center space-x-2">
                    <Building2 className="h-4 w-4" />
                    <span>{getLaundryName(user.laundryId)}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Cadastrado em: {user.created_at
                                          ? new Date(user.created_at).toLocaleDateString('pt-BR')
                                          : 'Data não disponível'}
                  </p>
                </div>
                <div className="flex flex-row items-center gap-2 ml-4 mt-2 sm:mt-0">
                  {onEditUser && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditUser(user)}
                      title="Editar usuário"
                      className="flex items-center gap-1"
                    >
                      <Edit className="h-4 w-4" />
                      Editar
                    </Button>
                  )}
                  {/* Botão de Status */}
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleStatusClick(user)}
                    title="Ver status"
                    className="flex items-center gap-1"
                  >
                    Status
                  </Button>
                  {/* Botão de Deletar */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        title="Excluir usuário"
                        className="flex items-center gap-1"
                      >
                        <Trash2 className="h-4 w-4" />
                        Deletar
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir o usuário <b>{user.name}</b>? Esta ação não poderá ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteUser(user.id)}
                          autoFocus
                        >
                          Confirmar exclusão
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          ))}

          {users.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum usuário cadastrado ainda.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
