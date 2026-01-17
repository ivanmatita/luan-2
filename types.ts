
export enum UserRole {
  ADMIN = 'admin',
  CONTABILISTA = 'contabilista',
  OPERADOR = 'operador'
}

export enum CompanyType {
  COMERCIO_SERVICOS = 'Comércio e Serviços',
  SERVICOS = 'Serviços',
  COMERCIO = 'Comércio',
  RESTAURANTE = 'Restaurante',
  HOTELARIA = 'Hotelaria',
  CENTRO_FORMACAO = 'Centro de Formação',
  LOJAS = 'Lojas',
  BAR = 'Bar',
  OUTROS = 'Outros'
}

export enum PlanTier {
  BASIC = 'Básico',
  PREMIUM = 'Premium',
  PRO = 'Pro'
}

export enum BillingPeriod {
  MONTHLY = 'Mensal',
  QUARTERLY = 'Trimestral',
  ANNUAL = 'Anual'
}

export interface Company {
  id: string;
  nome_empresa: string;
  nif_empresa: string;
  administrador: string;
  localizacao: string;
  morada: string;
  contacto: string;
  email: string;
  tipo_empresa: string;
  plano: PlanTier;
  validade: string;
}

export interface User {
  id: string;
  empresa_id: string;
  email: string;
  perfil: UserRole;
  nome: string;
}

export interface AuthState {
  user: User | null;
  company: Company | null;
  isAuthenticated: boolean;
}

// --- RH TYPES ---
export interface Profissao {
  id: string;
  empresa_id: string;
  profissao_inss_id?: string;
  profissao_interna: string;
  salario_base: number;
  complemento_salarial?: number;
  nome?: string;
  descricao?: string;
  created_at?: string;
}

export interface Funcionario {
  id: string;
  empresa_id: string;
  employee_number?: string;
  nome: string;
  nif?: string;
  bi_number?: string;
  ssn?: string;
  cargo?: string;
  categoria?: string;
  departamento?: string;
  salario_base: number;
  status: 'ativo' | 'ferias' | 'suspenso' | 'desligado';
  data_admissao: string | null;
  data_demissao?: string | null;
  email?: string;
  telefone?: string;
  conta_bancaria?: string;
  nome_banco?: string;
  iban?: string;
  foto_url?: string;
  tipo_contrato?: string;
  subs_transporte?: number;
  subs_alimentacao?: number;
  subs_familia?: number;
  subs_habitacao?: number;
  genero?: string;
  data_nascimento?: string | null;
  estado_civil?: string;
  nacionalidade?: string;
  endereco?: string;
  municipio?: string;
  bairro?: string;
  created_at?: string;
  work_location_id?: string;
  subs_alimentacao_inicio?: string | null;
  subs_alimentacao_fim?: string | null;
  subs_transporte_inicio?: string | null;
  subs_transporte_fim?: string | null;
  subs_natal?: number;
  subs_natal_inicio?: string | null;
  subs_natal_fim?: string | null;
  subs_ferias?: number;
  subs_ferias_inicio?: string | null;
  subs_ferias_fim?: string | null;
  subs_extras?: number;
  subs_extras_inicio?: string | null;
  subs_extras_fim?: string | null;
  abonos?: number;
  abonos_inicio?: string | null;
  abonos_fim?: string | null;
  adiantamentos?: number;
  adiantamentos_inicio?: string | null;
  adiantamentos_fim?: string | null;
  outros_subsidios?: number;
  outros_subsidios_inicio?: string | null;
  outros_subsidios_fim?: string | null;
  dismissal_date?: string | null;
}

// --- VENDAS & LOCAL TRABALHO TYPES ---
export interface LocalTrabalho {
  id: string;
  empresa_id: string;
  cliente_id?: string;
  data_abertura: string | null;
  data_encerramento: string | null;
  titulo: string;
  cod: string;
  total_efectivos_dia?: number;
  total_efectivos?: number;
  localizacao?: string;
  descricao?: string;
  contacto?: string;
  observacoes?: string;
  created_at?: string;
}

export interface Venda {
  id: string;
  empresa_id: string;
  local_trabalho_id?: string;
  produto?: string;
  quantidade?: number;
  preco_unitario?: number;
  total?: number;
  data_venda: string | null;
  created_at?: string;
}

export interface ItemVenda {
  id: string;
  venda_id: string;
  produto_id?: string;
  descricao: string;
  quantidade: number;
  preco_unitario: number;
  desconto_percentual: number;
  total: number;
}
