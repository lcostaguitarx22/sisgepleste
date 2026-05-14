import React from 'react';
import { useData } from '../context/DataContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { 
  Shield, Target, AlertTriangle, CheckCircle, Calendar, 
  Skull, HandCoins, Car, Bus, Store, Zap, Package, 
  ShieldAlert, UserMinus, CarFront, FlaskConical, Layers, Lock, Ghost, Search
} from 'lucide-react';

const Dashboard = () => {
  const { statsData, prodData, MONTHS, YEARS, selectedYear, setSelectedYear, STATS_ITEMS, PROD_ITEMS, calculateTotal } = useData();

  const currentYearStats = statsData[selectedYear] || {};
  const currentYearProd = prodData[selectedYear] || {};

  const crimeTrendsData = MONTHS.map((month, idx) => {
    const data = { name: month };
    STATS_ITEMS.forEach(item => {
      data[item] = currentYearStats[item] ? currentYearStats[item][idx] : 0;
    });
    return data;
  });

  const KPICard = ({ title, value, icon: Icon, color }) => (
    <div className="glass-card" style={{ 
      padding: '1.2rem', 
      display: 'flex', 
      alignItems: 'center', 
      gap: '1rem', 
      flex: '1 1 200px',
      border: '1px solid var(--surface-border)',
      transition: 'transform 0.2s'
    }}>
      <div style={{ padding: '10px', background: `${color}20`, borderRadius: '10px', color: color }}>
        <Icon size={24} />
      </div>
      <div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '2px' }}>{title}</p>
        <h3 style={{ fontSize: '1.4rem', fontWeight: '700' }}>{value % 1 === 0 ? value : value.toFixed(2)}</h3>
      </div>
    </div>
  );

  const SectionTitle = ({ title, icon: Icon }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', marginTop: '1rem' }}>
      <Icon size={20} color="var(--primary-color)" />
      <h2 style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{title}</h2>
    </div>
  );

  const statsIcons = {
    "HOMICÍDIO DOLOSO": Skull,
    "LATROCÍNIO": HandCoins,
    "ROUBO DE VEÍCULOS": Car,
    "FURTO DE VEÍCULOS": CarFront,
    "ROUBO EM RESIDÊNCIA": ShieldAlert,
    "ROUBO A TRANSEUNTES": UserMinus,
    "ROUBO A COLETIVO": Bus,
    "ROUBO A PONTO COMERCIAL": Store,
    "MORTE POR INTERVENÇÃO PM": Zap,
    "FURTO": Package,
    "ROUBO": AlertTriangle
  };

  const prodIcons = {
    "ARMAS DE FOGO APREENDIDAS": Shield,
    "VEÍCULOS RECUPERADOS": Target,
    "ENTORPECENTES EM Kg (TRÁFICO)": FlaskConical,
    "MUNIÇÕES": Layers,
    "PRESOS": Lock,
    "SIMULACRO": Ghost,
    "FORAGIDOS": Search
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Dashboard Geral</h1>
          <p style={{ color: 'var(--text-muted)' }}>Visão consolidada do Batalhão Leste ({selectedYear})</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Calendar size={20} color="var(--primary-color)" />
          <div style={{ display: 'flex', gap: '4px', background: 'var(--glass-bg)', padding: '4px', borderRadius: '8px', border: '1px solid var(--surface-border)' }}>
            {YEARS.map(year => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  background: selectedYear === year ? 'var(--primary-color)' : 'transparent',
                  color: selectedYear === year ? 'white' : 'var(--text-muted)',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* PRODUTIVIDADE SECTION */}
      <SectionTitle title="Produtividade Operacional" icon={CheckCircle} />
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
        {PROD_ITEMS.map(item => (
          <KPICard 
            key={item}
            title={item.replace(' (TRÁFICO)', '')} 
            value={calculateTotal(currentYearProd[item])} 
            icon={prodIcons[item] || CheckCircle} 
            color="#10b981" 
          />
        ))}
      </div>

      {/* ÍNDICES SECTION */}
      <SectionTitle title="Índices de Criminalidade" icon={AlertTriangle} />
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
        {STATS_ITEMS.map(item => (
          <KPICard 
            key={item}
            title={item} 
            value={calculateTotal(currentYearStats[item])} 
            icon={statsIcons[item] || AlertTriangle} 
            color="#ef4444" 
          />
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Tendência de Crimes (Anual - {selectedYear})</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={crimeTrendsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} />
                <Tooltip 
                  contentStyle={{ background: 'var(--surface-color)', border: '1px solid var(--surface-border)', borderRadius: '8px' }}
                  itemStyle={{ color: 'white' }}
                />
                <Line type="monotone" dataKey="ROUBO" stroke="var(--primary-color)" strokeWidth={2} dot={{ fill: 'var(--primary-color)' }} />
                <Line type="monotone" dataKey="FURTO" stroke="var(--accent-color)" strokeWidth={2} dot={{ fill: 'var(--accent-color)' }} />
                <Line type="monotone" dataKey="HOMICÍDIO DOLOSO" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Produtividade por Categoria ({selectedYear})</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PROD_ITEMS.map(item => ({ name: item.split(' ')[0], value: calculateTotal(currentYearProd[item]) }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={10} />
                <YAxis stroke="var(--text-muted)" fontSize={12} />
                <Tooltip 
                  contentStyle={{ background: 'var(--surface-color)', border: '1px solid var(--surface-border)', borderRadius: '8px' }}
                />
                <Bar dataKey="value" fill="var(--secondary-color)" radius={[4, 4, 0, 0]}>
                  {PROD_ITEMS.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? 'var(--primary-color)' : 'var(--accent-color)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
