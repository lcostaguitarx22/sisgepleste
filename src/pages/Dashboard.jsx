import React from 'react';
import { useData } from '../context/DataContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Shield, Target, AlertTriangle, CheckCircle, Calendar } from 'lucide-react';

const Dashboard = () => {
  const { statsData, prodData, MONTHS, YEARS, selectedYear, setSelectedYear, STATS_ITEMS, PROD_ITEMS, calculateTotal } = useData();

  // Prepare data for Crime Trends Chart based on selected year
  const currentYearStats = statsData[selectedYear] || {};
  const currentYearProd = prodData[selectedYear] || {};

  const crimeTrendsData = MONTHS.map((month, idx) => {
    const data = { name: month };
    STATS_ITEMS.forEach(item => {
      data[item] = currentYearStats[item] ? currentYearStats[item][idx] : 0;
    });
    return data;
  });

  // Calculate totals for KPIs
  const totalCrimes = STATS_ITEMS.reduce((acc, item) => acc + calculateTotal(currentYearStats[item]), 0);
  const totalProductivity = PROD_ITEMS.reduce((acc, item) => acc + calculateTotal(currentYearProd[item]), 0);
  
  const weaponsAprehended = calculateTotal(currentYearProd["ARMAS DE FOGO APREENDIDAS"]);
  const vehiclesRecovered = calculateTotal(currentYearProd["VEÍCULOS RECUPERADOS"]);

  const KPICard = ({ title, value, icon: Icon, color }) => (
    <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1, minWidth: '250px' }}>
      <div style={{ padding: '12px', background: `${color}20`, borderRadius: '12px', color: color }}>
        <Icon size={28} />
      </div>
      <div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>{title}</p>
        <h3 style={{ fontSize: '1.8rem' }}>{value}</h3>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in">
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

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <KPICard title="Total de Crimes Registrados" value={totalCrimes} icon={AlertTriangle} color="#ef4444" />
        <KPICard title="Total de Produtividade" value={totalProductivity} icon={CheckCircle} color="#10b981" />
        <KPICard title="Armas Apreendidas" value={weaponsAprehended} icon={Shield} color="#3b82f6" />
        <KPICard title="Veículos Recuperados" value={vehiclesRecovered} icon={Target} color="#8b5cf6" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '2rem' }}>
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
