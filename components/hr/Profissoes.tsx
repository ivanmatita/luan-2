
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Profissao } from '../../types';
import { Plus, Edit2, Trash2, Briefcase, Search, AlertCircle, Check, Landmark } from 'lucide-react';

interface ProfissoesProps {
  companyId: string;
}

// Lista Oficial de Profissões INSS (Angola) baseada nas imagens fornecidas
const LISTA_INSS = [
  "Químico", "Químico - Especialista em Química Orgânica", "Químico - Especialista em Química Inorgânica",
  "Químico - Especialista em Química-Física", "Químico-Especialista em Química Analítica", "Outros Químicos",
  "Físico", "Físico-Especialista em Mecânica", "Físico-Especialista em Termodinâmica", "Físico- Especialista em Óptica",
  "Físico- Especialista em Acústica", "Físico-Especialista em Electricidade e Magnetismo", "Físico-Especialista em Electrónica",
  "Físico especialista em energia nuclear", "Físico-Especialista do estado sólido", "Físico - Especialista em Física Atómica e Molecular",
  "Geofísico", "Geólogo", "Hidro-Geólogo", "Oceanógrafo", "Meteorologista", "Astrónomo", "Analista de Laboratório",
  "Arquitecto", "Arquitecto Paisagista", "Engenheiro Civil", "Engenheiro Civil - Construção de Edifícios", "Engenheiro Civil - Construção de Estradas",
  "Engenheiro Electrotécnico", "Engenheiro de Telecomunicações", "Engenheiro Mecânico", "Engenheiro de Minas", "Engenheiro de Petróleos",
  "Engenheiro Têxtil", "Desenhador em Geral", "Cartógrafo", "Topógrafo", "Biólogo", "Médico - Clínica Geral", "Médico Analista",
  "Contabilista", "Secretário(a)", "Motorista", "Vendedor(a)", "Gestor(a)", "Segurança", "Diretor(a) Geral"
];

const Profissoes: React.FC<ProfissoesProps> = ({ companyId }) => {
  const [profissoes, setProfissoes] = useState<Profissao[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ 
    id: '', 
    profissao_inss_id: '', 
    profissao_interna: '', 
    salario_base: 0, 
    complemento_salarial: 0 
  });
  const [actionStatus, setActionStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    fetchProfissoes();
  }, [companyId]);

  const fetchProfissoes = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profissoes')
        .select('*')
        .eq('empresa_id', companyId)
        .order('profissao_interna', { ascending: true });

      if (error) throw error;
      setProfissoes(data || []);
    } catch (err) {
      console.error('Erro ao buscar profissões:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionStatus(null);

    const payload = {
      profissao_inss_id: formData.profissao_inss_id,
      profissao_interna: formData.profissao_interna,
      salario_base: formData.salario_base,
      complemento_salarial: formData.complemento_salarial,
      empresa_id: companyId
    };

    try {
      if (formData.id) {
        const { error } = await supabase
          .from('profissoes')
          .update(payload)
          .eq('id', formData.id)
          .eq('empresa_id', companyId);
        if (error) throw error;
        setActionStatus({ type: 'success', message: 'Profissão atualizada com sucesso!' });
      } else {
        const { error } = await supabase
          .from('profissoes')
          .insert([payload]);
        if (error) throw error;
        setActionStatus({ type: 'success', message: 'Nova profissão criada com sucesso!' });
      }
      
      setIsModalOpen(false);
      setFormData({ id: '', profissao_inss_id: '', profissao_interna: '', salario_base: 0, complemento_salarial: 0 });
      fetchProfissoes();
    } catch (err: any) {
      setActionStatus({ type: 'error', message: err.message || 'Erro ao processar profissão.' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem a certeza que deseja remover esta profissão?')) return;

    try {
      const { error } = await supabase
        .from('profissoes')
        .delete()
        .eq('id', id)
        .eq('empresa_id', companyId);
      
      if (error) throw error;
      fetchProfissoes();
    } catch (err: any) {
      alert('Erro ao remover: ' + err.message);
    }
  };

  const filtered = profissoes.filter(p => 
    p.profissao_interna.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#001D4D] flex items-center gap-3">
            <Briefcase className="text-blue-500" /> Profissões & Cargos
          </h2>
          <p className="text-sm text-slate-500 font-medium">Gestão de cargos estruturais certificados e internos.</p>
        </div>
        <button 
          onClick={() => { setFormData({ id: '', profissao_inss_id: '', profissao_interna: '', salario_base: 0, complemento_salarial: 0 }); setIsModalOpen(true); }}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/10 active:scale-95"
        >
          <Plus size={20} /> Criar Nova Profissão
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Pesquisar cargo interno..." 
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center">
            Total: {profissoes.length} Cargos
          </div>
        </div>

        {actionStatus && (
          <div className={`m-6 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold ${actionStatus.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
            {actionStatus.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
            {actionStatus.message}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Cargo Interno</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Equiv. INSS</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Salário Base</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Comp. Salarial</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} className="p-10 text-center text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse">Carregando profissões...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="p-10 text-center text-slate-400 font-medium">Nenhum cargo encontrado.</td></tr>
              ) : filtered.map(profissao => (
                <tr key={profissao.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-bold text-slate-900">{profissao.profissao_interna}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">{profissao.profissao_inss_id || 'Não definido'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-black text-slate-900">{profissao.salario_base.toLocaleString()} Kz</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-emerald-600">{(profissao.complemento_salarial || 0).toLocaleString()} Kz</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => { 
                          setFormData({ 
                            id: profissao.id, 
                            profissao_inss_id: profissao.profissao_inss_id || '', 
                            profissao_interna: profissao.profissao_interna, 
                            salario_base: profissao.salario_base,
                            complemento_salarial: profissao.complemento_salarial || 0
                          }); 
                          setIsModalOpen(true); 
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(profissao.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
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
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="text-xl font-black text-[#001D4D]">{formData.id ? 'Editar Profissão' : 'Nova Profissão'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500 font-bold">×</button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1">
                  <Landmark size={12}/> Profissão Indexada INSS
                </label>
                <select 
                  className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none transition-all font-bold text-slate-700 bg-slate-50"
                  value={formData.profissao_inss_id}
                  onChange={e => setFormData({...formData, profissao_inss_id: e.target.value})}
                >
                  <option value="">Selecione na lista oficial...</option>
                  {LISTA_INSS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Nome Interno (Cargo)</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Supervisor de Campo"
                  className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none transition-all font-bold text-slate-700"
                  value={formData.profissao_interna}
                  onChange={e => setFormData({...formData, profissao_interna: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Salário Base (Kz)</label>
                  <input 
                    type="number" 
                    required
                    className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none transition-all font-bold text-slate-700"
                    value={formData.salario_base}
                    onChange={e => setFormData({...formData, salario_base: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Comp. Salarial (Kz)</label>
                  <input 
                    type="number" 
                    className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none transition-all font-bold text-slate-700"
                    value={formData.complemento_salarial}
                    onChange={e => setFormData({...formData, complemento_salarial: parseFloat(e.target.value)})}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-900/20 hover:bg-blue-700 active:scale-95 transition-all"
                >
                  {formData.id ? 'Salvar Alterações' : 'Criar Profissão'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profissoes;
