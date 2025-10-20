
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Store, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useDemands } from '@/contexts/DemandContext';

export const LaundrySettings = () => {
  const { laundrySettings, updateLaundrySettings } = useDemands();
  const [formData, setFormData] = useState(laundrySettings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateLaundrySettings(formData);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="h-5 w-5" />
          <span>Configurações da Lavanderia</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center space-x-2">
              <Store className="h-5 w-5" />
              <span>Informações Básicas</span>
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Lavanderia</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nome da sua lavanderia"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea
                  id="address"
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
                <Label htmlFor="phone">Telefone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(11) 99999-9999"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
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
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultDeliveryDays">Prazo Padrão de Entrega (dias)</Label>
              <Input
                id="defaultDeliveryDays"
                type="number"
                min="1"
                max="30"
                value={formData.defaultDeliveryDays}
                onChange={(e) => setFormData(prev => ({ ...prev, defaultDeliveryDays: parseInt(e.target.value) || 3 }))}
                placeholder="3"
                required
              />
              <p className="text-sm text-muted-foreground">
                Será usado como padrão quando não especificado na demanda
              </p>
            </div>
          </div>

          <Button type="submit" className="w-full bg-laundry-blue hover:bg-laundry-blue-dark">
            Salvar Configurações
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
