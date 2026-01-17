
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { ItemVenda, LocalTrabalho } from '../../types';
import { 
  ArrowLeft, Save, Plus, Trash2, Calculator, 
  Calendar, CreditCard, Building, User, Info, 
  CheckCircle, FileText, Settings, Package, Search
} from 'lucide-react';

interface VendasFormProps {
  companyId: string;
  onBack: () => void;
}

const VendasForm: React.FC<VendasFormProps> = ({ companyId, onBack }) => {
  const [locais, setLocais] = useState<LocalTrabalho[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    tipo_documento: 'Fatura/Recibo',
    serie: 'Série Geral (A)',
    local_trabalho_id: '',
    data_emissao: new Date().toISOString().split('T')[0],
    data_contabilistica: new Date().toISOString().split('T')[0],
    data_vencimento: new Date().toISOString().split('T')[0],
    forma_pagamento: 'Numerário',
    caixa_recebimento: 'Caixa Geral 01',
    cliente_id: '',
    observacoes: ''
  });

  const [items, setItems] = useState<Partial<ItemVenda>[]>([
    { id: '1', descricao: '', quantidade: 1, preco_unitario: 0, desconto_percentual: 0, total: 0 }
  ]);

  useEffect(() => {
    fetchLocais();
  }, [companyId]);

  const fetchLocais = async () => {
    const { data } = await supabase.from('local_trabalho').select('*').eq('empresa_id', companyId);
    setLocais(data || []);
  };

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), descricao: '', quantidade: 1, preco_unitario: 0, desconto_percentual: 0, total: 0 }]);
  };

  const removeItem = (id: string) => {
    if (items.length === 1) return;
    setItems(items.filter(i => i.id !== id));
  };

  const updateItem = (id: string, field: keyof ItemVenda, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const newItem = { ...item, [field]: value };
        const qtd = newItem.quantidade || 0;
        const price = newItem.preco_unitario || 0;
        const desc = newItem.desconto_percentual || 0;
        newItem.total = (qtd * price) * (1 - desc / 100);
        return newItem;
      }
      return item;
    }));
  };

  const totals = items.reduce((acc, item) => {
    const sub = acc.subtotal + (item.total || 0);
    return {
      subtotal: sub,
      iva: sub * 0.14,
      total: sub * 1.14
    };
  }, { subtotal: 0, iva: 0, total: 0 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data: venda, error: vError } = await supabase
        .from('vendas')
        .insert([{
          empresa_id: companyId,
          local_trabalho_id: formData.local_trabalho_id || null,
          data_venda: formData.data_emissao,
          total: totals.total,
          // Outros campos seriam salvos em tabelas relacionadas no backend real
        }]);

      if (vError) throw vError;

      alert('Documento emitido e certificado com sucesso!');
      onBack();
    } catch (err: any) {
      alert('Erro ao emitir: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 font-bold hover:text-blue-600 transition-all">
          <ArrowLeft size={20} /> Voltar
        </button>
        <div className="flex items-center gap-3">
           <FileText className="text-blue-600" />
           <h2 className="text-xl font-black text-[#001D4D]">Nova Fatura/Recibo</h2>
        </div>
        <div className="flex items-center gap-2">
           <div className="p-2 bg-white border rounded-lg shadow-sm">
              <Settings size={20} className="text-slate-400" />
           </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-[10px] font-black uppercase tracking-widest text-blue-600 border-b border-blue-50 pb-2">
              <Calendar size={14} /> Dados e Datas do Documento
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Tipo</label>
                <select className="w-full p-3 border rounded-xl bg-slate-50 font-bold text-xs">
                  <option>Fatura/Recibo</option>
                  <option>Fatura Proforma</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Série</label>
                <select className="w-full p-3 border rounded-xl bg-slate-50 font-bold text-xs">
                  <option>Série Geral (A)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Local de Trabalho / Obra</label>
                <select className="w-full p-3 border rounded-xl bg-slate-50 font-bold text-xs" value={formData.local_trabalho_id} onChange={e => setFormData({...formData, local_trabalho_id: e.target.value})}>
                  <option value="">Sede Principal</option>
                  {locais.map(l => <option key={l.id} value={l.id}>{l.titulo}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Data Emissão</label>
                <input type="date" className="w-full p-3 border rounded-xl bg-slate-50 font-bold text-xs" value={formData.data_emissao} onChange={e => setFormData({...formData, data_emissao: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Forma Pagamento</label>
                <select className="w-full p-3 border rounded-xl bg-emerald-50 border-emerald-100 font-bold text-xs" value={formData.forma_pagamento} onChange={e => setFormData({...formData, forma_pagamento: e.target.value})}>
                  <option>Numerário</option>
                  <option>Multicaixa</option>
                  <option>Transferência</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Caixa de Recebimento</label>
                <select className="w-full p-3 border rounded-xl bg-emerald-50 border-emerald-100 font-bold text-xs" value={formData.caixa_recebimento} onChange={e => setFormData({...formData, caixa_recebimento: e.target.value})}>
                  <option>Caixa Geral 01</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-[10px] font-black uppercase tracking-widest text-blue-600 border-b border-blue-50 pb-2">
              <User size={14} /> Seleção de Cliente
            </div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <select className="w-full p-4 pl-12 border rounded-2xl bg-slate-50 font-black text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all">
                <option>Consumidor Final (NIF: 999999999)</option>
                <option>IMATEC LDA (NIF: 123456789)</option>
              </select>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex justify-between items-center mb-6 border-b border-slate-50 pb-2">
               <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600">
                  <Package size={14} /> Itens do Documento
               </div>
               <button type="button" onClick={addItem} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1 hover:bg-blue-700 transition-all shadow-md active:scale-95">
                  <Plus size={14} /> Adicionar Linha
               </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-[9px] font-black uppercase tracking-widest text-slate-500">
                    <th className="px-4 py-2">Artigo / Descrição</th>
                    <th className="px-4 py-2 w-20 text-center">QTD</th>
                    <th className="px-4 py-2 w-32 text-right">Preço UN.</th>
                    <th className="px-4 py-2 w-20 text-center">DESC%</th>
                    <th className="px-4 py-2 w-32 text-right">Total</th>
                    <th className="px-4 py-2 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((item) => (
                    <tr key={item.id} className="group">
                      <td className="px-4 py-3">
                        <input 
                          type="text" 
                          placeholder="Digite o nome do serviço ou produto..."
                          className="w-full p-2 border rounded-lg text-xs font-bold bg-blue-50/20 outline-none focus:border-blue-400"
                          value={item.descricao}
                          onChange={e => updateItem(item.id!, 'descricao', e.target.value)}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input 
                          type="number" 
                          className="w-full p-2 border rounded-lg text-center text-xs font-bold"
                          value={item.quantidade}
                          onChange={e => updateItem(item.id!, 'quantidade', parseFloat(e.target.value))}
                        />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <input 
                          type="number" 
                          className="w-full p-2 border rounded-lg text-right text-xs font-bold"
                          value={item.preco_unitario}
                          onChange={e => updateItem(item.id!, 'preco_unitario', parseFloat(e.target.value))}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input 
                          type="number" 
                          className="w-full p-2 border rounded-lg text-center text-xs font-bold"
                          value={item.desconto_percentual}
                          onChange={e => updateItem(item.id!, 'desconto_percentual', parseFloat(e.target.value))}
                        />
                      </td>
                      <td className="px-4 py-3 text-right text-xs font-black text-slate-900">
                        {(item.total || 0).toLocaleString()} Kz
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button type="button" onClick={() => removeItem(item.id!)} className="text-red-400 hover:text-red-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50/50 rounded-2xl flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Calculator size={14} className="text-blue-600" />
                    <span className="text-[10px] font-black text-blue-600 uppercase">Resumo IVA (14%)</span>
                  </div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Métrica: 1x1 | Área: 1.00 m2
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#001D4D] text-white rounded-3xl p-8 shadow-2xl shadow-blue-900/40 sticky top-28">
            <div className="flex items-center gap-2 mb-8 border-b border-white/10 pb-4">
              <Calculator size={20} className="text-[#00D18C]" />
              <h3 className="text-sm font-black uppercase tracking-widest">Resumo do Documento</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs opacity-60 font-bold uppercase">
                <span>Subtotal</span>
                <span>{totals.subtotal.toLocaleString()} Kz</span>
              </div>
              <div className="flex justify-between items-center text-xs opacity-60 font-bold uppercase">
                <span>IVA (14%)</span>
                <span>{totals.iva.toLocaleString()} Kz</span>
              </div>
              <div className="pt-6 border-t border-white/10 mt-6">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#00D18C]">VALOR TOTAL</span>
                  <span className="text-3xl font-black text-white">{totals.total.toLocaleString()} Kz</span>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading || totals.total <= 0}
              className="w-full mt-10 bg-[#00D18C] hover:bg-[#00b378] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-green-900/40 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              <CheckCircle size={18} /> {isLoading ? 'Certificando...' : 'Emitir Documento'}
            </button>
            <p className="mt-4 text-[9px] text-center opacity-40 font-bold uppercase tracking-widest">Documento Certificado por Software n.º 000/AGT/2024</p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default VendasForm;
