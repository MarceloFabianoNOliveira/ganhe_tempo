import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Search,
  Filter,
  ChevronRight,
  Edit,
  Trash2,
  Mail,
  Calendar,
  Phone,
  User,
  Package
} from 'lucide-react';
import { useDemands } from '@/contexts/DemandContext';
import { Demand, DemandStatus } from '@/types/demand';
import { DemandDetailsModal } from './DemandDetailsModal';
import { DemandListFilters } from './DemandListFilters';
import { DemandListItem } from './DemandListItem';
import { supabase } from '@/integrations/supabase/client'; // conexão com o Supabase
import { useAuth } from '@/contexts/AuthContext'; // Adicione esta linha

const statusConfig: Record<DemandStatus, { label: string; color: string }> = {
  novo: { label: 'Novo', color: 'bg-blue-500' },
  em_andamento: { label: 'Em Andamento', color: 'bg-yellow-500' },
  pendente_insumo: { label: 'Pendente Insumo', color: 'bg-green-500' },
  entregue_parcial: { label: 'Entregue Parcial', color: 'bg-orange-500' },
  entregue_total: { label: 'Entregue Total', color: 'bg-purple-500' }  
};

export const DemandList = () => {
  const { demands, updateDemandStatus, deleteDemand, sendEmailNotification } = useDemands();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<DemandStatus | 'all'>('all');
  const [selectedDemand, setSelectedDemand] = useState<Demand | null>(null);
  const [demandIdToDelete, setDemandIdToDelete] = useState<string | null>(null);
  const [categoryLabels, setCategoryLabels] = useState<Record<string, string>>({});
   // ...existing code...
  const { user } = useAuth(); // Pega o usuário logado
  const laundryId = user?.laundryId; // Id da lavanderia do usuário

  //LIMPEZA DE VARIÁVEIS DE SESSÃO
  sessionStorage.setItem("precoTeste", "0");

  useEffect(() => {
    const fetchCategories = async () => {
      if (!laundryId) return; // Só busca se tiver id
      const { data, error } = await supabase
        .from('categories')
        .select('id,name,laundry_id')
        .eq('laundry_id', laundryId); // Filtra pelo laundry_id
       

      if (error) {
        console.error('Erro ao buscar categorias:', error.message);
        return;
      }
      if (data) {
        const labels: Record<string, string> = {};
        data.forEach((cat: { id: string; name: string }) => {
          labels[cat.id] = cat.name;
        });
        
        setCategoryLabels(labels);
      }
    };
    fetchCategories();
  }, [laundryId]);


  const getNextStatus = (currentStatus: DemandStatus): DemandStatus | null => {
    const statusFlow: DemandStatus[] = ['novo','em_andamento', 'pendente_insumo', 'entregue_parcial', 'entregue_total'];
    const currentIndex = statusFlow.indexOf(currentStatus);
    return currentIndex < statusFlow.length - 1 ? statusFlow[currentIndex + 1] : null;
  };

  /*console.log("busca ", searchTerm);
  console.log("demanda ", demands);*/

  //FILTRA DEMANDA
  const filteredDemands = demands.filter(demand => {
    const matchesSearch = demand.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      //demand.id.includes(searchTerm) ||
      demand.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      demand.client_email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all'
      ? demand.status !== 'entregue_total'
      : demand.status === statusFilter;
    return matchesSearch && matchesStatus;

  });

  //console.log(filteredDemands);
  const handleAdvanceStatus = (demand: Demand) => {
    const nextStatus = getNextStatus(demand.status);
    if (nextStatus) {
      updateDemandStatus(demand.id, nextStatus);
    }
  };

  const handleSendEmail = (demand: Demand) => {
    sendEmailNotification(demand);
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

const formatDateOnly = (date: string | Date) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(d);
};

  const formatPrice = (price?: string) => {
    if (!price) return null;
    const num = parseFloat(price);
    if (!isNaN(num)) {
      return `R$ ${num.toFixed(2)}`;
    }
    return price;
  };
  


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-laundry-blue">Demandas</h2>
          <p className="text-muted-foreground">
            {filteredDemands.length} demanda(s) encontrada(s)
          </p>
        </div>
      </div>
      <DemandListFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        statusConfig={statusConfig}
      />
      <div className="space-y-4">
        {filteredDemands.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhuma demanda encontrada</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all'
                  ? 'Tente ajustar os filtros de busca'
                  : 'Crie sua primeira demanda para começar'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredDemands.map((demand) => (
            <DemandListItem
              key={demand.id}
              demand={demand}
              nextStatus={getNextStatus(demand.status)}
              statusConfig={statusConfig}
              categoryLabels={categoryLabels}
              formatPrice={formatPrice}
              formatDate={formatDate}
              formatDateOnly={formatDateOnly}
              onAdvanceStatus={handleAdvanceStatus}
              onEdit={setSelectedDemand}
              onSendEmail={handleSendEmail}
              onDelete={(demandObj) => deleteDemand(demandObj.id)}
              demandIdToDelete={demandIdToDelete}
              setDemandIdToDelete={setDemandIdToDelete}
              selectedDemand={selectedDemand}
              setSelectedDemand={setSelectedDemand}
              

            />
          ))
        )}
      </div>
    </div>
  );
};
