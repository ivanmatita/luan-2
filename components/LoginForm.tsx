
import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface LoginFormProps {
  onLoginSuccess: (user: any, company: any) => void;
  isEmbedded?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, isEmbedded }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // Buscar perfil estendido e dados da empresa
      const { data: userData, error: userError } = await supabase
        .from('utilizadores')
        .select('*, empresas(*)')
        .eq('id', authData.user.id)
        .single();

      if (userError) throw userError;

      onLoginSuccess(userData, userData.empresas);
    } catch (err: any) {
      setError(err.message || 'Falha na autenticação. Verifique os dados.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`w-full max-w-md bg-white rounded-3xl p-10 shadow-2xl shadow-blue-900/40 relative overflow-hidden transition-all duration-300`}>
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-emerald-400 to-emerald-500"></div>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-black text-[#001D4D]">Aceder à Conta</h2>
        <p className="text-slate-400 text-sm mt-2 font-medium">Insira as suas credenciais para continuar.</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-center gap-2 text-xs font-bold animate-pulse">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <div>
          <label className="block text-[11px] font-black text-[#001D4D] uppercase tracking-widest mb-2 ml-1">Email</label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-slate-700 text-sm"
              placeholder="exemplo@imatec.ao"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2 ml-1">
             <label className="text-[11px] font-black text-[#001D4D] uppercase tracking-widest">Palavra-passe</label>
          </div>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-12 pr-12 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-slate-700 text-sm"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-blue-600 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider">
          <label className="flex items-center gap-2 cursor-pointer text-slate-500">
            <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
            Lembrar-me
          </label>
          <button type="button" className="text-blue-600 hover:text-blue-700">Esqueceu a senha?</button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 rounded-2xl text-white font-black text-sm uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-3 ${
            isLoading ? 'bg-slate-300' : 'bg-[#001D4D] hover:bg-[#00112b] hover:shadow-blue-900/30 active:scale-95'
          }`}
        >
          {isLoading ? 'Autenticando...' : (
            <>Entrar no Sistema <ArrowRight size={18} /></>
          )}
        </button>
      </form>

      <div className="mt-8 pt-8 border-t border-slate-100 text-center">
        <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mb-2">Ainda não tem conta?</p>
        <button className="text-[#00D18C] text-sm font-black hover:underline">Criar agora</button>
      </div>
    </div>
  );
};

export default LoginForm;
