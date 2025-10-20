
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
import { useLaundries } from '@/contexts/LaundryContext';

interface NotaFiscalProps {
  demand: Demand | null;
}

type Laundry = {
  name: string;
  address: string;
  phone: string;
  email: string;
  workingHours: string;
  defaultDeliveryDays: number;
  logo?: string;
  status: string;
};

type Demand_impress = {
  client_name: string;
  client_email: string;
  client_phone: string;
  cpf_cnpj: string;
  category: string;
  description: string;
  price: string;
  notes: string;
  business_name: string;
  address: string;
  phone: string;
  email: string;
  workingHours: string;
  defaultDeliveryDays: number;
  logo?: string;
  status: string;
  name: string;
  responsavel: string;
  codUnico: string;
  discount: string;
};

type Category_Contrated = {
  //category: string;
  status: string;
  code: string;
  name: string;
  quantidade: number;
  price: number;
  supply_unit: string;


  
};


export const NotaFiscal: React.FC<NotaFiscalProps> = ({ demand }) => {
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

  console.log("demanda -- ", demand.id);

  //BUSCAR AS CATEGORIAS DE SERVIÇOS
  //const [laundries, setLaundries] = useState<{ value: string; image: string }[]>([]);
  //const [laundries, setLaundries] = React.useState<Demand_impress[]>([]);

  const [demands_impress_view, setDemands] = React.useState<Demand_impress[]>([]);

  const [demands_category_impress_view, setCategory] = React.useState<Category_Contrated[]>([]);
  

  const { user } = useAuth(); // Pega o usuário logado
  //const laundryId = user?.laundryId; // Id da lavanderia do usuário
  const { laundries } = useLaundries();

  console.log("LAVANDERIA",laundries); 
  
  useEffect(() => {
    
    if (!(demand.laundry_id)) return; // só busca se houver id

    const fetchLaundries = async () => {      
      const { data, error } = await supabase
        .from('demand_impress')
        .select('*')
        .eq('id', demand.id);         
      if (error) {
        console.error('Erro ao buscar Demanda:', error.message);
      } else if (data) {
        console.log("TESTETETETE");
        setDemands(data);
      }

      //console.log("TESTE");
      //CATEGORIAS DE SERVIÇO
      const { data: demandRow, error: fetchError } =  await supabase
        .from('category_contrated')
        .select('*')
        .eq('demand_id', demand.id)
        .eq('dc_status','atv');
        console.log("TESTE ----- ", demandRow);
      if (fetchError) {
        console.error('Erro ao buscar Categorias de serviço:', fetchError.message);
      } else if (demandRow) {
        console.log("CATEGORIAS ", demandRow);
        setCategory(demandRow);
      }

    
  

    };
    fetchLaundries();
  }, [demand.id]); // <- agora laundryId é dependência

  const totalPrice = demands_category_impress_view.reduce(
    (acc, cat) => acc + (typeof cat.price === "number" ? cat.price : parseFloat(cat.price || "0")),
    0
  );

  const totalDiscount = demands_impress_view.reduce(
    (acc, item) => acc + (typeof item.discount === "number" ? item.discount : parseFloat(item.discount || "0")),
    0
  );

  //TOTAL LIQUIDO
  const totalLiquido = totalPrice - totalDiscount;

  //--------------RECUPERA A LOGO DA EMPRESA
  const mainLaundry = laundries.length > 0 ? laundries[0] : null;
  const showBusinessBranding = user && (user.role === 'operator' || user.role === 'manager');

  // Nome do negócio ou título default
  const businessName = showBusinessBranding
    ? mainLaundry?.name || 'Lavanderia'
    : mainLaundry?.name;

  // Caminho para o logo, se existir, do contrário undefined
  const businessLogo = showBusinessBranding && mainLaundry?.logo ? mainLaundry.logo : undefined;
  console.log("Nome", businessName);
  //--------------FIM RECUPERA LOGO DA EMPRESA

  // INFORMAÇÕES PARA SEREM APRESENTADAS
  const tituloDocumento = "DOCUMENTO AUXILIAR DE VENDA / ORÇAMENTO";
  const avisoNaoFiscal_1 = " NÃO É DOCUMENTO FISCAL";
  const avisoNaoFiscal_2 = " NÃO É VÁLIDO COMO RECIBO E COMO GARANTIA DE MERCADORIA NÃO COMPROVA PAGAMENTO";

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
 
const brl = (v: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  return (
    <div className="w-full min-h-screen bg-white text-black">
      <style>{`
        :root { --border: #333; --muted: #444; }
        @page { size: A4; margin: 16mm; }
        @media print { .no-print { display: none !important; } }
        .doc { font-family: Arial, Helvetica, sans-serif; font-size: 12px; }
        .center { text-align: center; }
        .right { text-align: right; }
        .muted { color: var(--muted); }
        .heading { font-weight: bold; }
        .line { border-top: 1px solid var(--border); margin: 6px 0; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid var(--border); padding: 6px 6px; vertical-align: top; }
        th { background: #f5f5f5; font-weight: bold; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
        .topblock td { border: none; padding: 0; }
        .signature { height: 70px; }
        .logo { position: relative; }
      `}</style>

      <div className="doc">
        {/* Cabeçalho Superior */}
        <div className="center heading" style={{ marginBottom: 4 }}>{tituloDocumento}</div>
        <div className="center" style={{ marginBottom: 6 }}>{avisoNaoFiscal_1}</div>
        <div className="center" style={{ marginBottom: 6 }}>{avisoNaoFiscal_2}</div>

        {demands_impress_view.map((option) => (
          <div className="center heading" style={{ fontSize: 16, margin: "6px 0" }}>{option.name.toUpperCase()}</div>
        ))}  

        {demands_impress_view.map((option) => (
        <table className="topblock" style={{ width: "100%", marginBottom: 6 }}>
          <tbody>
            <tr>
              <td style={{ width: "70%" }}>                
                <div><span className="heading">CNPJ:</span> {option.cpf_cnpj ?? ""}</div>
                <div>{option.address ?? ""}</div>
                <div>{option.address ?? ""}</div>
                <div>
                  {option.phone && <>Tel.: {option.phone} </>}
                  {option.phone && <>FAX.: {option.phone}</>}
                </div>
              </td>
              <td className="right" style={{ width: "30%" }}>
                {option.phone && <div><span className="heading">I.E.:</span> {option.phone}</div>}
                <div><span className="heading">Data Venda:</span> {option.phone ?? ""}</div>
              </td>
            </tr>
          </tbody>
        </table>
        ))}

        <div className="line" />

        {/* Linha Orçamento / No Doc Fiscal */}
        {demands_impress_view.map((option) => (
        <table style={{ marginBottom: 8 }}>
          <tbody>
            <tr>
              <td style={{ width: "50%" }}>
                <span className="heading">Orçamento</span>
                <span style={{ marginLeft: 12 }}>{option.codUnico}</span>
              </td>
              <td style={{ width: "50%" }}>
                <span className="heading">No. do Documento Fiscal</span>
                <span style={{ marginLeft: 12 }}>{}</span>
              </td>
            </tr>
          </tbody>
        </table>
        ))}
        
        {/* Bloco Cliente / Responsável */}
        {demands_impress_view.map((option) => (

        <table style={{ marginBottom: 8 }}>
          <tbody>
            <tr>
              <td style={{ width: "50%" }}>
                <div><span className="heading">Destinatário:</span> {option.client_name ?? ""}</div>
                <div><span className="heading">Telefone:</span> {option.client_phone ?? ""}</div>
                <div><span className="heading">E-Mail:</span> {option.client_email ?? ""}</div>
                <div><span className="heading">CNPJ/CPF:</span> {option.cpf_cnpj ?? ""}</div>
              </td>
              <td style={{ width: "50%" }}>
                <div><span className="heading">Responsável:</span> {option.responsavel ?? ""}</div>
                <div><span className="heading">Telefone:</span> {option.phone ?? ""}</div>
                <div><span className="heading">E-Mail:</span> {option.email ?? ""}</div>
              </td>
            </tr>
          </tbody>
        </table>
        ))}


     {/* Itens */}
      <table style={{ marginBottom: 8 }}>
      <thead>
      <tr>
        <th style={{ width: "10%" }}>Código</th>
        <th>Descrição do Material</th>
        <th style={{ width: "8%" }} className="right">Quant</th>
        <th style={{ width: "6%" }}>UN</th>
        <th style={{ width: "8%" }} className="right">Qtd CX</th>
        <th style={{ width: "10%" }} className="right">PC/M</th>
        <th style={{ width: "12%" }} className="right">Preço Unit</th>
        <th style={{ width: "12%" }} className="right">Total Parcial</th>
      </tr>
      </thead>
      <tbody>
      {demands_category_impress_view.map((cat) => (
      <tr>
        <td><center>{cat.code}</center></td>
        <td>{cat.name}</td>
        <td className="right">{cat.quantidade ?? 1}</td>
        <td><center>{cat.supply_unit ?? "UN"}</center></td>
        <td className="right"></td>
        <td className="right"></td>
        <td className="right"><center>{brl(cat.price)}</center></td>
        <td className="right"><center>{brl(cat.price)}</center></td>
      </tr>
      ))}
      {/* Linha total de itens */}
        <tr>
          <td colSpan={2} className="heading">TOTAL DE ITENS</td>
          <td colSpan={5}></td>
          <td colSpan={1}><center>{brl(totalPrice)}</center></td>
        </tr>
      </tbody>
      </table>

      {/* Totais */}
      <table style={{ marginBottom: 12 }}>
      <tbody>
        <tr>
          <td className="heading" style={{ width: "33%" }}>Total Geral:</td>
          <td style={{ width: "33%" }}>{brl(totalPrice ?? 0)}</td>
          <td className="heading" style={{ width: "17%" }}>Desc Nota:</td>
          <td style={{ width: "17%" }}>{brl(totalDiscount ?? 0)}</td>
          <td className="heading" style={{ width: "17%" }}>Total Líquido:</td>
          <td style={{ width: "17%" }}>{brl(totalLiquido ?? 0)}</td>
        </tr>
      </tbody>
      </table>

      {/* Observações */}
      <div className="heading" style={{ marginBottom: 4 }}>Observações:</div>
      <table style={{ marginBottom: 12 }}>
        <tbody>
          <tr>
            <td style={{ height: 60 }}>
            {demands_impress_view[0]?.description && demands_impress_view[0]?.description.length > 0 ? (
            <ul style={{ margin: 0, paddingLeft: 16 }}>
            {demands_impress_view[0]?.description}
            </ul>
            ) : (
            <div className="muted">(sem observações)</div>
            )}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Assinatura / Logo opcional */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
      <div style={{ width: "60%" }}>
      <div className="signature" style={{ borderTop: "1px solid #333", marginTop: 24 }} />
      <div className="muted">Assinatura do Cliente</div>
      </div>
        {businessLogo && (
        <div className="logo" style={{ width: 180, textAlign: "right" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={businessLogo} alt="Logo" style={{ maxWidth: "100%", maxHeight: 90, objectFit: "contain" }} /> {businessName}
        </div>
        )}
        </div>


          {/* Botões */}
          <div className="no-print" style={{ marginTop: 16, display: "flex", gap: 8 }}>
              <button onClick={() => window.print()} style={{ padding: "8px 12px", background: "#111", color: "#fff", borderRadius: 8 }}>Imprimir</button>
          </div>
        </div>
      </div>
);
}
