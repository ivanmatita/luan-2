
import React from 'react';

interface NavbarProps {
  onNavigate: (view: 'landing' | 'login' | 'register') => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('landing')}>
            <div className="w-10 h-10 bg-[#001D4D] rounded flex items-center justify-center">
               <span className="text-white font-bold text-xl">IM</span>
            </div>
            <div className="flex flex-col">
                <span className="text-lg font-black text-[#001D4D] leading-none">IMATEC</span>
                <span className="text-xs font-bold text-blue-500 tracking-widest">SOFTWARE</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-6 text-[13px] font-bold text-slate-700 uppercase">
            <button onClick={() => onNavigate('landing')} className="hover:text-blue-600 transition-colors">Início</button>
            <button className="hover:text-blue-600 transition-colors">Sobre Nós</button>
            <button onClick={() => onNavigate('register')} className="hover:text-blue-600 transition-colors">Registar Empresa</button>
            <button className="hover:text-blue-600 transition-colors">Contacto</button>
            <button className="hover:text-blue-600 transition-colors">Consultoria</button>
            <button onClick={() => onNavigate('login')} className="hover:text-blue-600 transition-colors">Login</button>
            <div className="bg-[#001D4D] text-white px-2 py-0.5 rounded text-[10px]">ESP</div>
          </div>

          <div className="flex items-center">
            <button
              onClick={() => onNavigate('register')}
              className="px-6 py-2.5 rounded-full bg-[#00D18C] text-white text-sm font-bold hover:bg-[#00b378] transition-all shadow-md active:scale-95"
            >
              Experimentar Grátis
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
