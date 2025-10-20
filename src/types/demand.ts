
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'manager' | 'operator';
  laundryId?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpfCnpj?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  laundry_id: string;
  code: string;
  supply_unit: string;
  price: string;
}

export type DemandStatus = "novo" | "em_andamento" | "pendente_insumo" | "entregue_parcial" | "entregue_total";

export type formaPagamento = "pix" | "dinheiro" | "deb_5%" | "cred_5%" | "pag_ret" | "pag_parc" | "pag_desc" | "isencao";


export interface LaundrySettings {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  workingHours: string;
  defaultDeliveryDays: number;
  status: 'atv' | 'inativo';
}

export interface Demand {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  cpf_cnpj: string;
  category: string[];
  description: string;
  price: string;
  discount: string;
  status: DemandStatus;
  notes?: string;
  /*photo01?: string;
  photo02?: string;
  photo03?: string;*/
  created_at: Date;
  updated_at: Date;
  owner: string;
  laundry_id: string;
  deliveryDate?: Date;
  delivery_forecast?: Date;
  payment: string; 
  payment_id: string;
  acronym: string;
  //category_name: string;
  codUnico: string;
  //responsibles: string;
}

//RELAÇÃO DE CAEGORIAS RELACIONADAS ÀS DEMANDAS

export interface Demand_category{
  id: string;
  category: string;
  status: string;
  demand_id: string;
  category_id: string;
}


//RELAÇÃO DE PHOTOS RELACIONADAS ÀS DEMANDAS
export interface Demand_photos{
  id: string;
  image: string;
  demand_id: string;
  status: string;
}

//RELAÇÃO DE PHOTOS RELACIONADAS ÀS DEMANDAS
export interface Payment_method{
  id: string;
  payment: string;
  acronym: string;
  status: string;
  laundry_id: string;
}

export interface Demand_payment{
  id: string;
  demand_id: string;
  status: string;
  paymentMethod_id: string;
}


///-------------PARA A IMPRESSAO


  // Tipos
export type OrcamentoItem = {
  codigo: string | number;
  descricao: string;
  quant: number;
  un?: string; // UN, KG...
  qtdCx?: number;
  pcm?: number; // preço por caixa/metro (opcional)
  precoUnit: number;
};

export type OrcamentoCliente = {
  destinatario?: string; // "294 - REGINALDO DIOGO"
  responsavel?: string; // "STEFANE"
  telefone1?: string;
  telefone2?: string;
  email1?: string;
  email2?: string;
  cnpjCpf?: string;
  obsReferencia?: string;
};

export type EmpresaInfo = {
  nome: string; // ex.: "MG COSTUREIRA"
  cnpj?: string; // ex.: "02.735.122/0001-51"
  ie?: string;   // ex.: "75 828 50-0"
  endereco1?: string; // RUA DOM GERARDO 07 LOJA 01 E SOBRADO CENTRO
  endereco2?: string; // CEP, Cidade/UF
  telefone?: string;  // Tel
  fax?: string;       // Fax
  logoUrl?: string;   // opcional (canto inferior direito)
};

export type OrcamentoMeta = {
  numeroOrcamento?: string | number; // 1000366
  numeroDocFiscal?: string | number; // pode ficar vazio
  dataVenda?: string; // 31/10/2023
};

export type Totais = {
  totalGeral: number;
  descNota?: number;
  totalLiquido: number;
};

export type OrcamentoProps = {
  empresa: EmpresaInfo;
  meta: OrcamentoMeta;
  cliente: OrcamentoCliente;
  itens: OrcamentoItem[];
  totais: Totais;
  observacoes?: string[];
  tituloDocumento?: string; // "DOCUMENTO AUXILIAR DE VENDA - ORÇAMENTO"
  avisoNaoFiscal?: string; // "NÃO É DOCUMENTO FISCAL..."
};