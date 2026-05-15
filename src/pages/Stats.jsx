import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, TrendingDown, Minus, Calendar, Edit2, Lock } from 'lucide-react';

const Stats = () => {
  const { statsData, updateStats, STATS_ITEMS, MONTHS, YEARS, selectedYear, setSelectedYear, calculateTotal, calculateVariation, calculateTotalVariation, isDirty, saveData, loading, lastSaved } = useData();
  const { isAdmin } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const VariationBadge = ({ value }) => {
    if (value > 0) return <span style={{ color: 'var(--danger)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><TrendingUp size={14} /> {value.toFixed(2)}%</span>;
    if (value < 0) return <span style={{ color: 'var(--success)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><TrendingDown size={14} /> {Math.abs(value).toFixed(2)}%</span>;
    return <span style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Minus size={14} /> 0.00%</span>;
  };

  return (
    <div className="animate-fade-in">
      <header style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '0.2rem' }}>Estatísticas</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Batalhão Leste ({selectedYear})</p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            {isAdmin && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--surface-border)',
                  background: isEditing ? 'var(--primary-color)' : 'transparent',
                  color: isEditing ? 'white' : 'var(--text-main)',
                  fontWeight: '600',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                {isEditing ? <Lock size={14} /> : <Edit2 size={14} />}
                {isEditing ? 'Bloquear Dados' : 'Editar Dados'}
              </button>
            )}
            {isAdmin && (
              <button 
                onClick={() => { saveData(); setIsEditing(false); }}
                disabled={loading || !isDirty}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: isDirty ? 'var(--primary-color)' : 'var(--glass-bg)',
                  color: isDirty ? 'white' : 'var(--text-main)',
                  fontWeight: '600',
                  fontSize: '0.75rem',
                  cursor: (loading || !isDirty) ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? '...' : 'Salvar'}
              </button>
            )}
            {isDirty && <span style={{ color: 'var(--accent-color)', fontSize: '0.7rem', fontWeight: '700' }}>PENDENTE</span>}
          </div>

          <div className="year-selector" style={{ display: 'flex', gap: '2px', background: 'var(--glass-bg)', padding: '3px', borderRadius: '8px', border: '1px solid var(--surface-border)', overflowX: 'auto' }}>
            {YEARS.map(year => (
              <button key={year} onClick={() => setSelectedYear(year)} style={{ padding: '4px 8px', borderRadius: '6px', border: 'none', background: selectedYear === year ? 'var(--primary-color)' : 'transparent', color: selectedYear === year ? 'white' : 'var(--text-muted)', fontWeight: '600', fontSize: '0.7rem' }}>{year}</button>
            ))}
          </div>
        </div>
      </header>

      <div className="glass-panel table-container">
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--surface-border)' }}>
              <th style={{ padding: '1.5rem 1rem', color: 'var(--text-muted)', fontWeight: '500' }}>DESCRIÇÃO ({selectedYear})</th>
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
                  <tr style={{ background: 'var(--glass-bg)' }}>
                    <td style={{ padding: '1rem', fontWeight: '600', fontSize: '0.9rem' }}>{item}</td>
                    {rowData.map((val, idx) => (
                      <td key={idx} style={{ padding: '0.5rem', textAlign: 'center' }}>
                        {isAdmin ? (
                          <input 
                            type="number" 
                            value={val === 0 ? '' : val} 
                            placeholder="0"
                            className="mobile-table-input"
                            onChange={(e) => updateStats(selectedYear, item, idx, e.target.value)}
                            disabled={!isEditing}
                            style={{ 
                              width: '60px', 
                              background: isEditing ? 'var(--glass-bg)' : 'transparent', 
                              border: isEditing ? '1px solid var(--surface-border)' : '1px solid transparent', 
                              borderRadius: '4px',
                              color: 'var(--text-main)',
                              textAlign: 'center',
                              padding: '4px',
                              opacity: val === 0 && !isEditing ? 0.5 : 1,
                              transition: 'all 0.2s'
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
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
      `}} />
    </div>
  );
};

export default Stats;
