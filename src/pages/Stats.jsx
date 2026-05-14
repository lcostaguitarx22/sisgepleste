import React from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, TrendingDown, Minus, Calendar } from 'lucide-react';

const Stats = () => {
  const { statsData, updateStats, STATS_ITEMS, MONTHS, YEARS, selectedYear, setSelectedYear, calculateTotal, calculateVariation, calculateTotalVariation } = useData();
  const { isAdmin } = useAuth();

  const VariationBadge = ({ value }) => {
    if (value > 0) return <span style={{ color: 'var(--danger)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><TrendingUp size={14} /> {value.toFixed(1)}%</span>;
    if (value < 0) return <span style={{ color: 'var(--success)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><TrendingDown size={14} /> {Math.abs(value).toFixed(1)}%</span>;
    return <span style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Minus size={14} /> 0%</span>;
  };

  return (
    <div className="animate-fade-in">
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Estatísticas de Crimes</h1>
          <p style={{ color: 'var(--text-muted)' }}>Comparativo anual de índices criminais - Batalhão Leste</p>
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
            {STATS_ITEMS.map((item) => {
              const rowData = statsData[selectedYear][item];
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
                            value={val} 
                            onChange={(e) => updateStats(selectedYear, item, idx, e.target.value)}
                            style={{ 
                              width: '50px', 
                              background: 'rgba(255,255,255,0.05)', 
                              border: '1px solid var(--surface-border)', 
                              borderRadius: '4px',
                              color: 'white',
                              textAlign: 'center',
                              padding: '4px'
                            }}
                          />
                        ) : (
                          <span style={{ fontSize: '0.9rem' }}>{val}</span>
                        )}
                      </td>
                    ))}
                    <td style={{ padding: '1rem', textAlign: 'center', fontWeight: '700', color: 'var(--primary-color)' }}>{total}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '4px 1rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>Var. vs {selectedYear - 1}</td>
                    {MONTHS.map((_, idx) => (
                      <td key={idx} style={{ textAlign: 'center', padding: '4px', fontSize: '0.8rem' }}>
                        <VariationBadge value={calculateVariation('stats', selectedYear, item, idx)} />
                      </td>
                    ))}
                    <td style={{ textAlign: 'center', padding: '4px', fontSize: '0.8rem' }}>
                      <VariationBadge value={calculateTotalVariation('stats', selectedYear, item)} />
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
      `}} />
    </div>
  );
};

export default Stats;
