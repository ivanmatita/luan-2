
import React from 'react';
import { ArrowRight, Laptop, Calculator, Package, Users, BadgeDollarSign, ShieldCheck } from 'lucide-react';
import LoginForm from './LoginForm';

interface LandingPageProps {
  onNavigate: (view: 'landing' | 'login' | 'register') => void;
  onLoginSuccess: (user: any, company: any) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onLoginSuccess }) => {
  return (
    <div className="animate-in fade-in duration-700">
      {/* Hero Section - Imagem de Fundo Profissional Restaurada */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Background Image - Modern Office Corridor */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop" 
            alt="Fundo Profissional" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Deep Blue Gradient Overlay matching the reference image */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#001D4D] via-[#001D4D]/80 to-transparent z-10"></div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full relative z-20 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Text Side */}
            <div className="text-white">
              <span className="inline-block px-4 py-1.5 bg-blue-600/30 border border-blue-400/50 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
                Software Certificado AGT
              </span>
              <h1 className="text-5xl lg:text-7xl font-black mb-6 leading-tight tracking-tight">
                Bem-vindo ao<br />
                <span className="text-[#00F7A5]">IMATEC SOFTWARE</span>
              </h1>
              <p className="text-lg lg:text-xl text-slate-100 mb-10 max-w-xl leading-relaxed opacity-90">
                A solução completa para gestão empresarial em Angola. Faturação, Contabilidade, Stocks e Recursos Humanos numa plataforma moderna, segura e intuitiva.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-12">
                <button onClick={() => onNavigate('register')} className="bg-[#00D18C] text-white px-8 py-4 rounded-lg font-bold flex items-center gap-2 hover:bg-[#00b378] transition-all shadow-xl shadow-green-900/20 active:scale-95">
                  <BadgeDollarSign size={20} /> Registar Empresa
                </button>
                <button onClick={() => onNavigate('login')} className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-lg font-bold flex items-center gap-2 hover:bg-white/20 transition-all active:scale-95">
                   Aceder ao Sistema
                </button>
              </div>

              {/* Status/Stats */}
              <div className="grid grid-cols-3 gap-8 border-t border-white/10 pt-8 max-w-lg">
                <div>
                  <p className="text-3xl font-black text-[#00F7A5]">5k+</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Empresas</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-[#00F7A5]">99%</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Satisfação</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-[#00F7A5]">24/7</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Suporte</p>
                </div>
              </div>
            </div>

            {/* Form Side - Floating Login */}
            <div className="flex justify-center lg:justify-end">
               <LoginForm onLoginSuccess={onLoginSuccess} isEmbedded={true} />
            </div>
          </div>
        </div>
      </section>

      {/* Info Sections */}
      <section className="py-24 bg-white relative z-30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-black text-[#001D4D] sm:text-4xl mb-4">Vantagens do Software</h2>
            <div className="w-20 h-1.5 bg-[#00D18C] mx-auto rounded-full"></div>
            <p className="mt-6 text-slate-600 max-w-2xl mx-auto">Tecnologia Angolana de alta performance para impulsionar o seu negócio com segurança e conformidade AGT.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              { icon: <Calculator />, title: "Faturação", desc: "Emissão de faturas certificadas pela AGT em segundos." },
              { icon: <Laptop />, title: "Contabilidade", desc: "Gestão contabilística integrada e relatórios financeiros reais." },
              { icon: <Package />, title: "Stock", desc: "Controle de inventário inteligente com alertas de reposição." },
              { icon: <Users />, title: "Recursos Humanos", desc: "Processamento de salários e gestão de assiduidade." },
              { icon: <BadgeDollarSign />, title: "Gestão Financeira", desc: "Fluxo de caixa, tesouraria e conciliação bancária." },
              { icon: <ShieldCheck />, title: "Segurança Real", desc: "Dados criptografados e isolamento total por empresa via RLS." },
            ].map((item, idx) => (
              <div key={idx} className="group p-8 rounded-3xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 mb-6 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-[#001D4D] mb-3">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#001D4D] text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-white/10 pb-16 mb-10">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold">IM</span>
              </div>
              <span className="text-xl font-black tracking-tight">IMATEC</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Líder em tecnologia empresarial em Angola, fornecendo softwares certificados e escaláveis para diversos setores.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 uppercase text-[10px] tracking-widest text-[#00F7A5]">Software</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><button className="hover:text-white transition-colors">Faturação AGT</button></li>
              <li><button className="hover:text-white transition-colors">Gestão de Stock</button></li>
              <li><button className="hover:text-white transition-colors">Contabilidade</button></li>
              <li><button className="hover:text-white transition-colors">Recursos Humanos</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 uppercase text-[10px] tracking-widest text-[#00F7A5]">Institucional</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><button className="hover:text-white transition-colors">Sobre Nós</button></li>
              <li><button className="hover:text-white transition-colors">Planos & Preços</button></li>
              <li><button className="hover:text-white transition-colors">Consultoria</button></li>
              <li><button className="hover:text-white transition-colors">Políticas</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 uppercase text-[10px] tracking-widest text-[#00F7A5]">Contacto</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li>Email: imatec38@gmail.com</li>
              <li>Telefone: +244 900 000 000</li>
              <li>Local: Luanda, Angola</li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center text-slate-500 text-[10px] font-bold uppercase tracking-widest">
          <p>&copy; 2024 IMATEC SOFTWARE - Tecnologia Angolana Certificada.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
