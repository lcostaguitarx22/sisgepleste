import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, BarChart3, ShieldCheck, LogOut, Shield } from 'lucide-react';

const Sidebar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/stats', icon: BarChart3, label: 'Estatística' },
    { path: '/productivity', icon: ShieldCheck, label: 'Produtividade' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="glass-panel" style={{ 
      width: '260px', 
      height: '100vh', 
      borderRadius: '0 24px 24px 0', 
      padding: '2rem 1.5rem',
      display: 'flex',
      flexDirection: 'column',
      borderLeft: 'none'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '3rem' }}>
        <Shield size={32} color="var(--primary-color)" />
        <h2 className="gradient-text" style={{ fontSize: '1.2rem' }}>SISGEP LESTE</h2>
      </div>

      <nav style={{ flex: 1 }}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '12px',
              textDecoration: 'none',
              color: isActive ? 'white' : 'var(--text-muted)',
              background: isActive ? 'var(--glass-bg)' : 'transparent',
              border: isActive ? '1px solid var(--surface-border)' : '1px solid transparent',
              marginBottom: '0.5rem',
              transition: 'all 0.2s'
            })}
          >
            <item.icon size={20} />
            <span style={{ fontWeight: '500' }}>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div style={{ marginTop: 'auto' }}>
        <div className="glass-card" style={{ padding: '12px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            borderRadius: '50%', 
            background: 'var(--primary-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.8rem',
            fontWeight: 'bold'
          }}>
            {user?.nome?.[0].toUpperCase()}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontSize: '0.9rem', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.nome}</p>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>RG: {user?.rg} • {user?.nivel_acesso}</p>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          style={{ 
            width: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            padding: '12px', 
            color: 'var(--danger)', 
            background: 'transparent', 
            border: 'none', 
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          <LogOut size={20} />
          Sair
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
