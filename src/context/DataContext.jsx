import React, { createContext, useContext, useState, useEffect } from 'react';
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

  // Fetch data from Supabase
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
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateStats = async (year, item, monthIdx, value) => {
    const newValues = statsData[year][item].map((v, i) => i === monthIdx ? Number(value) : v);
    
    // Optimistic Update
    setStatsData(prev => ({
      ...prev,
      [year]: { ...prev[year], [item]: newValues }
    }));

    // Persist to Supabase
    const upsertData = {
      type: 'stats',
      year,
      item,
      [DB_MONTHS[monthIdx]]: Number(value)
    };

    const { error } = await supabase
      .from('data_entries')
      .upsert(upsertData, { onConflict: 'type,year,item' });

    if (error) console.error('Erro ao salvar no banco:', error);
  };

  const updateProd = async (year, item, monthIdx, value) => {
    const newValues = prodData[year][item].map((v, i) => i === monthIdx ? Number(value) : v);
    
    setProdData(prev => ({
      ...prev,
      [year]: { ...prev[year], [item]: newValues }
    }));

    const upsertData = {
      type: 'prod',
      year,
      item,
      [DB_MONTHS[monthIdx]]: Number(value)
    };

    const { error } = await supabase
      .from('data_entries')
      .upsert(upsertData, { onConflict: 'type,year,item' });

    if (error) console.error('Erro ao salvar no banco:', error);
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
      selectedYear, setSelectedYear, loading,
      calculateTotal, calculateVariation, calculateTotalVariation
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
