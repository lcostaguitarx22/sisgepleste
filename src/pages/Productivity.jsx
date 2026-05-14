import React from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, TrendingDown, Minus, Calendar } from 'lucide-react';

const Productivity = () => {
  const { prodData, updateProd, PROD_ITEMS, MONTHS, YEARS, selectedYear, setSelectedYear, calculateTotal, calculateVariation, calculateTotalVariation, isDirty, saveData, loading, lastSaved } = useData();
  const { isAdmin } = useAuth();

  const VariationBadge = ({ value }) => {
    if (value > 0) return <span style={{ color: 'var(--success)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><TrendingUp size={14} /> {value.toFixed(2)}%</span>;
    if (value < 0) return <span style={{ color: 'var(--danger)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><TrendingDown size={14} /> {Math.abs(value).toFixed(2)}%</span>;
    return <span style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Minus size={14} /> 0.00%</span>;
  };

  return (
    <div className="animate-fade-in">
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Produtividade Policial</h1>
          <p style={{ color: 'var(--text-muted)' }}>Desempenho operacional comparativo - Batalhão Leste</p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isDirty && (
            <span style={{ color: 'var(--accent-color)', fontSize: '0.8rem', fontWeight: '600', animation: 'pulse 2s infinite' }}>
              Alterações não salvas
            </span>
          )}
          {lastSaved && !isDirty && (
            <span style={{ color: 'var(--success)', fontSize: '0.8rem' }}>
              Salvo às {lastSaved.toLocaleTimeString()}
            </span>
          )}
          {isAdmin && (
            <button 
              onClick={saveData}
              disabled={loading || !isDirty}
              style={{
                padding: '8px 20px',
                borderRadius: '8px',
                border: 'none',
                background: isDirty ? 'linear-gradient(135deg, var(--primary-color), var(--accent-color))' : 'var(--glass-bg)',
                color: isDirty ? 'white' : 'var(--text-muted)',
                fontWeight: '600',
                cursor: isDirty ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s'
              }}
            >
              {loading ? 'Salvando...' : 'Salvar Dados'}
            </button>
          )}
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

      <div className="glass-panel" style={{ overflowX: 'auto', padding: '1rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--surface-border)' }}>
              <th style={{ padding: '1.5rem 1rem', color: 'var(--text-muted)', fontWeight: '500' }}>ITEM ({selectedYear})</th>
              {MONTHS.map(m => <th key={m} style={{ padding: '1rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{m}</th>)}
              <th style={{ padding: '1rem', textAlign: 'center', color: 'var(--primary-color)' }}>TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {PROD_ITEMS.map((item) => {
              const rowData = prodData[selectedYear][item];
              const total = calculateTotal(rowData);

              return (
                <React.Fragment key={item}>
                  <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <td style={{ padding: '1rem', fontWeight: '600', fontSize: '0.9rem' }}>{item}</td>
                    {rowData.map((val, idx) => (
                      <td key={idx} style={{ padding: '0.5rem', textAlign: 'center' }}>
                        {isAdmin ? (
                          <input 
                            type="number" 
                            value={val === 0 ? '' : val} 
                            placeholder="0"
                            step="0.01"
                            onChange={(e) => updateProd(selectedYear, item, idx, e.target.value)}
                            onFocus={(e) => e.target.value === '0' && (e.target.value = '')}
                            style={{ 
                              width: '65px', 
                              background: 'rgba(255,255,255,0.05)', 
                              border: '1px solid var(--surface-border)', 
                              borderRadius: '4px',
                              color: 'white',
                              textAlign: 'center',
                              padding: '4px',
                              opacity: val === 0 ? 0.5 : 1,
                              transition: 'opacity 0.2s'
                            }}
                          />
                        ) : (
                          <span style={{ fontSize: '0.9rem', opacity: val === 0 ? 0.5 : 1 }}>{val}</span>
                        )}
                      </td>
                    ))}
                    <td style={{ padding: '1rem', textAlign: 'center', fontWeight: '700', color: 'var(--primary-color)' }}>{total % 1 === 0 ? total : total.toFixed(2)}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '4px 1rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>Var. vs {selectedYear - 1}</td>
                    {MONTHS.map((_, idx) => (
                      <td key={idx} style={{ textAlign: 'center', padding: '4px', fontSize: '0.8rem' }}>
                        <VariationBadge value={calculateVariation('prod', selectedYear, item, idx)} />
                      </td>
                    ))}
                    <td style={{ textAlign: 'center', padding: '4px', fontSize: '0.8rem' }}>
                      <VariationBadge value={calculateTotalVariation('prod', selectedYear, item)} />
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
      `}} />
    </div>
  );
};

export default Productivity;
