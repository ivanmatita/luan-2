
import React, { useState } from 'react';
import { AuthState } from '../types';
import { 
  LogOut, LayoutDashboard, Package, Users, Receipt, 
  Settings, Bell, ShieldCheck, Briefcase, 
  Calculator, FileBarChart, ChevronDown, ChevronRight,
  ShoppingCart, MapPin, ListOrdered, FileText, Undo2
} from 'lucide-react';
import Profissoes from './hr/Profissoes';
import Funcionarios from './hr/Funcionarios';
import VendasForm from './sales/VendasForm';
import LocalTrabalhoList from './work-location/LocalTrabalhoList';

interface DashboardProps {
  auth: AuthState;
  onLogout: () => void;
}

type DashboardView = 'overview' | 'profissoes' | 'funcionarios' | 'vendas' | 'locais_trabalho' | 'relatorios_vendas' | 'regularizacao_vendas' | 'processamento' | 'relatorios';

const Dashboard: React.FC<DashboardProps> = ({ auth, onLogout }) => {
  const [currentView, setCurrentView] = useState<DashboardView>('overview');
  const [isHRMenuOpen, setIsHRMenuOpen] = useState(true);
  const [isVendasMenuOpen, setIsVendasMenuOpen] = useState(true);

  const renderContent = () => {
    switch (currentView) {
      case 'profissoes':
        return <Profissoes companyId={auth.company?.id || ''} />;
      case 'funcionarios':
        return <Funcionarios companyId={auth.company?.id || ''} />;
      case 'locais_trabalho':
        return <LocalTrabalhoList companyId={auth.company?.id || ''} />;
      case 'vendas':
        return <VendasForm companyId={auth.company?.id || ''} onBack={() => setCurrentView('overview')} />;
      case 'overview':
      default:
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <p className="text-slate-500 text-[10px] font-bold uppercase mb-2 tracking-widest">Plano Ativo</p>
                <p className="text-2xl font-black text-slate-900">{auth.company?.plano}</p>
                <p className="text-xs text-green-600 font-bold mt-2">Válido até {auth.company?.validade}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <p className="text-slate-500 text-[10px] font-bold uppercase mb-2 tracking-widest">Perfil de Acesso</p>
                <p className="text-2xl font-black text-blue-600 uppercase">{auth.user?.perfil}</p>
                <p className="text-xs text-slate-400 font-bold mt-2 tracking-tight">Autorização Multi-empresa</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <p className="text-slate-500 text-[10px] font-bold uppercase mb-2 tracking-widest">Sessão Segura</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                  <p className="text-sm font-bold text-slate-600">RLS ATIVO (ID: {auth.user?.empresa_id})</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-600 text-white p-8 rounded-2xl shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-2">Proteção AGT Garantida</h3>
                    <p className="max-w-md opacity-90 text-sm">Este sistema está configurado para cumprir todas as normas fiscais vigentes em Angola. Todas as suas transações são isoladas por empresa via Row Level Security.</p>
                </div>
                <div className="absolute right-0 bottom-0 opacity-10 translate-y-1/4">
                    <ShieldCheck size={200} />
                </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-72 bg-[#001D4D] text-white flex flex-col p-6 hidden lg:flex sticky top-0 h-screen">
        <div className="mb-10 px-2">
          <h2 className="text-xl font-black flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
              <span className="text-white text-xs">IM</span>
            </div>
            IMATEC
          </h2>
          <p className="text-[10px] text-blue-400 mt-1 uppercase tracking-[0.2em] font-black">Software de Gestão</p>
        </div>

        <nav className="flex-grow space-y-1 overflow-y-auto pr-2 custom-scrollbar">
          <button 
            onClick={() => setCurrentView('overview')}
            className={`w-full text-left p-3 rounded-xl flex items-center gap-3 font-bold text-sm transition-all ${currentView === 'overview' ? 'bg-blue-600 shadow-lg' : 'hover:bg-white/5 text-slate-400'}`}
          >
            <LayoutDashboard size={20} /> Dashboard
          </button>

          {/* Módulo Vendas */}
          <div className="pt-4">
            <button 
              onClick={() => setIsVendasMenuOpen(!isVendasMenuOpen)}
              className="w-full text-left p-3 hover:bg-white/5 rounded-xl flex items-center justify-between font-bold text-sm text-slate-300 transition-all"
            >
              <div className="flex items-center gap-3">
                <ShoppingCart size={20} className="text-[#00D18C]" /> Vendas
              </div>
              {isVendasMenuOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>

            {isVendasMenuOpen && (
              <div className="ml-6 mt-1 space-y-1 border-l border-white/10 pl-4 animate-in slide-in-from-top-2 duration-300">
                <button 
                  onClick={() => setCurrentView('locais_trabalho')}
                  className={`w-full text-left p-2.5 rounded-lg font-bold text-[13px] transition-all flex items-center gap-2 ${currentView === 'locais_trabalho' ? 'text-green-400 bg-green-400/10' : 'text-slate-400 hover:text-white'}`}
                >
                  <MapPin size={14} /> Local de Trabalho
                </button>
                <button 
                  onClick={() => setCurrentView('vendas')}
                  className={`w-full text-left p-2.5 rounded-lg font-bold text-[13px] transition-all flex items-center gap-2 ${currentView === 'vendas' ? 'text-green-400 bg-green-400/10' : 'text-slate-400 hover:text-white'}`}
                >
                  <ListOrdered size={14} /> Vendas
                </button>
                <button 
                  onClick={() => setCurrentView('relatorios_vendas')}
                  className={`w-full text-left p-2.5 rounded-lg font-bold text-[13px] transition-all flex items-center gap-2 ${currentView === 'relatorios_vendas' ? 'text-green-400 bg-green-400/10' : 'text-slate-400 hover:text-white'}`}
                >
                  <FileText size={14} /> Relatório de Venda
                </button>
                <button 
                  onClick={() => setCurrentView('regularizacao_vendas')}
                  className={`w-full text-left p-2.5 rounded-lg font-bold text-[13px] transition-all flex items-center gap-2 ${currentView === 'regularizacao_vendas' ? 'text-green-400 bg-green-400/10' : 'text-slate-400 hover:text-white'}`}
                >
                  <Undo2 size={14} /> Regularização Vendas
                </button>
              </div>
            )}
          </div>

          <div className="pt-4 pb-2">
            <p className="px-3 text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Gestão Comercial</p>
            <button className="w-full text-left p-3 hover:bg-white/5 rounded-xl flex items-center gap-3 font-bold text-sm text-slate-400 transition-all">
              <Package size={20} /> Produtos & Stock
            </button>
          </div>

          <div className="pt-4">
            <button 
              onClick={() => setIsHRMenuOpen(!isHRMenuOpen)}
              className="w-full text-left p-3 hover:bg-white/5 rounded-xl flex items-center justify-between font-bold text-sm text-slate-300 transition-all"
            >
              <div className="flex items-center gap-3">
                <Users size={20} className="text-blue-400" /> Recursos Humanos
              </div>
              {isHRMenuOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>

            {isHRMenuOpen && (
              <div className="ml-6 mt-1 space-y-1 border-l border-white/10 pl-4 animate-in slide-in-from-top-2 duration-300">
                <button 
                  onClick={() => setCurrentView('profissoes')}
                  className={`w-full text-left p-2.5 rounded-lg font-bold text-[13px] transition-all ${currentView === 'profissoes' ? 'text-blue-400 bg-blue-400/10' : 'text-slate-400 hover:text-white'}`}
                >
                  Profissões / Cargos
                </button>
                <button 
                  onClick={() => setCurrentView('funcionarios')}
                  className={`w-full text-left p-2.5 rounded-lg font-bold text-[13px] transition-all ${currentView === 'funcionarios' ? 'text-blue-400 bg-blue-400/10' : 'text-slate-400 hover:text-white'}`}
                >
                  Funcionários
                </button>
                <button 
                  onClick={() => setCurrentView('processamento')}
                  className={`w-full text-left p-2.5 rounded-lg font-bold text-[13px] transition-all ${currentView === 'processamento' ? 'text-blue-400 bg-blue-400/10' : 'text-slate-400 hover:text-white'}`}
                >
                  Processar Salários
                </button>
                <button 
                  onClick={() => setCurrentView('relatorios')}
                  className={`w-full text-left p-2.5 rounded-lg font-bold text-[13px] transition-all ${currentView === 'relatorios' ? 'text-blue-400 bg-blue-400/10' : 'text-slate-400 hover:text-white'}`}
                >
                  Relatórios RH
                </button>
              </div>
            )}
          </div>
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5">
          <button className="w-full text-left p-3 hover:bg-white/5 rounded-xl flex items-center gap-3 font-bold text-sm text-slate-400 transition-all">
            <Settings size={20} /> Configurações
          </button>
          <button
            onClick={onLogout}
            className="w-full text-left p-3 mt-1 hover:bg-red-500/10 text-red-400 rounded-xl flex items-center gap-3 font-bold text-sm transition-all"
          >
            <LogOut size={20} /> Sair do Sistema
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow flex flex-col min-w-0">
        <header className="h-20 flex justify-between items-center px-8 bg-white border-b border-slate-200 sticky top-0 z-30">
          <div>
            <h1 className="text-lg font-black text-slate-900 uppercase tracking-tight">
              {currentView === 'overview' ? 'Painel Geral' : currentView.replace('_', ' ').toUpperCase()}
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{auth.company?.nome_empresa}</p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 p-2 px-3 bg-slate-50 rounded-full border border-slate-200">
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sincronizado</span>
            </div>
            
            <button className="relative p-2 text-slate-400 hover:text-blue-600 transition-colors">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-900 leading-none">{auth.user?.nome}</p>
                <p className="text-[10px] font-bold text-blue-600 uppercase mt-1">{auth.user?.perfil}</p>
              </div>
              <div className="w-10 h-10 bg-[#001D4D] rounded-xl flex items-center justify-center font-black text-white shadow-lg shadow-blue-900/20">
                {auth.user?.nome.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl w-full mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
