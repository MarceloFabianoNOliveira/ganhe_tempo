
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Phone, Mail, User } from 'lucide-react';
import { DemandFormData } from '@/hooks/useDemandForm';

// Função simples para formatar celular brasileiro (com ou sem DDD)
// Aceita apenas números e ajusta máscara
function formatCellphone(value: string) {
  // Remove tudo que não é número
  const onlyDigits = value.replace(/\D/g, '');
  // (11) 91234-5678 ou (11) 1234-5678 de acordo com tamanho
  if (onlyDigits.length <= 2) return onlyDigits;
  if (onlyDigits.length <= 7) return `(${onlyDigits.slice(0,2)}) ${onlyDigits.slice(2)}`;
  if (onlyDigits.length <= 11) {
    const part1 = onlyDigits.slice(0,2);
    const part2 = onlyDigits.length === 11
      ? onlyDigits.slice(2,7) + '-' + onlyDigits.slice(7,11)
      : onlyDigits.slice(2,6) + '-' + onlyDigits.slice(6,10);
    return `(${part1}) ${part2}`;
  }
  // Se inserir dígito a mais ignora
  return `(${onlyDigits.slice(0,2)}) ${onlyDigits.slice(2,7)}-${onlyDigits.slice(7,11)}`;
}

interface ClientInformationFormProps {
  formData: DemandFormData;
  onUpdate: (field: keyof DemandFormData, value: string) => void;
}

export const ClientInformationForm: React.FC<ClientInformationFormProps> = ({ 
  formData, 
  onUpdate 
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium flex items-center space-x-2">
        <User className="h-5 w-5" />
        <span>Informações do Cliente</span>
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2 sm:col-span-2 md:col-span-1">
          <Label htmlFor="clientName">Nome do Cliente *</Label>
          <Input
            id="clientName"
            value={formData.clientName}
            onChange={(e) => onUpdate('clientName', e.target.value)}
            placeholder="Nome completo"
            required
          />
        </div>
        
        <div className="space-y-2 sm:col-span-2 md:col-span-1">
          <Label htmlFor="clientCpfCnpj">CPF/CNPJ</Label>
          <Input
            id="clientCpfCnpj"
            value={formData.cpfCnpj ?? ''}
            onChange={(e) => onUpdate('cpfCnpj', e.target.value)}
            placeholder="Informe CPF ou CNPJ"
            maxLength={18}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="clientPhone">Celular/Whatsapp *</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="clientPhone"
            value={formatCellphone(formData.clientPhone)}
            onChange={(e) => {
              // Só permite números, formatação automática onChange
              const raw = e.target.value.replace(/\D/g, '').slice(0, 11);
              onUpdate('clientPhone', raw);
            }}
            placeholder="(11) 91234-5678"
            className="pl-10"
            required
            inputMode="numeric"
            pattern="^\(?\d{2}\)? ?9?\d{4}-?\d{4}$"
            autoComplete="tel"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="clientEmail">Email </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="clientEmail"
            type="email"
            value={formData.clientEmail}
            onChange={(e) => onUpdate('clientEmail', e.target.value)}
            placeholder="cliente@email.com"
            className="pl-10"
            
          />
        </div>
      </div>
    </div>
  );
};
