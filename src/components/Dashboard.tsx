
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDemands } from '@/contexts/DemandContext';
import { DemandStatus } from '@/types/demand';
import { useAuth } from '@/contexts/AuthContext';

import { 
  Package, 
  Clock, 
  CheckCircle, 
  UserCheck, 
  Truck,
  TrendingUp,
  Users,
  Calendar
} from 'lucide-react';

const statusConfig = {
  "novo": { label: 'Novo', icon: Package, color: 'bg-blue-500' },
  "em_andamento": { label: 'Em Andamento', icon: Clock, color: 'bg-yellow-500' },
  "pendente_insumo": { label: 'Pendente de Insumo', icon: CheckCircle, color: 'bg-green-500' },
  "entregue_parcial": { label: 'Entregue Parcial', icon: UserCheck, color: 'bg-orange-500' },
  "entregue_total": { label: 'Entregue Total', icon: Truck, color: 'bg-purple-500' }
};


//formata valores para o real brasileira 
export function formatBRL(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === '') return 'R$ 0,00';

  // Se vier como string "1.234,56" (pt-BR), normalize:
  if (typeof value === 'string' && /,\d{1,2}$/.test(value)) {
    const pt = value.replace(/\./g, '').replace(',', '.'); // "1.234,56" -> "1234.56"
    const n = Number(pt);
    if (Number.isFinite(n)) {
      return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
  }

  // Caso geral: número ou string "1234.56"
  const n = Number(value);
  return Number.isFinite(n)
    ? n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    : '—';
}

export const Dashboard = () => {
  const { demands, getDemandsByStatus } = useDemands(); 
  
  const getStatusCounts = () => {
    return Object.keys(statusConfig).reduce((acc, status) => {
      acc[status as DemandStatus] = getDemandsByStatus(status as DemandStatus).length;
      return acc;
    }, {} as Record<DemandStatus, number>);
  };

  //LIMPEZA DE VARIÁVEIS DE SESSÃO
  sessionStorage.setItem("precoTeste", "0");

  const { user } = useAuth();
  const statusCounts = getStatusCounts();
  console.log("STATUS ", statusCounts)
  const totalDemands = demands.length;
  const recentDemands = demands.slice(0, 5);

  const getTotalRevenue = () => {
    return demands
      .filter(d => d.status === "entregue_total" && d.price)
      .reduce((total, d) => {
        // Parse to float and sum only if valid, otherwise 0
        const priceNum = d.price ? parseFloat(d.price as string) : 0;
        
        return total + (isNaN(priceNum) ? 0 : priceNum);
      }, 0);
  };


  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-laundry-blue mb-2">Dashboard</h2>
        <p className="text-muted-foreground">Visão geral do sistema de gerenciamento</p>
      </div>

      {/* Cards de estatísticas gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Demandas</p>
                <p className="text-2xl font-bold">{totalDemands}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Finalizadas</p>
                <p className="text-2xl font-bold">
                   {Number(statusCounts.entregue_total)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Em Andamento</p>
                <p className="text-2xl font-bold">{statusCounts.em_andamento}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Faturamento</p>
                <p className="text-2xl font-bold">R$ {getTotalRevenue().toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cards de status */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Status das Demandas</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {Object.entries(statusConfig).map(([status, config]) => {
            const Icon = config.icon;
            const count = statusCounts[status as DemandStatus];
            //console.log("COUNT", count);
            
            return (
              <Card key={status} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{config.label}</p>
                      <p className="text-3xl font-bold mt-1">{count}</p>
                    </div>
                    <div className={`p-3 rounded-full ${config.color}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      { /**ÁREA DE DEMONSTRAÇÃO */}
      {user?.role !== 'admin' && (
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Demandas Recentes</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentDemands.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Nenhuma demanda encontrada
            </p>
          ) : (
            <div className="space-y-4">
              {recentDemands.map((demand) => (
                <div
                  key={demand.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    
                    <p className="text-sm text-muted-foreground mt-1">
                    
                      <b>#{demand.codUnico}</b><br />
                      {demand.client_name}<br />
                     <b> Valor: </b> {formatBRL(demand.price)}<br />
                     <b> Data Entrega: </b>{demand.delivery_forecast? new Date(demand.delivery_forecast).toLocaleDateString(): 'N/A'}<br></br>
                     <b> Descrição: </b> {demand.description}<br />
                      <b>Serviços</b>:  
                      <Badge 
                        className={`${statusConfig[demand.status].color} text-white`}
                      >
                          {statusConfig[demand.status].label}
                      </Badge>
                    </p>
                  </div>
                  
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      )}
    </div>
  );
};
