import React, { createContext, useContext, useState, useEffect } from 'react';

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
const YEARS = [2021, 2022, 2023, 2024, 2025, 2026];

export const DataProvider = ({ children }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

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

  const [statsData, setStatsData] = useState(() => {
    const saved = localStorage.getItem('sisgep_stats_v2');
    const baseData = initializeYearData(STATS_ITEMS);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...baseData, ...parsed };
    }
    return baseData;
  });

  const [prodData, setProdData] = useState(() => {
    const saved = localStorage.getItem('sisgep_prod_v2');
    const baseData = initializeYearData(PROD_ITEMS);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...baseData, ...parsed };
    }
    return baseData;
  });

  useEffect(() => {
    localStorage.setItem('sisgep_stats_v2', JSON.stringify(statsData));
  }, [statsData]);

  useEffect(() => {
    localStorage.setItem('sisgep_prod_v2', JSON.stringify(prodData));
  }, [prodData]);

  const updateStats = (year, item, monthIdx, value) => {
    setStatsData(prev => ({
      ...prev,
      [year]: {
        ...prev[year],
        [item]: prev[year][item].map((v, i) => i === monthIdx ? Number(value) : v)
      }
    }));
  };

  const updateProd = (year, item, monthIdx, value) => {
    setProdData(prev => ({
      ...prev,
      [year]: {
        ...prev[year],
        [item]: prev[year][item].map((v, i) => i === monthIdx ? Number(value) : v)
      }
    }));
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
      selectedYear, setSelectedYear,
      calculateTotal, calculateVariation, calculateTotalVariation
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
