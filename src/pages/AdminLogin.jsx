import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, User, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import logoLady from '../assets/logo-lady.png';

const AdminLogin = () => {
  const { login, token } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (token) return <Navigate to="/admin" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await login(formData.username, formData.password);
    if (result.success) {
      navigate('/admin');
    } else {
      setError(result.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sensual-red/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-sensual-red/5 blur-[120px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-sensual-red/30 mx-auto mb-6 bg-black p-1 shadow-[0_0_30px_rgba(196,30,58,0.2)]">
            <img src={logoLady} alt="FI" className="w-full h-full object-cover scale-150" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white tracking-widest uppercase">
            Sanctuary <span className="text-sensual-red">Access</span>
          </h1>
          <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] mt-2 font-bold">Administrative Terminal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-sensual-red transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Identification"
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-sensual-red/50 focus:bg-white/10 transition-all placeholder:text-white/20 tracking-widest text-[12px] font-medium"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-sensual-red transition-colors" size={18} />
            <input 
              type="password"
              placeholder="Access Key"
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-sensual-red/50 focus:bg-white/10 transition-all placeholder:text-white/20 tracking-widest text-[12px] font-medium"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-sensual-red/10 border border-sensual-red/20 text-sensual-red text-[10px] p-4 rounded-xl text-center font-bold uppercase tracking-widest"
            >
              {error}
            </motion.div>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-2xl bg-sensual-red text-white font-bold uppercase tracking-widest red-shadow hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-3 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Authorize Access</span>
                <ShieldCheck size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-12 text-center">
          <button 
            onClick={() => navigate('/')}
            className="text-white/20 hover:text-white transition-colors text-[10px] uppercase tracking-[0.3em] font-bold flex items-center justify-center mx-auto space-x-2"
          >
            <ArrowRight size={12} className="rotate-180" />
            <span>Return to Sanctuary</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
