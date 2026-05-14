import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const DataContext = createContext();

const STATS_ITEMS = [
  "HOMICÍDIO DOLOSO", "LATROCÍNIO", "ROUBO DE VEÍCULOS", "FURTO DE VEÍCULOS", 
  "ROUBO EM RESIDÊNCIA", "ROUBO A TRANSEUNTES", "ROUBO A COLETIVO", 
  "ROUBO A PONTO COMERCIAL", "MORTE POR INTERVENÇÃO PM", "FURTO", "ROUBO"
];

const PROD_ITEMS = [
  "ARMAS DE FOGO APREENDIDAS", "VEÍCULOS RECUPERADOS", 
  "ENTORPECENTES EM Kg (TRÁFICO)", "MUNIÇÕES", "PRESOS", "SIMULACRO", "FORAGIDOS"
];

const MONTHS = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
const DB_MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
const YEARS = [2021, 2022, 2023, 2024, 2025, 2026];

export const DataProvider = ({ children }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  const initializeYearData = (items) => {
    const data = {};
    YEARS.forEach(year => {
      data[year] = {};
      items.forEach(item => {
        data[year][item] = new Array(12).fill(0);
      });
    });
    return data;
  };

  const [statsData, setStatsData] = useState(() => initializeYearData(STATS_ITEMS));
  const [prodData, setProdData] = useState(() => initializeYearData(PROD_ITEMS));

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('data_entries').select('*');
    if (error) {
      console.error('Erro ao buscar dados:', error);
    } else if (data) {
      const newStats = initializeYearData(STATS_ITEMS);
      const newProd = initializeYearData(PROD_ITEMS);
      data.forEach(entry => {
        const row = DB_MONTHS.map(m => Number(entry[m] || 0));
        if (entry.type === 'stats') {
          if (newStats[entry.year]) newStats[entry.year][entry.item] = row;
        } else {
          if (newProd[entry.year]) newProd[entry.year][entry.item] = row;
        }
      });
      setStatsData(newStats);
      setProdData(newProd);
    }
    setLoading(false);
    setIsDirty(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const saveData = useCallback(async () => {
    if (!isDirty) return;

    setLoading(true);
    const entries = [];
    
    // Prepare Stats entries
    YEARS.forEach(year => {
      STATS_ITEMS.forEach(item => {
        const row = statsData[year][item];
        const entry = { type: 'stats', year, item };
        DB_MONTHS.forEach((m, i) => entry[m] = row[i]);
        entries.push(entry);
      });
    });

    // Prepare Prod entries
    YEARS.forEach(year => {
      PROD_ITEMS.forEach(item => {
        const row = prodData[year][item];
        const entry = { type: 'prod', year, item };
        DB_MONTHS.forEach((m, i) => entry[m] = row[i]);
        entries.push(entry);
      });
    });

    const { error } = await supabase
      .from('data_entries')
      .upsert(entries, { onConflict: 'type,year,item' });

    if (error) {
      console.error('Erro ao salvar no banco:', error);
    } else {
      setIsDirty(false);
      setLastSaved(new Date());
    }
    setLoading(false);
  }, [isDirty, statsData, prodData]);

  // Auto-save every 5 minutes
  useEffect(() => {
    const timer = setInterval(() => {
      if (isDirty) {
        console.log('Iniciando salvamento automático (5 min)...');
        saveData();
      }
    }, 5 * 60 * 1000);
    return () => clearInterval(timer);
  }, [isDirty, saveData]);

  const updateStats = (year, item, monthIdx, value) => {
    const val = value === '' ? 0 : Number(value);
    setStatsData(prev => ({
      ...prev,
      [year]: {
        ...prev[year],
        [item]: prev[year][item].map((v, i) => i === monthIdx ? val : v)
      }
    }));
    setIsDirty(true);
  };

  const updateProd = (year, item, monthIdx, value) => {
    const val = value === '' ? 0 : Number(value);
    setProdData(prev => ({
      ...prev,
      [year]: {
        ...prev[year],
        [item]: prev[year][item].map((v, i) => i === monthIdx ? val : v)
      }
    }));
    setIsDirty(true);
  };

  const calculateTotal = (dataArray) => dataArray ? dataArray.reduce((acc, curr) => acc + curr, 0) : 0;
  
  const calculateVariation = (type, year, item, monthIdx) => {
    const currentYearData = type === 'stats' ? statsData[year] : prodData[year];
    const previousYearData = type === 'stats' ? statsData[year - 1] : prodData[year - 1];
    if (!currentYearData || !previousYearData) return 0;
    const currentVal = currentYearData[item][monthIdx];
    const previousVal = previousYearData[item][monthIdx];
    if (previousVal === 0) return currentVal > 0 ? 100 : 0;
    return ((currentVal - previousVal) / previousVal) * 100;
  };

  const calculateTotalVariation = (type, year, item) => {
    const currentYearData = type === 'stats' ? statsData[year] : prodData[year];
    const previousYearData = type === 'stats' ? statsData[year - 1] : prodData[year - 1];
    if (!currentYearData || !previousYearData) return 0;
    const currentTotal = calculateTotal(currentYearData[item]);
    const previousTotal = calculateTotal(previousYearData[item]);
    if (previousTotal === 0) return currentTotal > 0 ? 100 : 0;
    return ((currentTotal - previousTotal) / previousTotal) * 100;
  };

  return (
    <DataContext.Provider value={{ 
      statsData, prodData, updateStats, updateProd, 
      STATS_ITEMS, PROD_ITEMS, MONTHS, YEARS,
      selectedYear, setSelectedYear, loading, isDirty, lastSaved, saveData,
      calculateTotal, calculateVariation, calculateTotalVariation
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
