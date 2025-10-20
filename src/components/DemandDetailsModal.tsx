
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Save, Calendar, User, Package, Mail, Phone } from 'lucide-react';
import { useDemands } from '@/contexts/DemandContext';
import { Demand, DemandStatus,formaPagamento } from '@/types/demand'; // Removed DemandCategory
import { toast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client'; // conexão com o Supabase
import { useAuth } from '@/contexts/AuthContext'; // Adicione esta linha

interface DemandDetailsModalProps {
  demand: Demand | null;
}


const statusOptions = [
  { value: 'novo', label: 'Novo' },
  { value: 'em_andamento', label: 'Em Andamento' },
  { value: 'pedido_insumo', label: 'Pedido de Insumo' },
  { value: 'entregue_parcial', label: 'Entregue Parcial' },
  { value: 'entregue_total', label: 'Entregue Total' }
];

const formaDePagamentoOptions = [
  { value: 'pix', label: 'PIX' },
  { value: 'dinheiro', label: 'Dinheiro' },
  { value: 'deb_5%', label: 'Débito + 5%' },
  { value: 'cred_5%', label: 'Crédito + 5%' },
  { value: 'pag_ret', label: 'Pagamento na Retirada' },
  { value: 'pag_parc', label: 'Pagamento Parcial' },
  { value: 'pag_desc', label: 'Pagamento com Desconto' },
  { value: 'isen', label: 'Isenção' }
];

export const DemandDetailsModal: React.FC<DemandDetailsModalProps> = ({ demand }) => {
  const { updateDemand } = useDemands();
  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    //category: '' as string, // Changed from DemandCategory to string
    description: '',
    status: '' as DemandStatus,
    price: '',
    notes: '',   
    acronym: ''
  });

  //console.log("demanda---", demand);
  useEffect(() => {
    if (demand) {
      setFormData({
        client_name: demand.client_name,
        client_email: demand.client_email,
        client_phone: demand.client_phone || '',
        //category: demand.category,
        description: demand.description,
        status: demand.status,
        price: demand.price ?? '',
        notes: demand.notes || '',
        acronym: demand.acronym
      });
    }
  }, [demand]);


  //BUSCAR AS CATEGORIAS DE SERVIÇOS
  const [categoryOptions, setCategoryOptions] = useState<{ value: string; name: string }[]>([]);
  //const [categoryOptionsSelected, setCategoryOptionsSelected] = useState<{ value: string; name: string }[]>([]);

  const [categoryOptionsSelected, setCategoryOptionsSelected] = useState<string[]>([]);

  const { user } = useAuth(); // Pega o usuário logado
  const laundryId = user?.laundryId; // Id da lavanderia do usuário


  useEffect(() => {
    // só roda quando tiver ids válidos
    if (!laundryId || !demand?.id) return;

    let isMounted = true;

    (async () => {
      // 1) Carrega TODAS as categorias (id + nome)
      const { data: cats, error: catsErr } = await supabase
        .from('categories')
        .select('id,name')
        .eq('laundry_id', laundryId);

      if (catsErr) {
        console.error('Erro ao buscar categorias:', catsErr.message);
        return;
      }

      const allOptions = (cats || []).map(c => ({ value: c.id, name: c.name }));
      if (!isMounted) return;
      setCategoryOptions(allOptions);

    
      // 🔁 OPÇÃO B: se sua tabela só tiver 'category' (nome), converta nome -> id
      const { data: selectedByName, error: selByNameErr } = await supabase
        .from('demand_category') // confirme nome da tabela
        .select('category')      // retorna o NOME
        .eq('demand_id', demand.id)
        .eq('status', 'atv');

      if (selByNameErr) {
        console.error('Erro ao buscar selecionadas:', selByNameErr.message);
        return;
      }

      const selectedNames = (selectedByName || []).map(r => r.category as string);
      const selectedIds = allOptions
        .filter(opt => selectedNames.includes(opt.name))
        .map(opt => opt.value);

      if (!isMounted) return;
      setCategoryOptionsSelected(selectedIds);
    })();

  return () => { isMounted = false; };
}, [laundryId, demand?.id]);

    // toggle recebendo id (value) + checked
    const toggleCategory = (value: string, checked: boolean) => {
      setCategoryOptionsSelected(prev =>
        checked ? Array.from(new Set([...prev, value])) : prev.filter(v => v !== value)
      );
    };
        
 //console.log("Categorias---", categoryOptions);

  const handleSubmit = (e: React.FormEvent) => {
   
    e.preventDefault();
    
    if (!demand) return;

    if (!formData.client_name || 
        !formData.client_email || 
        //!formData.category || 
        !formData.description || 
        //!formData.category || 
        !formData.status ||
        categoryOptionsSelected.length === 0 // valida se pelo menos uma categoria foi selecionada
      ) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.client_email)) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um email válido.",
        variant: "destructive",
      });
      return;
    }

    console.log("DEMANDA atualizada" , formData.description);
    //console.log("formData.category ", formData.category);

    const categoriasCompletas = categoryOptions.filter(opt =>
      categoryOptionsSelected.includes(opt.value)
    );
    

    updateDemand(demand.id, {
      client_name: formData.client_name,
      client_email: formData.client_email,
      client_phone: formData.client_phone || undefined,
      category: categoryOptionsSelected,
      description: formData.description,
      status: formData.status,
      price: formData.price ? formData.price : undefined,
      notes: formData.notes || undefined
    });

   

  console.log("Categorias selecionadas (objetos):", categoriasCompletas);

     //MENSAGEM DE EXECUÇÃO COM SUCESSO 
     toast({
      title: "Demanda atualizada!",
      description: "As alterações foram salvas com sucesso.",
      variant: "default",
    });
  };

 const formatDate = (date: string | Date) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d);
};

  if (!demand) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Nenhuma demanda selecionada</p>
      </div>
    );
  }

  return (
    <ScrollArea className="max-h-[75vh]">
      <div>
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span>Detalhes da Demanda #{demand.codUnico}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6 space-y-6">
          {/* Informações básicas */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Criado em:</span>
              <span className="font-medium">{formatDate(demand.created_at)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Atualizado em:</span>
              <span className="font-medium">{formatDate(demand.updated_at)}</span>
            </div>
          </div>
         
          <Separator />

          {/* Formulário de edição */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações do cliente */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Informações do Cliente</span>
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-clientName">Nome do Cliente *</Label>
                  <Input
                    id="edit-clientName"
                    value={formData.client_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, client_name: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-clientPhone">Telefone</Label>
                  <Input
                    id="edit-clientPhone"
                    value={formData.client_phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, clientPhone: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-clientEmail">Email *</Label>
                <Input
                  id="edit-clientEmail"
                  type="email"
                  value={formData.client_email}
                  onChange={(e) => setFormData(prev => ({ ...prev, client_email: e.target.value }))}
                  required
                />
              </div>
            </div>

            {/* Informações do serviço */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center space-x-2">
                <Package className="h-4 w-4" />
                <span>Informações do Serviço</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">                  
                  <div className="space-y-2">
                    <Label>Categorias de Serviço <span className="text-red-500">*</span></Label>
                    {categoryOptions.length === 0 ? (
                      <span className="text-muted-foreground text-sm">
                        Nenhuma categoria cadastrada para este negócio.
                      </span>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {categoryOptions.map((option) => (
                          <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                              checked={categoryOptionsSelected.includes(option.value)}
                              onCheckedChange={(checked) => toggleCategory(option.value, !!checked)}
                              id={`category_${option.value}`}                 
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




                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value: DemandStatus) => 
                      setFormData(prev => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-price">Preço (R$)</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Forma de Pagamento</Label>
                  <Select                  
                   value={formData.acronym} 
                    onValueChange={(value: formaPagamento) => 
                      setFormData(prev => ({ ...prev, acronym: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {formaDePagamentoOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Descrição *</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-notes">Observações</Label>
                <Textarea
                  id="edit-notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={2}
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-laundry-blue hover:bg-laundry-blue-dark">
              <Save className="h-2 w-4 mr-2" />
              Salvar Alterações
            </Button>
            
          </form>
        </div>
      </div>
    </ScrollArea>
  );
};
