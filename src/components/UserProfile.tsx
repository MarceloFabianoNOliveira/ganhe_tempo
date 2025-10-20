
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, User as UserIcon, Shield, Trash2, Plus, Pencil } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Importando AlertDialog shadcn
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

// Novo tipo de perfil com campos ajustados
type Profile = {
  id: string;
  perfil: string;      // era name
  descricao: string;   // novo campo
};

export const UserProfile = () => {
  const { user, logout } = useAuth();

  // Atualizando localStorage para usar novos campos
  const [profiles, setProfiles] = useState<Profile[]>(() => {
    const local = localStorage.getItem('laundry-profiles');
    if (local) {
      try {
        const parsed = JSON.parse(local);
        return parsed.map((p: any) => ({
          id: p.id,
          perfil: p.perfil ?? p.name ?? '',
          descricao: p.descricao ?? '',
        }));
      } catch {
        return [];
      }
    }
    return [];
  });

  // Estados do formulário (ajustado para "perfil" e "descricao")
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState<Profile>({
    id: '',
    perfil: '',
    descricao: ''
  });

  // Para alternar entre lista e form de cadastro/edição
  const [showForm, setShowForm] = useState(false);

  // Gerenciar id do perfil a ser removido via diálogo
  const [profileToDelete, setProfileToDelete] = useState<Profile | null>(null);

  const syncProfiles = (newProfiles: Profile[]) => {
    setProfiles(newProfiles);
    localStorage.setItem('laundry-profiles', JSON.stringify(newProfiles));
  };

  // CRUD actions
  const handleNew = () => {
    setForm({ id: '', perfil: '', descricao: '' });
    setEditingProfile(null);
    setShowForm(true);
  };

  const handleEdit = (profile: Profile) => {
    setForm(profile);
    setEditingProfile(profile);
    setShowForm(true);
  };

  // Agora a exclusão real é chamada só após confirmar!
  const confirmDeleteProfile = () => {
    if (profileToDelete) {
      const updated = profiles.filter(p => p.id !== profileToDelete.id);
      syncProfiles(updated);
      toast({
        title: "Perfil excluído",
        description: "O perfil foi removido com sucesso.",
        variant: "destructive"
      });
      setProfileToDelete(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Apenas validação do campo perfil
    if (!form.perfil) {
      toast({ title: "Preencha o campo perfil", variant: "destructive" });
      return;
    }

    let updatedProfiles: Profile[];
    if (editingProfile) {
      // Editar
      updatedProfiles = profiles.map(p => p.id === form.id ? { ...form } : p);
      toast({ title: "Perfil atualizado!", description: "Perfil alterado com sucesso." });
    } else {
      // Criar novo perfil
      const newProfile = { ...form, id: Math.random().toString(36).slice(2, 10) };
      updatedProfiles = [...profiles, newProfile];
      toast({ title: "Perfil criado com sucesso!" });
    }
    syncProfiles(updatedProfiles);
    setShowForm(false);
  };

  // Permissão: Apenas admin/super_admin pode ver o CRUD completo
  const canManage = user?.role === 'admin' || user?.role === 'super_admin';

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            Cadastro de Perfis de Usuário
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* CRUD completo para admin/super_admin */}
          {canManage ? (
            <>
              {/* Botão para novo perfil */}
              {!showForm &&
                <div className="flex justify-end mb-2">
                  <Button onClick={handleNew}>
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Perfil
                  </Button>
                </div>
              }
              {/* Form de criação/edição */}
              {showForm ? (
                <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="perfil">Perfil</Label>
                    <Input
                      id="perfil"
                      name="perfil"
                      value={form.perfil}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="descricao">Descrição</Label>
                    <Input
                      id="descricao"
                      name="descricao"
                      value={form.descricao}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button type="submit">
                      {editingProfile ? "Salvar Alteração" : "Criar Perfil"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => { setShowForm(false); setEditingProfile(null); }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              ) : null}
              {/* Lista de perfis */}
              <div className="overflow-auto">
                <table className="w-full border rounded">
                  <thead>
                    <tr className="bg-muted">
                      <th className="py-2 px-3 text-left">Perfil</th>
                      <th className="py-2 px-3 text-left">Descrição</th>
                      <th className="py-2 px-3 text-left">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profiles.map(profile => (
                      <tr key={profile.id} className="border-b">
                        <td className="py-2 px-3">{profile.perfil}</td>
                        <td className="py-2 px-3">{profile.descricao}</td>
                        <td className="py-2 px-3 space-x-1">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleEdit(profile)}
                          >
                            <Pencil className="w-4 h-4" /> Editar
                          </Button>
                          {/* Remover botão de excluir direto, agora usa AlertDialog */}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="destructive"
                                size="sm"
                                // Agora só abre o modal, não deleta direto
                                onClick={() => setProfileToDelete(profile)}
                              >
                                <Trash2 className="w-4 h-4" /> Excluir
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir o perfil <b>{profile.perfil}</b>? Esta ação não poderá ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setProfileToDelete(null)}>
                                  Cancelar
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={confirmDeleteProfile}
                                  autoFocus
                                >
                                  Confirmar exclusão
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Mantém o AlertDialog aberto só para o perfil clicado */}
              {/* (O AlertDialog acima já faz isso dentro do map) */}
            </>
          ) : (
            // Para usuários comuns, manter exibição atual sem alterações
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nome</Label>
                <div className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                  <span>{user?.name}</span>
                </div>
              </div>
              {user?.email && (
                <div className="space-y-2">
                  <Label>Email</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{user?.email}</span>
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label>Perfil</Label>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="capitalize">
                    {user?.role}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button type="button" variant="destructive" onClick={logout}>Sair</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
