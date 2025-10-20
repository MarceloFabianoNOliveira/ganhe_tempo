
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { DemandDetailsModal } from './DemandDetailsModal';
import { DemandDetailsPhotosModal } from './DemandDetailsPhotosModal';
import { NotaFiscal } from '@/press/nota_fiscal';
import { Mail, Calendar, Phone, User, Edit, Trash2, Package, ChevronRight, Search, Printer } from 'lucide-react';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { Demand } from '@/types/demand';
import { toast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"

interface DemandListItemProps {
  demand: Demand;
  nextStatus: string | null;
  statusConfig: Record<string, { label: string; color: string }>;
  categoryLabels: Record<string, string>;
  formatPrice: (price?: string) => string | null;
  formatDate: (date: Date) => string;
  formatDateOnly: (date: Date) => string;
  onAdvanceStatus: (demand: Demand) => void;
  onEdit: (demand: Demand) => void;
  onSendEmail: (demand: Demand) => void;
  onDelete: (demand: Demand) => void;
  demandIdToDelete: string | null;
  setDemandIdToDelete: (id: string | null) => void;
  selectedDemand: Demand | null;
  setSelectedDemand: (demand: Demand | null) => void;
  setPressDemand: (id: string | null) => void;
  
}


export const DemandListItem: React.FC<DemandListItemProps> = ({
  demand,
  nextStatus,
  statusConfig,
  categoryLabels,
  formatPrice,
  formatDate,
  formatDateOnly,
  onAdvanceStatus,
  onEdit,
  onSendEmail,
  onDelete,
  demandIdToDelete,
  setDemandIdToDelete,
  selectedDemand,
  setSelectedDemand,
  setPressDemand
}) => (
  <Card key={demand.id} className="hover:shadow-md transition-shadow">
    <CardContent className="p-6">
      <div className="flex flex-col lg:flex-row justify-between">
        <div className="flex-1 space-y-3">
          <div className="flex items-center space-x-4">
            <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
              #{demand.codUnico}
        
            </span>
            <Badge className={`${statusConfig[demand.status].color} text-white`}>
              {statusConfig[demand.status].label}
            </Badge>
           
            {demand.price && (
              <span className="text-sm font-medium text-green-600">
                {formatPrice(demand.price)}
              </span>
            )}
          </div>
           
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{demand.client_name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{demand.client_email}</span>
            </div>
            {demand.client_phone && (
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{demand.client_phone}</span>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Recebido: {formatDate(demand.created_at)}</span>
            </div>
            {demand.delivery_forecast && (
              <div className="flex items-center space-x-2 col-span-full">
                <Calendar className="h-4 w-4 text-blue-500" />
                <span className="text-blue-600 font-medium">
                  Previsão de entrega: {formatDateOnly(demand.delivery_forecast)}
                </span>
              </div>
            )}
          </div>
          <div className="my-2 p-3 bg-gray-50 border rounded text-gray-800 text-sm">
            <strong>Descrição:</strong> {demand.description}
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <strong>Próximo status: </strong>
                {nextStatus ? (
                  <Button
                    size="sm"
                    className={`${statusConfig[nextStatus].color} text-white ml-1 flex items-center gap-1 hover:opacity-90`}
                    onClick={() => {
                      const currentLabel = statusConfig[demand.status]?.label ?? String(demand.status);
                      const nextLabel = statusConfig[nextStatus]?.label ?? String(nextStatus);

                      toast({
                        title: "Confirmar avanço de status?",
                        description: `${currentLabel} → ${nextLabel}`,
                        duration: 7000, // mantém o toast um pouco mais tempo
                        action: (
                          <ToastAction
                            altText="Confirmar avanço"
                            onClick={() => onAdvanceStatus(demand)}
                          >
                            Confirmar
                          </ToastAction>
                        ),
                      });
                    }}
                  >
                    {statusConfig[nextStatus].label}
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Badge className="bg-gray-400 text-white ml-1">Último status</Badge>
                )}
              </span>
           
          </div>
        </div>
      </div>
      &nbsp;
      <div className="flex items-center gap-2">
              
          {/* Visualizar */  }
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedDemand(demand);
                onEdit(demand);
              }}
            >
              Imprimir <Printer className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" >
            <NotaFiscal demand={selectedDemand} />
          </DialogContent>
        </Dialog>
        {/* Visualizar */  }
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedDemand(demand);
                //onEdit(demand);
              }}
            >
              Visualizar <Search className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DemandDetailsPhotosModal demand={selectedDemand} />
          </DialogContent>
        </Dialog>
        
      </div>
      
       <div className="flex items-center gap-2">
              
              
              {/* Editar */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedDemand(demand);
                      onEdit(demand);
                    }}
                  >
                    Editar&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<Edit className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DemandDetailsModal demand={selectedDemand} />
                </DialogContent>
              </Dialog>
              {/* Email */}
              {demand.status === 'entregue_total' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSendEmail(demand)}
                >
                  <Mail className="h-4 w-4" />
                </Button>
              )}
              {/* Excluir com confirmação */}
              {(demand.status !== 'entregue_total' && demand.status !== 'entregue_parcial') && (
                
             
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:border-red-300"
                    onClick={() => setDemandIdToDelete(demand.id)}
                  >
                  Excluir &nbsp;&nbsp;&nbsp;&nbsp;<Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Tem certeza que deseja excluir esta demanda?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não poderá ser desfeita.<br />
                      A demanda <span className="font-semibold">#{demand.codUnico}</span> será marcada como cancelada.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel
                      onClick={() => setDemandIdToDelete(null)}
                    >
                      Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-600 text-white hover:bg-red-700"
                      onClick={() => {
                        if (demandIdToDelete && demandIdToDelete === demand.id) {
                          onDelete(demand);
                          setDemandIdToDelete(null);
                        }
                      }}
                    >
                      Sim, cancelar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              )}
            </div>
    </CardContent>
  </Card>
);
