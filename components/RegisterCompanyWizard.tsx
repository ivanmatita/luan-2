
import React, { useState, useMemo } from 'react';
import { Check, ArrowRight, ArrowLeft, Building2, CreditCard, Send, ShieldCheck, AlertCircle } from 'lucide-react';
import { CompanyType, PlanTier, BillingPeriod } from '../types';
import { PLAN_PRICES, DISCOUNTS } from '../constants';
import { supabase } from '../lib/supabaseClient';

interface RegisterCompanyWizardProps {
  onComplete: () => void;
  onBack: () => void;
}

const RegisterCompanyWizard: React.FC<RegisterCompanyWizardProps> = ({ onComplete, onBack }) => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    nome: '',
    nif: '',
    administrador: '',
    localizacao: '',
    morada: '',
    contacto: '',
    email: '',
    password: '',
    tipo: CompanyType.COMERCIO_SERVICOS,
    plano: PlanTier.BASIC,
    periodo: BillingPeriod.MONTHLY,
    captcha: false
  });

  const totals = useMemo(() => {
    const basePrice = PLAN_PRICES[formData.plano];
    let multiplier = 1;
    let discount = 0;

    if (formData.periodo === BillingPeriod.QUARTERLY) {
      multiplier = 3;
      discount = DISCOUNTS.QUARTERLY;
    } else if (formData.periodo === BillingPeriod.ANNUAL) {
      multiplier = 12;
      discount = DISCOUNTS.ANNUAL;
    }

    const subtotal = basePrice * multiplier;
    const finalTotal = subtotal * (1 - discount);
    
    const now = new Date();
    const validityDate = new Date(now.setMonth(now.getMonth() + multiplier));
    const validity = validityDate.toLocaleDateString('pt-PT');

    return {
      monthlyValue: finalTotal / multiplier,
      totalValue: finalTotal,
      validity,
      validityISO: validityDate.toISOString().split('T')[0]
    };
  }, [formData.plano, formData.periodo]);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleFinalize = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setError('');

    try {
      // 1. Criar empresa no Supabase
      // CORREÇÃO: Removida a coluna 'nif' que não existe no cache do seu schema.
      // Apenas 'nif_empresa' é utilizada conforme sua indicação.
      const { data: company, error: compError } = await supabase
        .from('empresas')
        .insert([{
          nome_empresa: formData.nome,
          nif_empresa: formData.nif, // Coluna correta no banco
          administrador: formData.administrador,
          email: formData.email,
          tipo_empresa: formData.tipo,
          validade: totals.validityISO,
          contacto: formData.contacto,
          morada: formData.morada,
          localizacao: formData.localizacao
        }])
        .select()
        .single();

      if (compError) {
        console.error('Erro de schema:', compError);
        throw new Error(`Erro de schema: ${compError.message || 'Verifique as colunas do banco.'}`);
      }

      // 2. Criar utilizador Auth
      const { data: authUser, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            empresa_id: company.id,
            nome: formData.administrador,
            perfil: 'admin'
          }
        }
      });

      if (authError) throw authError;

      // 3. Inserir perfil na tabela utilizadores
      if (authUser.user) {
        const { error: profError } = await supabase
          .from('utilizadores')
          .insert([{
            id: authUser.user.id,
            empresa_id: company.id,
            email: formData.email,
            nome: formData.administrador,
            perfil: 'admin',
            utilizador: formData.email,
            password: formData.password
          }]);
        
        if (profError) throw profError;
      }

      // 4. Registrar licença inicial
      await supabase.from('licencas').insert([{
          empresa_id: company.id,
          pacote: formData.plano,
          periodicidade: formData.periodo,
          valor: totals.totalValue
      }]);

      alert("Registo Finalizado! Empresa criada com sucesso. Verifique o seu email.");
      onComplete();
    } catch (err: any) {
      console.error('Falha no processo final:', err);
      setError(err.message || 'Erro crítico ao conectar ao banco sistemanovo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-24 px-4 pt-32">
      {/* Stepper Header */}
      <div className="mb-12 flex justify-between items-center relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-10 -translate-y-1/2"></div>
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all shadow-sm ${
              step >= s ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
            }`}
          >
            {step > s ? <Check size={20} /> : s}
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-center gap-2 font-bold text-sm">
          <AlertCircle size={20} /> {error}
        </div>
      )}

      {step === 1 && (
        <div className="space-y-6 animate-in slide-in-from-right duration-500">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-100 rounded-lg text-blue-600"><Building2 /></div>
            <h2 className="text-2xl font-bold text-[#001D4D]">Registo de Nova Empresa</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-slate-500 text-[10px]">Nome Comercial</label>
              <input type="text" placeholder="Ex: IMATEC Lda" className="w-full p-3 border rounded-lg bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-slate-500 text-[10px]">NIF (Angola)</label>
              <input type="text" placeholder="Número de Identificação Fiscal" className="w-full p-3 border rounded-lg bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500" value={formData.nif} onChange={e => setFormData({...formData, nif: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-slate-500 text-[10px]">Email Principal</label>
              <input type="email" placeholder="gestao@empresa.ao" className="w-full p-3 border rounded-lg bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-slate-500 text-[10px]">Palavra-passe</label>
              <input type="password" placeholder="Defina o acesso admin" className="w-full p-3 border rounded-lg bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-slate-500 text-[10px]">Gestor Responsável</label>
              <input type="text" placeholder="Nome Completo" className="w-full p-3 border rounded-lg bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500" value={formData.administrador} onChange={e => setFormData({...formData, administrador: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-slate-500 text-[10px]">Ramo de Atividade</label>
              <select className="w-full p-3 border rounded-lg bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500" value={formData.tipo} onChange={e => setFormData({...formData, tipo: e.target.value as CompanyType})}>
                {Object.values(CompanyType).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 p-4 bg-slate-100 rounded-lg">
            <input type="checkbox" id="captcha" className="w-5 h-5 rounded border-slate-300" checked={formData.captcha} onChange={e => setFormData({...formData, captcha: e.target.checked})} />
            <label htmlFor="captcha" className="font-medium text-slate-700 text-sm">Confirmo que a empresa é legítima e os dados são válidos para fins fiscais.</label>
          </div>

          <div className="flex justify-between pt-6">
            <button onClick={onBack} className="flex items-center gap-2 text-slate-500 font-bold hover:text-blue-600"><ArrowLeft /> Voltar</button>
            <button onClick={nextStep} disabled={!formData.captcha || !formData.nome || !formData.email || !formData.nif} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50">
              Próximo <ArrowRight size={20} />
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-8 animate-in slide-in-from-right duration-500">
           <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-100 rounded-lg text-blue-600"><CreditCard /></div>
            <h2 className="text-2xl font-bold text-[#001D4D]">Pacote de Gestão</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.values(PlanTier).map(p => (
              <button
                key={p}
                onClick={() => setFormData({...formData, plano: p})}
                className={`p-6 border-2 rounded-2xl text-left transition-all ${
                  formData.plano === p ? 'border-blue-600 bg-blue-50 ring-4 ring-blue-100' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <h3 className="text-lg font-bold text-[#001D4D]">{p}</h3>
                <p className="text-2xl font-black mt-2 text-blue-600">{PLAN_PRICES[p].toLocaleString()} Kz <span className="text-sm font-normal text-slate-500">/mês</span></p>
                <ul className="mt-4 text-[11px] text-slate-600 space-y-2">
                  <li className="flex items-center gap-1"><Check size={14} className="text-green-500" /> Software Certificado AGT</li>
                  <li className="flex items-center gap-1"><Check size={14} className="text-green-500" /> Multi-utilizador</li>
                  {p !== PlanTier.BASIC && <li className="flex items-center gap-1"><Check size={14} className="text-green-500" /> Inventário Avançado</li>}
                </ul>
              </button>
            ))}
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold mb-4 text-[#001D4D]">Ciclo de Pagamento</h3>
            <div className="flex flex-wrap gap-4">
              {Object.values(BillingPeriod).map(period => (
                <button
                  key={period}
                  onClick={() => setFormData({...formData, periodo: period})}
                  className={`px-6 py-3 rounded-xl font-bold border-2 transition-all ${
                    formData.periodo === period ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-slate-200 text-slate-500'
                  }`}
                >
                  {period}
                  {period === BillingPeriod.QUARTERLY && <span className="ml-2 text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded uppercase">-5%</span>}
                  {period === BillingPeriod.ANNUAL && <span className="ml-2 text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded uppercase">-15%</span>}
                </button>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-end gap-4">
              <div className="space-y-1">
                <p className="text-slate-500 text-sm">Subtotal mensal: <span className="font-bold text-slate-900">{totals.monthlyValue.toLocaleString()} Kz</span></p>
                <p className="text-slate-500 text-sm">Válido até: <span className="font-bold text-slate-900">{totals.validity}</span></p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">VALOR TOTAL</p>
                <p className="text-4xl font-black text-blue-600">{totals.totalValue.toLocaleString()} Kz</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-6">
            <button onClick={prevStep} className="flex items-center gap-2 text-slate-500 font-bold hover:text-blue-600"><ArrowLeft /> Anterior</button>
            <button onClick={nextStep} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-700 active:scale-95 transition-all">
              Revisar Registo <ArrowRight size={20} />
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-8 animate-in slide-in-from-right duration-500">
           <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-100 rounded-lg text-blue-600"><ShieldCheck /></div>
            <h2 className="text-2xl font-bold text-[#001D4D]">Finalização do Registo</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h3 className="font-bold text-lg mb-4 text-[#001D4D] border-b pb-2">Dados Corporativos</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between"><dt className="text-slate-500">Empresa:</dt><dd className="font-bold">{formData.nome}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">NIF:</dt><dd className="font-bold">{formData.nif}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">Email:</dt><dd className="font-bold">{formData.email}</dd></div>
              </dl>
            </div>

            <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
              <h3 className="font-bold text-lg mb-4 text-blue-900 border-b border-blue-200 pb-2">Plano Ativo</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between"><dt className="text-blue-700">Pacote:</dt><dd className="font-bold">{formData.plano}</dd></div>
                <div className="flex justify-between"><dt className="text-blue-700">Vencimento:</dt><dd className="font-bold text-green-600">{totals.validity}</dd></div>
                <div className="pt-4 border-t border-blue-200">
                  <div className="flex justify-between items-center">
                    <dt className="text-blue-900 font-black uppercase text-xs">Total a Liquidar:</dt>
                    <dd className="text-2xl font-black text-blue-600">{totals.totalValue.toLocaleString()} Kz</dd>
                  </div>
                </div>
              </dl>
            </div>
          </div>

          <div className="flex justify-between pt-6">
            <button onClick={prevStep} className="flex items-center gap-2 text-slate-500 font-bold hover:text-blue-600"><ArrowLeft /> Corrigir Dados</button>
            <button 
              onClick={handleFinalize} 
              disabled={isLoading}
              className="bg-green-600 text-white px-10 py-4 rounded-lg font-black text-sm uppercase tracking-widest flex items-center gap-2 hover:bg-green-700 shadow-xl active:scale-95 disabled:opacity-50 transition-all"
            >
              {isLoading ? 'A Processar...' : <><Send size={20} /> Finalizar Registo</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterCompanyWizard;
