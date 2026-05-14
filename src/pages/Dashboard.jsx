import React from 'react';
import { useData } from '../context/DataContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { 
  Shield, Target, AlertTriangle, CheckCircle, Calendar, 
  Skull, HandCoins, Car, Bus, Store, Zap, Package, 
  ShieldAlert, UserMinus, CarFront, FlaskConical, Layers, Lock, Ghost, Search,
  TrendingUp, TrendingDown, Minus, Layers as LayersIcon
} from 'lucide-react';

const Dashboard = () => {
  const { statsData, prodData, MONTHS, YEARS, selectedYear, setSelectedYear, STATS_ITEMS, PROD_ITEMS, calculateTotal } = useData();

  const isAllYears = selectedYear === 'all';

  // Helper to calculate total for a specific year (handles current year period logic)
  const getYearTotal = (type, year, item) => {
    const dataArray = type === 'stats' ? statsData[year][item] : prodData[year][item];
    const today = new Date();
    const currentRealYear = today.getFullYear();
    const currentMonth = today.getMonth();

    if (Number(year) === currentRealYear) {
      let sum = 0;
      if (currentMonth > 0) {
        for (let i = 0; i < currentMonth; i++) sum += (dataArray[i] || 0);
      }
      return sum;
    }
    return calculateTotal(dataArray);
  };

  // Helper for Global Variation (First Year vs Last Year)
  const calculateGlobalVariation = (type, item) => {
    const firstYear = YEARS[0];
    const lastYear = YEARS[YEARS.length - 1];
    
    const firstTotal = getYearTotal(type, firstYear, item);
    const lastTotal = getYearTotal(type, lastYear, item);

    if (firstTotal === 0) return lastTotal > 0 ? 100 : 0;
    return ((lastTotal - firstTotal) / firstTotal) * 100;
  };

  // Data preparation
  let currentDisplayStats = {};
  let currentDisplayProd = {};
  let chartData = [];

  if (isAllYears) {
    STATS_ITEMS.forEach(item => {
      let sum = 0;
      YEARS.forEach(y => sum += calculateTotal(statsData[y][item]));
      currentDisplayStats[item] = sum;
    });
    PROD_ITEMS.forEach(item => {
      let sum = 0;
      YEARS.forEach(y => sum += calculateTotal(prodData[y][item]));
      currentDisplayProd[item] = sum;
    });

    chartData = YEARS.map(year => {
      const data = { name: year.toString() };
      STATS_ITEMS.forEach(item => {
        data[item] = calculateTotal(statsData[year][item]);
      });
      return data;
    });
  } else {
    STATS_ITEMS.forEach(item => {
      currentDisplayStats[item] = calculateTotal(statsData[selectedYear][item]);
    });
    PROD_ITEMS.forEach(item => {
      currentDisplayProd[item] = calculateTotal(prodData[selectedYear][item]);
    });
    
    chartData = MONTHS.map((month, idx) => {
      const data = { name: month };
      STATS_ITEMS.forEach(item => {
        data[item] = statsData[selectedYear][item][idx];
      });
      return data;
    });
  }

  const KPICard = ({ title, value, variation, icon: Icon, color, isInverse = false, varLabel = "" }) => {
    const isIncrease = variation > 0;
    const isDecrease = variation < 0;
    
    let varColor = 'var(--text-muted)';
    if (isIncrease) varColor = isInverse ? '#ef4444' : '#10b981';
    if (isDecrease) varColor = isInverse ? '#10b981' : '#ef4444';

    return (
      <div className="glass-card" style={{ 
        padding: '1.2rem', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1rem', 
        border: '1px solid var(--surface-border)',
        minWidth: '240px'
      }}>
        <div style={{ padding: '10px', background: `${color}20`, borderRadius: '10px', color: color }}>
          <Icon size={24} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '2px', textTransform: 'uppercase' }}>{title}</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>{value % 1 === 0 ? value : value.toFixed(2)}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '2px', 
                fontSize: '0.75rem', 
                fontWeight: '700',
                color: varColor,
                background: `${varColor}15`,
                padding: '2px 6px',
                borderRadius: '4px'
              }}>
                {isIncrease && <TrendingUp size={12} />}
                {isDecrease && <TrendingDown size={12} />}
                {!isIncrease && !isDecrease && <Minus size={12} />}
                {Math.abs(variation).toFixed(2)}%
              </div>
              <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '2px' }}>{varLabel}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SectionTitle = ({ title, icon: Icon }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.2rem', marginTop: '1.5rem' }}>
      <Icon size={18} color="var(--primary-color)" />
      <h2 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{title}</h2>
    </div>
  );

  const statsIcons = {
    "HOMICÍDIO DOLOSO": Skull, "LATROCÍNIO": HandCoins, "ROUBO DE VEÍCULOS": Car,
    "FURTO DE VEÍCULOS": CarFront, "ROUBO EM RESIDÊNCIA": ShieldAlert, "ROUBO A TRANSEUNTES": UserMinus,
    "ROUBO A COLETIVO": Bus, "ROUBO A PONTO COMERCIAL": Store, "MORTE POR INTERVENÇÃO PM": Zap,
    "FURTO": Package, "ROUBO": AlertTriangle
  };

  const prodIcons = {
    "ARMAS DE FOGO APREENDIDAS": Shield, "VEÍCULOS RECUPERADOS": Target, "ENTORPECENTES EM Kg (TRÁFICO)": FlaskConical,
    "MUNIÇÕES": Layers, "PRESOS": Lock, "SIMULACRO": Ghost, "FORAGIDOS": Search
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Dashboard Geral</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            {isAllYears ? 'Visão Consolidada Histórica (2021-2026)' : `Visão consolidada do Batalhão Leste (${selectedYear})`}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <LayersIcon size={20} color="var(--primary-color)" />
          <div style={{ display: 'flex', gap: '4px', background: 'var(--glass-bg)', padding: '4px', borderRadius: '8px', border: '1px solid var(--surface-border)' }}>
            <button onClick={() => setSelectedYear('all')} style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', background: selectedYear === 'all' ? 'var(--primary-color)' : 'transparent', color: selectedYear === 'all' ? 'white' : 'var(--text-muted)', fontWeight: '600' }}>TODOS</button>
            {YEARS.map(year => (
              <button key={year} onClick={() => setSelectedYear(year)} style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', background: selectedYear === year ? 'var(--primary-color)' : 'transparent', color: selectedYear === year ? 'white' : 'var(--text-muted)', fontWeight: '600' }}>{year}</button>
            ))}
          </div>
        </div>
      </header>

      {/* PRODUTIVIDADE SECTION */}
      <SectionTitle title="Produtividade Operacional" icon={CheckCircle} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        {PROD_ITEMS.map(item => (
          <KPICard 
            key={item}
            title={item.replace(' (TRÁFICO)', '')} 
            value={currentDisplayProd[item]} 
            variation={isAllYears ? calculateGlobalVariation('prod', item) : (selectedYear > YEARS[0] ? calculateTotalVariation('prod', selectedYear, item) : 0)}
            icon={prodIcons[item] || CheckCircle} 
            color="#10b981" 
            varLabel={isAllYears ? "vs 2021" : `vs ${selectedYear - 1}`}
          />
        ))}
      </div>

      {/* ÍNDICES SECTION */}
      <SectionTitle title="Índices de Criminalidade" icon={AlertTriangle} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
        {STATS_ITEMS.map(item => (
          <KPICard 
            key={item}
            title={item} 
            value={currentDisplayStats[item]} 
            variation={isAllYears ? calculateGlobalVariation('stats', item) : (selectedYear > YEARS[0] ? calculateTotalVariation('stats', selectedYear, item) : 0)}
            icon={statsIcons[item] || AlertTriangle} 
            color="#ef4444" 
            isInverse={true}
            varLabel={isAllYears ? "vs 2021" : `vs ${selectedYear - 1}`}
          />
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>{isAllYears ? 'Tendência Histórica de Crimes' : `Tendência de Crimes (${selectedYear})`}</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} />
                <Tooltip contentStyle={{ background: 'var(--surface-color)', border: '1px solid var(--surface-border)', borderRadius: '8px' }} itemStyle={{ color: 'white' }} />
                <Line type="monotone" dataKey="ROUBO" stroke="var(--primary-color)" strokeWidth={2} dot={{ fill: 'var(--primary-color)' }} />
                <Line type="monotone" dataKey="FURTO" stroke="var(--accent-color)" strokeWidth={2} dot={{ fill: 'var(--accent-color)' }} />
                <Line type="monotone" dataKey="HOMICÍDIO DOLOSO" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>{isAllYears ? 'Produtividade Total por Categoria' : `Produtividade por Categoria (${selectedYear})`}</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PROD_ITEMS.map(item => ({ name: item.split(' ')[0], value: isAllYears ? currentDisplayProd[item] : calculateTotal(statsData[selectedYear][item]) }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={10} />
                <YAxis stroke="var(--text-muted)" fontSize={12} />
                <Tooltip contentStyle={{ background: 'var(--surface-color)', border: '1px solid var(--surface-border)', borderRadius: '8px' }} />
                <Bar dataKey="value" fill="var(--secondary-color)" radius={[4, 4, 0, 0]}>
                  {PROD_ITEMS.map((entry, index) => <Cell key={`cell-${index}`} fill={index % 2 === 0 ? 'var(--primary-color)' : 'var(--accent-color)'} />)}
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
