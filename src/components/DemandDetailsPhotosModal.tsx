
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Save, Calendar, User, Package, Mail, Phone, Camera } from 'lucide-react';
import { useDemands } from '@/contexts/DemandContext';
import { Demand, DemandStatus,formaPagamento } from '@/types/demand'; // Removed DemandCategory
import { toast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client'; // conexão com o Supabase
import { useAuth } from '@/contexts/AuthContext'; // Adicione esta linha

interface DemandDetailsPhotosModalProps {
  demand: Demand | null;
}

const statusOptions = [
  { value: 'recebido', label: 'Recebido' },
  { value: 'em_andamento', label: 'Em Andamento' },
  { value: 'finalizado', label: 'Finalizado' },
  { value: 'cliente_buscar', label: 'Cliente Buscar' },
  { value: 'entregue', label: 'Entregue' }
];

const formaDePagamentoOptions = [
  { value: 'pix', label: 'PIX' },
  { value: 'dinheiro', label: 'Dinheiro' },
  { value: 'debito', label: 'Débito + 5%' },
  { value: 'credito', label: 'Crédito + 5%' },
  { value: 'retirada', label: 'Pagamento na Retirada' },
  { value: 'parcial', label: 'Pagamento Parcial' },
  { value: 'desconto', label: 'Pagamento com Desconto' },
  { value: 'isencao', label: 'Isenção' }
];



export const DemandDetailsPhotosModal: React.FC<DemandDetailsPhotosModalProps> = ({ demand }) => {
  const { updateDemand } = useDemands();
  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    //category: '' as string, // Changed from DemandCategory to string
    description: '',
    status: '' as DemandStatus,
    price: '',
    notes: ''
  });

  //console.log("demanda", demand);

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
        notes: demand.notes || ''
      });
    }
  }, [demand]);


  //BUSCAR AS CATEGORIAS DE SERVIÇOS
  const [demandPhoto, setDemandPhoto] = useState<{ value: string; image: string }[]>([]);


  const { user } = useAuth(); // Pega o usuário logado
  const laundryId = user?.laundryId; // Id da lavanderia do usuário
  
  //onsole.log("laundry", laundryId);

  useEffect(() => {
    const demandPhoto = async () => {
      const { data, error } = await supabase
        .from('demand_photos')
        .select('id,image')
        .eq('demand_id', demand.id)
        .eq('status', 'atv'); // Filtra pelo laundry_id
        
      if (error) {
        console.error('Erro ao buscar categorias:', error.message);
        return;
      }
      if (data) {
        setDemandPhoto(
          data.map((photo: { id: string; image: string }) => ({
            value: photo.id,
            image: photo.image
          }))
        );
      }
    };
    demandPhoto();
  }, []);

  console.log("Fotos ", demandPhoto)
  

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
         
            {/* Informações do cliente */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Informações do Cliente</span>
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-muted-foreground"><b>Nome: </b>   </span>                 
                  <span className="font-medium">{demand.client_name}</span>
                </div>
                
                <div className="space-y-2">                
                  <span className="text-muted-foreground"><b>Telefone: </b>  </span>
                  <span className="font-medium">{demand.client_phone}</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-muted-foreground"><b>Email:  </b> </span>
                <span className="font-medium">{demand.client_email}</span>            
              </div>
            </div>

            {/* Informações do serviço */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center space-x-2">
                <Package className="h-4 w-4" />
                <span>Informações do Serviço</span>
              </h4>

              <div className="space-y-2">
                <Label htmlFor="edit-description"><b>Descrição:</b></Label><br></br>
                <span className="font-medium">{demand.description}</span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-notes"><b>Observações:</b></Label><br></br>
                <span className="font-medium">{demand.notes}</span>
              </div>
            </div>
          
           <Separator />
          <h3 className="font-medium flex items-center space-x-2">
            <Camera className="h-4 w-4" />
            <span><b>Fotos do Serviço</b></span>
          </h3>   
          <div className="grid grid-cols-1 gap-4 text-sm">           
             {demandPhoto.map((option) => (
                <center>
                        <div className="flex items-center space-x-2">
                          {option.image && (
                              <img src={option.image} alt={`Foto da Demanda #${demand.id}`} className="mt-4 rounded-md w-196 h-auto" />
                          )}
                        </div>
                </center>
              ))}
            
          </div>
            
          <center><p><b>Oversoul - Soluções Inteligentes com IA<br></br>
          www.oversoul.com.br<br></br>
          oversoul.ia@gmail.com<br>
          </br>(21) 99163-8862</b></p></center>
        </div>
      </div>
    </ScrollArea>

    
  );
};
