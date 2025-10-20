
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Building2, Plus, Trash2, Store, MapPin, Phone, Mail, Clock, Edit } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useLaundries } from '@/contexts/LaundryContext';
import { LaundryFormData } from '@/types/laundry';

export const LaundryManagement = () => {
  const { laundries, addLaundry, updateLaundry, deleteLaundry } = useLaundries();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<LaundryFormData>({
    name: '',
    address: '',
    phone: '',
    email: '',
    workingHours: '',
    defaultDeliveryDays: 3,
    status: 'atv'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.address || !formData.phone || !formData.email) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome, endereço, telefone e email são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if (isEditing) {
      updateLaundry(isEditing, formData);
      setIsEditing(null);
    } else {
      addLaundry(formData);
    }
    
    setFormData({
      name: '',
      address: '',
      phone: '',
      email: '',
      workingHours: '',
      defaultDeliveryDays: 3,
      status: 'atv'
    });
  };

  const handleEdit = (laundry: any) => {
    setFormData({
      name: laundry.name,
      address: laundry.address,
      phone: laundry.phone,
      email: laundry.email,
      workingHours: laundry.workingHours,
      defaultDeliveryDays: laundry.defaultDeliveryDays,
      status: 'atv'
    });
    setIsEditing(laundry.id);
  };

  const handleCancel = () => {
    setIsEditing(null);
    setFormData({
      name: '',
      address: '',
      phone: '',
      email: '',
      workingHours: '',
      defaultDeliveryDays: 3,
      status: 'atv'
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Lavanderias</h1>
        <p className="text-gray-600 mt-2">Cadastre e gerencie as lavanderias do sistema</p>
      </div>

      {/* Form for creating/editing laundries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {isEditing ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            <span>{isEditing ? 'Editar Lavanderia' : 'Nova Lavanderia'}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="laundryName">Nome da Lavanderia *</Label>
                <div className="relative">
                  <Store className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="laundryName"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nome da lavanderia"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="laundryEmail">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="laundryEmail"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="contato@lavanderia.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="laundryAddress">Endereço *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea
                  id="laundryAddress"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Endereço completo"
                  className="pl-10"
                  rows={2}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="laundryPhone">Telefone *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="laundryPhone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(11) 99999-9999"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deliveryDays">Prazo Padrão (dias)</Label>
                <Input
                  id="deliveryDays"
                  type="number"
                  min="1"
                  max="30"
                  value={formData.defaultDeliveryDays}
                  onChange={(e) => setFormData(prev => ({ ...prev, defaultDeliveryDays: parseInt(e.target.value) || 3 }))}
                  placeholder="3"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="workingHours">Horário de Funcionamento</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea
                  id="workingHours"
                  value={formData.workingHours}
                  onChange={(e) => setFormData(prev => ({ ...prev, workingHours: e.target.value }))}
                  placeholder="Segunda a Sexta: 8h às 18h | Sábado: 8h às 14h"
                  className="pl-10"
                  rows={2}
                />
              </div>
            </div>

            <div className="flex space-x-2">
              <Button type="submit" className="bg-laundry-blue hover:bg-laundry-blue-dark">
                {isEditing ? 'Atualizar Lavanderia' : 'Cadastrar Lavanderia'}
              </Button>
              {isEditing && (
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* List of existing laundries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="h-5 w-5" />
            <span>Lavanderias Cadastradas ({laundries.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {laundries.map((laundry) => (
              <div key={laundry.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-lg">{laundry.name}</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <p className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>{laundry.address}</span>
                      </p>
                      <p className="flex items-center space-x-2">
                        <Phone className="h-4 w-4" />
                        <span>{laundry.phone}</span>
                      </p>
                      <p className="flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <span>{laundry.email}</span>
                      </p>
                      <p className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>Prazo: {laundry.defaultDeliveryDays} dias</span>
                      </p>
                    </div>
                    {laundry.workingHours && (
                      <p className="text-sm text-gray-500">{laundry.workingHours}</p>
                    )}
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(laundry)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteLaundry(laundry.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {laundries.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma lavanderia cadastrada ainda.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
