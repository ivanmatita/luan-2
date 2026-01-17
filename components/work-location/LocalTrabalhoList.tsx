
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { LocalTrabalho } from '../../types';
import { Plus, MapPin, Search, Calendar, User, Phone, Info, Trash2, ShieldCheck } from 'lucide-react';

interface LocalTrabalhoListProps {
  companyId: string;
}

const LocalTrabalhoList: React.FC<LocalTrabalhoListProps> = ({ companyId }) => {
  const [locais, setLocais] = useState<LocalTrabalho[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<Partial<LocalTrabalho>>({
    titulo: '', cod: '', data_abertura: '', data_encerramento: '', 
    total_efectivos_dia: 0, total_efectivos: 0, localizacao: '', 
    descricao: '', contacto: '', observacoes: ''
  });

  useEffect(() => {
    fetchLocais();
  }, [companyId]);

  const fetchLocais = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('local_trabalho')
        .select('*')
        .eq('empresa_id', companyId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLocais(data || []);
    } catch (err) {
      console.error('Erro ao buscar locais:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateValue = (val: string | undefined | null) => {
    return val && val.trim() !== "" ? val : null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        empresa_id: companyId,
        data_abertura: handleDateValue(formData.data_abertura),
        data_encerramento: handleDateValue(formData.data_encerramento)
      };

      const { error } = await supabase
        .from('local_trabalho')
        .insert([payload]);

      if (error) throw error;
      
      setIsModalOpen(false);
      setFormData({
        titulo: '', cod: '', data_abertura: '', data_encerramento: '', 
        total_efectivos_dia: 0, total_efectivos: 0, localizacao: '', 
        descricao: '', contacto: '', observacoes: ''
      });
      fetchLocais();
    } catch (err: any) {
      alert('Erro ao registar: ' + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem a certeza que deseja remover este local de trabalho?')) return;
    try {
      const { error } = await supabase
        .from('local_trabalho')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchLocais();
    } catch (err: any) {
      alert('Erro ao remover: ' + err.message);
    }
  };

  const filtered = locais.filter(l => 
    l.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.cod.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#001D4D] flex items-center gap-3">
            <MapPin className="text-emerald-500" /> Locais de Trabalho / Obras
          </h2>
          <p className="text-sm text-slate-500 font-medium">Gestão de frentes de serviço e postos de trabalho.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-lg active:scale-95"
        >
          <Plus size={20} /> Criar Local de Trabalho
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Pesquisar por título ou COD..." 
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Cód / Título</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Abertura</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Efectivos</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Localização</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} className="p-10 text-center text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse">Carregando locais...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="p-10 text-center text-slate-400 font-medium">Nenhum local registado.</td></tr>
              ) : filtered.map(l => (
                <tr key={l.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{l.titulo}</p>
                    <p className="text-[10px] text-emerald-600 font-black uppercase tracking-tighter">COD: {l.cod}</p>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-600">
                    {l.data_abertura ? new Date(l.data_abertura).toLocaleDateString('pt-PT') : '---'}
                  </td>
                  <td className="px-6 py-4 text-sm font-black text-slate-900">
                    {l.total_efectivos || 0}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {l.localizacao || 'Não definida'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Info size={16}/></button>
                      <button onClick={() => handleDelete(l.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
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
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="text-xl font-black text-[#001D4D]">Novo Local de Trabalho</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500 font-bold">×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="overflow-y-auto p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Título do Local/Obra</label>
                  <input required type="text" className="w-full p-3 border rounded-xl" value={formData.titulo} onChange={e => setFormData({...formData, titulo: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">COD Interno</label>
                  <input required type="text" className="w-full p-3 border rounded-xl" value={formData.cod} onChange={e => setFormData({...formData, cod: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Data Abertura</label>
                  <input type="date" className="w-full p-3 border rounded-xl" value={formData.data_abertura} onChange={e => setFormData({...formData, data_abertura: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Data Encerramento</label>
                  <input type="date" className="w-full p-3 border rounded-xl" value={formData.data_encerramento} onChange={e => setFormData({...formData, data_encerramento: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Efectivos p/ Dia</label>
                  <input type="number" className="w-full p-3 border rounded-xl" value={formData.total_efectivos_dia} onChange={e => setFormData({...formData, total_efectivos_dia: parseInt(e.target.value)})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Total Efectivos</label>
                  <input type="number" className="w-full p-3 border rounded-xl" value={formData.total_efectivos} onChange={e => setFormData({...formData, total_efectivos: parseInt(e.target.value)})} />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Localização</label>
                  <input type="text" className="w-full p-3 border rounded-xl" value={formData.localizacao} onChange={e => setFormData({...formData, localizacao: e.target.value})} />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Descrição</label>
                  <textarea rows={2} className="w-full p-3 border rounded-xl" value={formData.descricao} onChange={e => setFormData({...formData, descricao: e.target.value})}></textarea>
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Contacto</label>
                   <input type="text" className="w-full p-3 border rounded-xl" value={formData.contacto} onChange={e => setFormData({...formData, contacto: e.target.value})} />
                </div>
              </div>

              <div className="flex gap-4 pt-4 sticky bottom-0 bg-white">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-all border border-slate-200"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-emerald-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <ShieldCheck size={18} /> Registar Local
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocalTrabalhoList;
