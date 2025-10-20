
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Users, Plus, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Laundry {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  workingHours: string;
  defaultDeliveryDays: number;
}

interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'operator';
  laundryId: string;
  laundryName: string;
}

export const SuperAdminPanel = () => {
  const [laundries, setLaundries] = useState<Laundry[]>([
    {
      id: '1',
      name: 'Lavanderia Express',
      address: 'Rua das Flores, 123 - Centro',
      phone: '(11) 98765-4321',
      email: 'contato@lavanderiaexpress.com',
      workingHours: 'Segunda a Sexta: 8h às 18h | Sábado: 8h às 14h',
      defaultDeliveryDays: 3
    }
  ]);

  const [users, setUsers] = useState<SystemUser[]>([
    {
      id: '1',
      name: 'Administrador',
      email: 'admin@lavanderia.com',
      role: 'admin',
      laundryId: '1',
      laundryName: 'Lavanderia Express'
    },
    {
      id: '2',
      name: 'Operador',
      email: 'operador@lavanderia.com',
      role: 'operator',
      laundryId: '1',
      laundryName: 'Lavanderia Express'
    }
  ]);

  const [newLaundry, setNewLaundry] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    workingHours: '',
    defaultDeliveryDays: 3
  });

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'operator' as 'admin' | 'operator',
    laundryId: ''
  });

  const handleAddLaundry = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newLaundry.name || !newLaundry.email) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e email são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const laundry: Laundry = {
      ...newLaundry,
      id: Date.now().toString()
    };

    setLaundries(prev => [...prev, laundry]);
    setNewLaundry({
      name: '',
      address: '',
      phone: '',
      email: '',
      workingHours: '',
      defaultDeliveryDays: 3
    });

    toast({
      title: "Lavanderia criada!",
      description: `${laundry.name} foi adicionada ao sistema.`,
    });
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUser.name || !newUser.email || !newUser.laundryId) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome, email e lavanderia são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const selectedLaundry = laundries.find(l => l.id === newUser.laundryId);
    if (!selectedLaundry) return;

    const user: SystemUser = {
      ...newUser,
      id: Date.now().toString(),
      laundryName: selectedLaundry.name
    };

    setUsers(prev => [...prev, user]);
    setNewUser({
      name: '',
      email: '',
      role: 'operator',
      laundryId: ''
    });

    toast({
      title: "Usuário criado!",
      description: `${user.name} foi adicionado ao sistema.`,
    });
  };

  const deleteLaundry = (id: string) => {
    setLaundries(prev => prev.filter(l => l.id !== id));
    setUsers(prev => prev.filter(u => u.laundryId !== id));
    
    toast({
      title: "Lavanderia removida!",
      description: "Lavanderia e usuários associados foram removidos.",
    });
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    
    toast({
      title: "Usuário removido!",
      description: "Usuário foi removido do sistema.",
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Painel Super Administrador</h1>
        <p className="text-gray-600 mt-2">Gerencie lavanderias e usuários do sistema</p>
      </div>

      <Tabs defaultValue="laundries" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="laundries">Lavanderias</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
        </TabsList>

        <TabsContent value="laundries" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Nova Lavanderia</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddLaundry} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="laundryName">Nome *</Label>
                    <Input
                      id="laundryName"
                      value={newLaundry.name}
                      onChange={(e) => setNewLaundry(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Nome da lavanderia"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="laundryEmail">Email *</Label>
                    <Input
                      id="laundryEmail"
                      type="email"
                      value={newLaundry.email}
                      onChange={(e) => setNewLaundry(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="contato@lavanderia.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="laundryPhone">Telefone</Label>
                    <Input
                      id="laundryPhone"
                      value={newLaundry.phone}
                      onChange={(e) => setNewLaundry(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="deliveryDays">Dias para entrega</Label>
                    <Input
                      id="deliveryDays"
                      type="number"
                      min="1"
                      value={newLaundry.defaultDeliveryDays}
                      onChange={(e) => setNewLaundry(prev => ({ ...prev, defaultDeliveryDays: parseInt(e.target.value) }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="laundryAddress">Endereço</Label>
                  <Input
                    id="laundryAddress"
                    value={newLaundry.address}
                    onChange={(e) => setNewLaundry(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Rua, número - bairro"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workingHours">Horário de funcionamento</Label>
                  <Input
                    id="workingHours"
                    value={newLaundry.workingHours}
                    onChange={(e) => setNewLaundry(prev => ({ ...prev, workingHours: e.target.value }))}
                    placeholder="Segunda a Sexta: 8h às 18h"
                  />
                </div>

                <Button type="submit" className="w-full">
                  Criar Lavanderia
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="h-5 w-5" />
                <span>Lavanderias Cadastradas</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {laundries.map((laundry) => (
                  <div key={laundry.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h3 className="font-semibold">{laundry.name}</h3>
                        <p className="text-sm text-muted-foreground">{laundry.email}</p>
                        {laundry.address && <p className="text-sm">{laundry.address}</p>}
                        {laundry.phone && <p className="text-sm">{laundry.phone}</p>}
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteLaundry(laundry.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Novo Usuário</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddUser} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="userName">Nome *</Label>
                    <Input
                      id="userName"
                      value={newUser.name}
                      onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Nome do usuário"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="userEmail">Email *</Label>
                    <Input
                      id="userEmail"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="usuario@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="userRole">Perfil</Label>
                    <Select 
                      value={newUser.role} 
                      onValueChange={(value: 'admin' | 'operator') => 
                        setNewUser(prev => ({ ...prev, role: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="operator">Operador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="userLaundry">Lavanderia *</Label>
                    <Select 
                      value={newUser.laundryId} 
                      onValueChange={(value) => 
                        setNewUser(prev => ({ ...prev, laundryId: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a lavanderia" />
                      </SelectTrigger>
                      <SelectContent>
                        {laundries.map((laundry) => (
                          <SelectItem key={laundry.id} value={laundry.id}>
                            {laundry.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Criar Usuário
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Usuários Cadastrados</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h3 className="font-semibold">{user.name}</h3>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <div className="flex space-x-4 text-sm">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {user.role === 'admin' ? 'Administrador' : 'Operador'}
                          </span>
                          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
                            {user.laundryName}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteUser(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
