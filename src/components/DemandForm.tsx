
import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { useDemandForm } from '@/hooks/useDemandForm';
import { ClientInformationForm } from '@/components/forms/ClientInformationForm';
import { ServiceInformationForm } from '@/components/forms/ServiceInformationForm';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useLaundries } from '@/contexts/LaundryContext';
import { supabase } from '@/integrations/supabase/client'; // conexão com o Supabase

// Importar/Definir tipo Category do CategoryManagement
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

export const DemandForm = () => {
  const {
    formData,
    updateFormData,
    handleSubmit,   
    addPhoto,
    removePhoto,
    toggleCategory,
  } = useDemandForm();

  //console.log("toggleCategory ",toggleCategory);
  //console.log("DemandForm ----", DemandForm);

  const { user } = useAuth();
  const { laundries } = useLaundries();

  const [categories, setCategories] = React.useState<Category[]>([]);
  React.useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories') // nome da sua tabela no Supabase
        .select('*')
        .eq('laundry_id', user?.laundryId);        
            
      if (error) {
        console.error('Erro ao buscar categorias:', error.message);
      } else if (data) {
        //console.log("Categorias", data);
        setCategories(data);
      }
    };
    fetchCategories();
  }, []);
   

  ///lista de responsáveis
  const [responsibles, setResponsibles] = React.useState<Responsable[]>([]); 
  React.useEffect(() => {
    const fetchResponsibles = async () => {
      const { data, error } = await supabase
        .from('system_users') // nome da sua tabela no Supabase
        .select('*')
        .eq('laundryId', user?.laundryId)
        .neq('role', 'admin')
        .neq('role', 'manager');

      if (error) {
        console.error('Erro ao buscar responsáveis:', error.message);
      } else if (data) {
        //console.log("Responsaveis", data);
        setResponsibles(data);
      }
    };
    fetchResponsibles();
  }, []);

  ///lista de pagamentos
  const [payment, setPayments] = React.useState<PaymentMethod[]>([]); 
  React.useEffect(() => {
    const fetchPayments = async () => {
      const { data, error } = await supabase
        .from('paymentMethod') // nome da sua tabela no Supabase
        .select('*')
        .eq('laundry_id', user?.laundryId);

      if (error) {
        console.error('Erro ao buscar Pagamentos:', error.message);
      } else if (data) {
        console.log("Pagamentos", data);
        setPayments(data);
      }
    };
    fetchPayments();
  }, []);


  // Encontrar a lavanderia utilizada (pelo settings)
  const laundryId = user?.laundryId;
  

  // Filtrar as categorias ligadas à lavanderia
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => cat.laundry_id === laundryId);
  }, [categories, laundryId]);

  //console.log("Filtrar ", filteredCategories);

  // Filtrar as Responsaveis ligadas à lavanderia
  const filteredResponsibles = useMemo(() => {
    return responsibles.filter((resp) => resp.laundryId === laundryId);
  }, [responsibles, laundryId]);

  // Filtrar as Responsaveis ligadas à lavanderia
  const filteredPayments = useMemo(() => {
    return payment.filter((resp) => resp.laundry_id === laundryId);
  }, [payment, laundryId]);

  // Só exibe o campo operador para operator ou manager
  const showOperatorField = user && (user.role === 'operator' || user.role === 'manager');
  const operatorName = user?.name || '';


  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-0">
      <Card className="w-full">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
            <Plus className="h-5 w-5" />
            <span>Nova Demanda</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            {showOperatorField && (
              <div className="space-y-2">
                <Label htmlFor="operator">Operador</Label>
                <Input
                  id="operator"
                  value={operatorName}
                  readOnly
                  className="bg-gray-100 cursor-not-allowed"
                  tabIndex={-1}
                />
              </div>
            )}

            <ClientInformationForm
              formData={formData}
              onUpdate={updateFormData}
            />

            {/* envia categorias disponíveis */}
            <ServiceInformationForm
              formData={formData}
              onUpdate={updateFormData}
              //laundrySettings={laundrySettings}
              addPhoto={addPhoto}
              removePhoto={removePhoto}
              toggleCategory={toggleCategory}
              availableCategories={filteredCategories}
              availableResponsables={filteredResponsibles}
              availablePayments={filteredPayments}
            />

            <Button type="submit" className="w-full bg-laundry-blue hover:bg-laundry-blue-dark py-3">
              Criar Demanda
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
