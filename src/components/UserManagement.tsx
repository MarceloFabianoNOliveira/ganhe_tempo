import React, { useState, useEffect } from 'react';
import { SystemUser } from '@/types/user';
import { UserForm } from './user-management/UserForm';
import { UserList } from './user-management/UserList';
import { supabase } from '@/integrations/supabase/client'; // conexão com o Supabase

export const UserManagement = () => {
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from('system_users').select('*');
      if (error) {
        console.error('Erro ao buscar usuários:', error.message);
      } else {
        setUsers(data);
      }
    };
    fetchUsers();
  }, []);

  //ADICIONAR NOVO USUARIO
  const handleAddUser = async (user: SystemUser) => {
    //console.log("User", user);
    const { data, error } = await supabase.from('system_users').insert([user]).select().single();
    if (error) {
      console.error('Erro ao adicionar usuário:', error.message);
    } else {
      setUsers(prev => [...prev, data]);
    }
  };

  const handleEditUser = async (edited: SystemUser) => {
    const { data, error } = await supabase
      .from('users')
      .update(edited)
      .eq('id', edited.id)
      .select()
      .single();
    if (error) {
      console.error('Erro ao atualizar usuário:', error.message);
    } else {
      setUsers(prev => prev.map(u => u.id === edited.id ? data : u));
      setEditingUser(null);
    }
  };

  const handleDeleteUser = async (id: number) => {
    const { error } = await supabase.from('system_users').delete().eq('id', id);
    if (error) {
      console.error('Erro ao excluir usuário:', error.message);
    } else {
      setUsers(prev => prev.filter(u => u.id !== id));
      if (editingUser?.id === id) setEditingUser(null);
    }
  };

  const handleStartEdit = (user: SystemUser) => {
    setEditingUser(user);
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  const existingEmails = users.map(user => user.email);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Usuários</h1>
        <p className="text-gray-600 mt-2">Cadastre e gerencie usuários do sistema</p>
      </div>

      <UserForm
        onAddUser={handleAddUser}
        onEditUser={handleEditUser}
        existingEmails={existingEmails}
        editUser={editingUser}
        onCancelEdit={handleCancelEdit}
      />
      <UserList users={users} onDeleteUser={handleDeleteUser} onEditUser={handleStartEdit} />
    </div>
  );
};
