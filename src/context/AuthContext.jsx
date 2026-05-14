import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('sisgep_user_profile');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (rg, senha) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('rg', rg)
      .eq('senha', senha)
      .single();
    
    setLoading(false);

    if (error || !data) {
      console.error('Erro no login:', error?.message || 'Credenciais inválidas');
      return { success: false, message: 'RG ou Senha incorretos' };
    }

    setUser(data);
    localStorage.setItem('sisgep_user_profile', JSON.stringify(data));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sisgep_user_profile');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      loading,
      isAdmin: user?.nivel_acesso === 'Admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
