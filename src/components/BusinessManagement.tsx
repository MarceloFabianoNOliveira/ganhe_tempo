import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Store, Plus, Trash2, MapPin, Phone, Mail, Clock, Edit, Upload, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useLaundries } from '@/contexts/LaundryContext';
import { LaundryFormData } from '@/types/laundry';

export const BusinessManagement = () => {
  const { laundries, addLaundry, updateLaundry, deleteLaundry } = useLaundries();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<LaundryFormData & { logo?: string }>({
    name: '',
    address: '',
    phone: '',
    email: '',
    workingHours: '',
    defaultDeliveryDays: 3,
    logo: ''
  });

  // Quando logoPreview mudar, atualizar em formData.logo
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      logo: logoPreview
    }));
  }, [logoPreview]);

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

    // O campo logo do formData já estará atualizado pelo useEffect acima
    const dataToSubmit = { ...formData };

    if (isEditing) {
      updateLaundry(isEditing, dataToSubmit);
      setIsEditing(null);
      toast({
        title: "Negócio atualizado!",
        description: "Informações do negócio foram atualizadas com sucesso.",
      });
    } else {
      addLaundry(dataToSubmit);
      toast({
        title: "Negócio cadastrado!",
        description: `${formData.name} foi adicionado ao sistema.`,
      });
    }
    
    clearForm();
  };

  const clearForm = () => {
    setFormData({
      name: '',
      address: '',
      phone: '',
      email: '',
      workingHours: '',
      defaultDeliveryDays: 3,
      logo: ''
    });
    setLogoPreview('');
  };

  const handleEdit = (laundry: any) => {
    console.log("Editar ---");
    setFormData({
      name: laundry.name,
      address: laundry.address,
      phone: laundry.phone,
      email: laundry.email,
      workingHours: laundry.workingHours,
      defaultDeliveryDays: laundry.defaultDeliveryDays,
      logo: laundry.logo || ''
    });
    setLogoPreview(laundry.logo || '');
    setIsEditing(laundry.id);
  };

  const handleCancel = () => {
    setIsEditing(null);
    clearForm();
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Verificar se é uma imagem
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Arquivo inválido",
          description: "Por favor, selecione uma imagem válida.",
          variant: "destructive",
        });
        return;
      }

      // Verificar tamanho do arquivo (máximo 1MB)
      if (file.size > 1 * 1024 * 1024) {
        toast({
          title: "Arquivo muito grande",
          description: "A imagem deve ter no máximo 1MB.",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Criar canvas para redimensionar a imagem
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Definir tamanho máximo (200x200 pixels)
          const maxSize = 200;
          let { width, height } = img;
          
          if (width > height) {
            if (width > maxSize) {
              height = (height * maxSize) / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = (width * maxSize) / height;
              height = maxSize;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Desenhar e redimensionar a imagem
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Converter para base64
          const resizedImageData = canvas.toDataURL('image/jpeg', 0.6);
          setLogoPreview(resizedImageData);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoPreview('');
    setFormData((prev) => ({
      ...prev,
      logo: ''
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Cadastro de Negócio</h1>
        <p className="text-gray-600 mt-2">Cadastre e gerencie os negócios do sistema</p>
      </div>

      {/* Form for creating/editing businesses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {isEditing ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            <span>{isEditing ? 'Editar Negócio' : 'Novo Negócio'}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Logo Upload Section */}
            <div className="space-y-2">
              <Label>Logo do Negócio</Label>
              <div className="flex items-center space-x-4">
                {logoPreview ? (
                  <div className="relative">
                    <img 
                      src={logoPreview} 
                      alt="Logo preview" 
                      className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                      onClick={removeLogo}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    <Upload className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                <div className="space-y-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Selecionar Logo
                  </Button>
                  <p className="text-xs text-gray-500">
                    Máximo 5MB. Recomendado: 200x200px
                  </p>
                  {isEditing && logoPreview && (
                    <p className="text-xs text-laundry-blue font-medium">
                      Logo atual deste negócio
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Nome do Negócio *</Label>
                <div className="relative">
                  <Store className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="businessName"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nome do negócio"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="businessEmail">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="businessEmail"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="contato@negocio.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessAddress">Endereço *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea
                  id="businessAddress"
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
                <Label htmlFor="businessPhone">Telefone *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="businessPhone"
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
                {isEditing ? 'Atualizar Negócio' : 'Cadastrar Negócio'}
              </Button>
              {isEditing && (
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
              )}
              <Button type="button" variant="outline" onClick={clearForm}>
                Limpar Formulário
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* List of existing businesses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Store className="h-5 w-5" />
            <span>Negócios Cadastrados ({laundries.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {laundries.map((business) => (
              <div key={business.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-3">
                      {business.logo && (
                        <img 
                          src={business.logo} 
                          alt={`Logo ${business.name}`}
                          className="w-12 h-12 object-cover rounded-lg border"
                        />
                      )}
                      <h3 className="font-semibold text-lg">{business.name}</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <p className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>{business.address}</span>
                      </p>
                      <p className="flex items-center space-x-2">
                        <Phone className="h-4 w-4" />
                        <span>{business.phone}</span>
                      </p>
                      <p className="flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <span>{business.email}</span>
                      </p>
                      <p className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>Prazo: {business.defaultDeliveryDays} dias</span>
                      </p>
                    </div>
                    {business.workingHours && (
                      <p className="text-sm text-gray-500">{business.workingHours}</p>
                    )}
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(business)}
                    >
                     -- <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteLaundry(business.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {laundries.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Store className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum negócio cadastrado ainda.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
