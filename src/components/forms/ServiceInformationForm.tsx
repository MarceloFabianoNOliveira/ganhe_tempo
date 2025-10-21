
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from 'lucide-react';
//import { LaundrySettings } from '@/types/demand';
import { DemandFormData } from '@/hooks/useDemandForm';
import { PhotoCapture } from '@/components/PhotoCapture';

// Importar tipo local (id, name, ...) para a categoria customizada:
type Category = {
  id: string;
  name: string;
  description: string;
  laundry_id: string;
  code: string;
  supply_unit: string;
  price: string;
};

type Responsable = {
  id: string;
  name: string;
  email: string;
  role: string;
  laundryId: string;
};

type PaymentMethod = {
  id: string;
  payment: string;
  acronym: string;
  status: string;
  laundry_id: string;
};

//CONSULTAR AS CATEGORIAS SELECIONADAS

const onlyDigits = (s: string) => s.replace(/[^\d]/g, "");

interface ServiceInformationFormProps {
  formData: DemandFormData;
  onUpdate: (field: keyof DemandFormData, value: any) => void;  
  addPhoto: (photo: string) => void;
  removePhoto: (index: number) => void;
  toggleCategory: (cat: string) => void;
  togglePayment: (pay: string) => void;
  testeValor: () => string;
  availableCategories: Category[];
  availableResponsables: Responsable[];
  availablePayments: PaymentMethod[];
}

export const ServiceInformationForm: React.FC<ServiceInformationFormProps> = ({
  formData,
  onUpdate, 
  addPhoto,
  removePhoto,
  toggleCategory,
  togglePayment,
  testeValor,
  availableCategories,
  availableResponsables,
  availablePayments
}) => {
  // Data para padrão de entrega
  const defaultDeliveryDate = new Date();
  defaultDeliveryDate.setDate(defaultDeliveryDate.getDate());
  const defaultDeliveryString = defaultDeliveryDate.toISOString().split('T')[0];

  const handlePaymentChange = (id: string | number, v: boolean | "indeterminate") => {
    const key = String(id);
    const prev = (formData.payments ?? []).map(String);
    const set = new Set(prev);
    if (v === true) set.add(key); else set.delete(key);
    onUpdate("payments", Array.from(set));
  };

  //APRESENTAÇÃO DO FORMULARIO
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium flex items-center space-x-2">
        <span aria-hidden="true">📦</span>
        <span>Informações do Serviço</span>
      </h3>

      {/* Categorias de Serviço */}
      <div className="space-y-2">
        <Label>Categorias de Serviço <span className="text-red-500">*</span></Label>
        {availableCategories.length === 0 ? (
          <span className="text-muted-foreground text-sm">
            Nenhuma categoria cadastrada para este negócio.
          </span>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {availableCategories.map((option) => (
              <label key={option.id} className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={formData.categories.includes(option.id)}
                  onCheckedChange={() => toggleCategory(option.id)}
                  id={`category_${option.id}`}                 
                />
                <span>{option.name}</span>
              </label>
            ))}
          </div>
        )}
        <span className="text-xs text-muted-foreground">
          Selecione uma ou mais categorias correspondentes ao serviço.
        </span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <div className="space-y-2 sm:col-span-2 md:col-span-1">
          <Label htmlFor="price">Preço (R$) <span className="text-red-500">*</span></Label>
          <Input
            id="price"            
            value={formData.price}
            onChange={(e) => onUpdate('price', e.target.value)}
            required
            placeholder="0.00"
          />
        </div>

        <div className="space-y-2 sm:col-span-2 md:col-span-1">
          <Label htmlFor="discount">Desconto (R$) <span className="text-red-500">*</span></Label>
          <Input
            id="desconto"    
            value={formData.discount}
             onChange={(e) => {
              const value = e.target.value.replace(',', '.');
              const price = parseFloat(formData.price || "0");
              let discount = parseFloat(value || "0");
              if (discount > price) discount = price;
              onUpdate('discount', discount.toString());
            }}
            required
            onKeyPress={(e) => {
              if (!/[0-9.,]/.test(e.key)) {
                e.preventDefault();
              }
            }}
            placeholder="0.00"
          />
          {parseFloat(formData.discount || "0") > parseFloat(formData.price || "0") && (
            <span className="text-red-500 text-xs">
              O desconto não pode ser maior que o preço!
            </span>
          )}
        </div>
      </div>

       

      <div className="space-y-2">
        <Label htmlFor="deliveryForecast">Previsão de Entrega <span className="text-red-500">*</span></Label>
        <div className="relative">
          <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="deliveryForecast"
            type="date"
            value={formData.deliveryForecast}
            onChange={(e) => onUpdate('deliveryForecast', e.target.value)}
            placeholder={defaultDeliveryString}
            required
            className="pl-10"
          />
        </div>

        <p className="text-sm text-muted-foreground">
          Se não especificado, será usado 3 dias úteis ({defaultDeliveryDate.toLocaleDateString('pt-BR')})
        </p>
      </div>
      <div className="space-y-2">
        <Label>Responsável  <span className="text-red-500">*</span></Label>
        <select
          className="w-full border rounded-md p-2"
          value={formData.responsibles || ""}
          onChange={(e) => onUpdate("responsibles", e.target.value)}
          required
        >
          <option value="">Selecione...</option>
          {availableResponsables.map((resp) => (
            <option key={resp.id} value={resp.id}>
              {resp.name + " (" + resp.role + ")"}
            </option>
          ))}
        </select>
        <span className="text-xs text-muted-foreground">
          Escolha a pessoa responsável pelo atendimento.
        </span>
      </div>      

      {/* forma de pagamento */}
      <div className="space-y-2">
        <Label>Forma de Pagamento <span className="text-red-500">*</span></Label>
        {availablePayments.length === 0 ? (
          <span className="text-muted-foreground text-sm">
            Nenhuma Forma de Pagamento cadastrada para este negócio.
          </span>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {availablePayments.map((option) => {
            const key = String(option.id);
            const isChecked = (formData.payments ?? []).map(String).includes(key);
            return (
              <div key={key} className="flex items-center gap-2">
                <Checkbox
                  id={`payments_${key}`}
                  checked={isChecked}
                  onCheckedChange={(v) => handlePaymentChange(option.id, v)}
                />
                <Label htmlFor={`payments_${key}`} className="cursor-pointer">
                  {option.payment}
                </Label>
              </div>
            );
          })}
    </div>
        )}
        <span className="text-xs text-muted-foreground">
          Selecione uma ou mais categorias correspondentes ao serviço.
        </span>
      </div>

      <PhotoCapture
        photos={formData.photos}
        addPhoto={addPhoto}
        removePhoto={removePhoto}
      />

      <div className="space-y-2">
        <Label htmlFor="description">Descrição do Serviço <span className="text-red-500">*</span></Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onUpdate('description', e.target.value)}
          placeholder="Descreva o serviço a ser realizado..."
          rows={3}
          required
          className="resize-none"
        />
      </div>

 

       
      <div className="space-y-2">
        <Label htmlFor="notes">Observações</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => onUpdate('notes', e.target.value)}
          placeholder="Observações adicionais (opcional)"
          rows={2}
          className="resize-none"
        />
      </div>
      
    </div>
    
  );
};
