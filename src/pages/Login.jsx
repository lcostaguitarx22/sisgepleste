import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, User } from 'lucide-react';

const Login = () => {
  const [rg, setRg] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(rg, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="flex-center" style={{ height: '100vh', background: 'var(--bg-color)' }}>
      <div className="glass-panel animate-fade-in" style={{ padding: '3rem', width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Shield size={48} color="var(--primary-color)" style={{ marginBottom: '1rem' }} />
          <h1 className="gradient-text" style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>SISGEP LESTE</h1>
          <p style={{ color: 'var(--text-muted)' }}>Acesse o sistema de gestão</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>RG</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                className="glass-card"
                style={{ width: '100%', padding: '12px 12px 12px 40px', color: 'white', outline: 'none' }}
                value={rg}
                onChange={(e) => setRg(e.target.value)}
                placeholder="Seu RG"
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Senha</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="password" 
                className="glass-card"
                style={{ width: '100%', padding: '12px 12px 12px 40px', color: 'white', outline: 'none' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && <p style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}

          <button 
            type="submit" 
            style={{ 
              width: '100%', 
              padding: '12px', 
              borderRadius: '8px', 
              border: 'none', 
              background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))',
              color: 'white',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 15px var(--primary-glow)'
            }}
          >
            Entrar no Sistema
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
