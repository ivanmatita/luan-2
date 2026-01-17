
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Funcionario, Profissao } from '../../types';
import { 
  Plus, UserPlus, Search, Filter, MoreHorizontal, User, 
  Mail, Phone, Calendar, DollarSign, Users, ChevronDown, 
  ChevronUp, CreditCard, MapPin, Briefcase, Info, Camera,
  ShieldCheck, Trash2, Upload
} from 'lucide-react';

interface FuncionariosProps {
  companyId: string;
}

const Funcionarios: React.FC<FuncionariosProps> = ({ companyId }) => {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [profissoes, setProfissoes] = useState<Profissao[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>('basico');
  
  const [formData, setFormData] = useState<Partial<Funcionario>>({
    nome: '', email: '', telefone: '', nif: '', bi_number: '', ssn: '',
    employee_number: '', cargo: '', categoria: '', departamento: '',
    salario_base: 0, status: 'ativo', data_admissao: null,
    conta_bancaria: '', nome_banco: '', iban: '', genero: '', nacionalidade: '',
    data_nascimento: null, estado_civil: '', endereco: '', municipio: '', bairro: '',
    tipo_contrato: '', subs_transporte: 0, subs_alimentacao: 0, subs_familia: 0, subs_habitacao: 0,
    foto_url: ''
  });

  useEffect(() => {
    fetchData();
  }, [companyId]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data: funcData, error: funcError } = await supabase
        .from('funcionarios')
        .select('*')
        .eq('empresa_id', companyId);

      if (funcError) throw funcError;
      
      const { data: profData, error: profError } = await supabase
        .from('profissoes')
        .select('*')
        .eq('empresa_id', companyId);

      if (profError) throw profError;

      setFuncionarios(funcData || []);
      setProfissoes(profData || []);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${companyId}/${Math.random()}.${fileExt}`;
      const filePath = `fotos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('funcionarios')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('funcionarios')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, foto_url: publicUrl }));
    } catch (err: any) {
      alert('Erro no upload: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDateValue = (val: string | null | undefined) => {
    if (!val || val.trim() === "") return null;
    return val;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        empresa_id: companyId,
        data_admissao: handleDateValue(formData.data_admissao as string),
        data_nascimento: handleDateValue(formData.data_nascimento as string),
        // Adicionar outros campos de data com o mesmo tratamento se necessário
      };

      const { error } = await supabase
        .from('funcionarios')
        .insert([payload]);

      if (error) throw error;
      
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      alert('Erro ao cadastrar: ' + err.message);
    }
  };

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const filtered = funcionarios.filter(f => 
    f.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const Section = ({ title, id, icon: Icon, children }: any) => (
    <div className="border-b border-slate-100">
      <button 
        type="button"
        onClick={() => toggleSection(id)}
        className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-all text-left"
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${openSection === id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
            <Icon size={18} />
          </div>
          <span className="font-black text-xs uppercase tracking-widest text-[#001D4D]">{title}</span>
        </div>
        {openSection === id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {openSection === id && (
        <div className="p-6 bg-white animate-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {children}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#001D4D] flex items-center gap-3">
            <Users className="text-blue-500" /> Quadro de Pessoal
          </h2>
          <p className="text-sm text-slate-500 font-medium">Gestão centralizada de funcionários e benefícios.</p>
        </div>
        <button 
          onClick={() => {
            setFormData({
               nome: '', email: '', telefone: '', nif: '', bi_number: '', ssn: '',
               employee_number: '', cargo: '', categoria: '', departamento: '',
               salario_base: 0, status: 'ativo', data_admissao: null,
               conta_bancaria: '', nome_banco: '', iban: '', genero: '', nacionalidade: '',
               data_nascimento: null, estado_civil: '', endereco: '', municipio: '', bairro: '',
               tipo_contrato: '', subs_transporte: 0, subs_alimentacao: 0, subs_familia: 0, subs_habitacao: 0,
               foto_url: ''
            });
            setIsModalOpen(true);
          }}
          className="bg-[#00D18C] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[#00b378] transition-all shadow-lg shadow-green-900/10 active:scale-95"
        >
          <UserPlus size={20} /> Adicionar Funcionário
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Pesquisar por nome ou NIF..." 
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
             <div className="text-xs font-black text-slate-400 uppercase tracking-widest">Registados: {funcionarios.length}</div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Funcionário</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Cargo</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Salário Base</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Estado</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} className="p-10 text-center text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse">Carregando dados...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="p-10 text-center text-slate-400 font-medium">Nenhum funcionário encontrado.</td></tr>
              ) : filtered.map(f => (
                <tr key={f.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#001D4D] rounded-xl flex items-center justify-center text-white font-black shadow-md overflow-hidden">
                        {f.foto_url ? <img src={f.foto_url} className="w-full h-full object-cover" /> : f.nome.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 leading-none">{f.nome}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-tight">NIF: {f.nif || '---'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-slate-600">{f.cargo || '---'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-black text-slate-900">{f.salario_base.toLocaleString()} Kz</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      f.status === 'ativo' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {f.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Info size={16}/></button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#001D4D]/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center flex-shrink-0">
              <h3 className="text-xl font-black text-[#001D4D]">Registo Completo de Funcionário</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500 font-bold">×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="overflow-y-auto flex-grow bg-slate-50/30">
              <Section title="Dados Gerais e Foto" id="basico" icon={User}>
                <div className="col-span-full flex flex-col items-center mb-6">
                  <div className="w-32 h-32 bg-slate-100 rounded-3xl border-4 border-white shadow-lg flex items-center justify-center text-slate-300 relative group cursor-pointer overflow-hidden">
                    {formData.foto_url ? (
                      <img src={formData.foto_url} className="w-full h-full object-cover" />
                    ) : (
                      <Camera size={40} className={isUploading ? 'animate-bounce' : 'group-hover:scale-110 transition-transform'} />
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      onChange={handleFileUpload}
                      disabled={isUploading}
                    />
                    <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[8px] font-bold text-center py-1 opacity-0 group-hover:opacity-100 transition-opacity uppercase">
                      {isUploading ? 'A Carregar...' : 'Alterar Foto'}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Número Interno</label>
                  <input type="text" className="w-full p-3 border rounded-xl" value={formData.employee_number} onChange={e => setFormData({...formData, employee_number: e.target.value})} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Nome Completo</label>
                  <input type="text" required className="w-full p-3 border rounded-xl font-bold" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">NIF Angola</label>
                  <input type="text" className="w-full p-3 border rounded-xl" value={formData.nif} onChange={e => setFormData({...formData, nif: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Data Admissão</label>
                  <input type="date" className="w-full p-3 border rounded-xl" value={formData.data_admissao || ''} onChange={e => setFormData({...formData, data_admissao: e.target.value || null})} />
                </div>
              </Section>

              <Section title="Cargo e Contractual" id="cargo" icon={Briefcase}>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Cargo Interno</label>
                  <select className="w-full p-3 border rounded-xl" value={formData.cargo} onChange={e => setFormData({...formData, cargo: e.target.value})}>
                    <option value="">Selecione...</option>
                    {profissoes.map(p => <option key={p.id} value={p.profissao_interna}>{p.profissao_interna}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Salário Base (Kz)</label>
                  <input type="number" required className="w-full p-3 border rounded-xl font-black text-blue-600" value={formData.salario_base} onChange={e => setFormData({...formData, salario_base: parseFloat(e.target.value)})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Tipo Contrato</label>
                  <select className="w-full p-3 border rounded-xl" value={formData.tipo_contrato} onChange={e => setFormData({...formData, tipo_contrato: e.target.value})}>
                    <option value="">Selecione...</option>
                    <option value="Determinado">Determinado</option>
                    <option value="Indeterminado">Indeterminado</option>
                  </select>
                </div>
              </Section>

              <Section title="Dados Bancários" id="banco" icon={CreditCard}>
                <div className="space-y-2 md:col-span-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">IBAN (Angola)</label>
                  <input type="text" className="w-full p-3 border rounded-xl font-mono text-sm" placeholder="AO06..." value={formData.iban} onChange={e => setFormData({...formData, iban: e.target.value})} />
                </div>
              </Section>

              <div className="p-8 bg-white border-t sticky bottom-0 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-all border border-slate-200"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-[#00D18C] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-[#00b378] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <ShieldCheck size={18} /> Salvar Registo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Funcionarios;
