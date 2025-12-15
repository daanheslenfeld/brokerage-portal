import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { ETF, Transaction, PortfolioHolding, Portfolio } from '../types';

// Sample ETF data
const sampleETFs: ETF[] = [
  {
    isin: 'IE00B5BMR087',
    name: 'iShares Core S&P 500 UCITS ETF',
    category: 'Aandelen',
    subcategory: 'Verenigde Staten',
    currency: 'USD',
    ter: '0.07',
    ytd: '+24.5%',
    volatility: '15.2%',
    fundSize: '€65.2B',
    holdings: '503',
    distribution: 'Accumulating',
    replication: 'Physical',
    price: 512.45,
    change1d: 1.23,
    change1y: 24.5,
  },
  {
    isin: 'IE00B4L5Y983',
    name: 'iShares Core MSCI World UCITS ETF',
    category: 'Aandelen',
    subcategory: 'Wereldwijd',
    currency: 'USD',
    ter: '0.20',
    ytd: '+18.3%',
    volatility: '14.1%',
    fundSize: '€52.1B',
    holdings: '1,517',
    distribution: 'Accumulating',
    replication: 'Physical',
    price: 89.32,
    change1d: 0.45,
    change1y: 18.3,
  },
  {
    isin: 'IE00B4WXJJ64',
    name: 'iShares Core Euro Government Bond UCITS ETF',
    category: 'Obligaties',
    subcategory: 'Euro obligaties',
    currency: 'EUR',
    ter: '0.09',
    ytd: '+2.1%',
    volatility: '5.8%',
    fundSize: '€4.2B',
    holdings: '356',
    distribution: 'Distributing',
    replication: 'Physical',
    price: 124.56,
    change1d: -0.12,
    change1y: 2.1,
  },
  {
    isin: 'IE00B3RBWM25',
    name: 'Vanguard FTSE All-World UCITS ETF',
    category: 'Aandelen',
    subcategory: 'Wereldwijd',
    currency: 'USD',
    ter: '0.22',
    ytd: '+17.8%',
    volatility: '14.5%',
    fundSize: '€28.5B',
    holdings: '3,744',
    distribution: 'Distributing',
    replication: 'Physical',
    price: 118.90,
    change1d: 0.67,
    change1y: 17.8,
  },
  {
    isin: 'IE00BK5BQT80',
    name: 'Vanguard FTSE Developed World UCITS ETF',
    category: 'Aandelen',
    subcategory: 'Ontwikkelde markten',
    currency: 'USD',
    ter: '0.12',
    ytd: '+19.2%',
    volatility: '13.8%',
    fundSize: '€8.9B',
    holdings: '2,124',
    distribution: 'Accumulating',
    replication: 'Physical',
    price: 95.67,
    change1d: 0.89,
    change1y: 19.2,
  },
  {
    isin: 'IE00BKM4GZ66',
    name: 'iShares Core MSCI EM IMI UCITS ETF',
    category: 'Aandelen',
    subcategory: 'Opkomende markten',
    currency: 'USD',
    ter: '0.18',
    ytd: '+8.5%',
    volatility: '18.2%',
    fundSize: '€18.3B',
    holdings: '3,156',
    distribution: 'Accumulating',
    replication: 'Physical',
    price: 32.45,
    change1d: -0.34,
    change1y: 8.5,
  },
  {
    isin: 'IE00B14X4T88',
    name: 'iShares Euro Dividend UCITS ETF',
    category: 'Aandelen',
    subcategory: 'Europa',
    currency: 'EUR',
    ter: '0.40',
    ytd: '+12.3%',
    volatility: '16.5%',
    fundSize: '€1.8B',
    holdings: '30',
    distribution: 'Distributing',
    replication: 'Physical',
    price: 24.89,
    change1d: 0.21,
    change1y: 12.3,
  },
  {
    isin: 'IE00B4ND3602',
    name: 'iShares Physical Gold ETC',
    category: 'Grondstoffen',
    subcategory: 'Goud',
    currency: 'USD',
    ter: '0.12',
    ytd: '+28.4%',
    volatility: '12.1%',
    fundSize: '€15.6B',
    holdings: '1',
    distribution: 'Accumulating',
    replication: 'Physical',
    price: 45.67,
    change1d: 0.56,
    change1y: 28.4,
  },
  {
    isin: 'IE00BFMXXD54',
    name: 'Vanguard S&P 500 UCITS ETF',
    category: 'Aandelen',
    subcategory: 'Verenigde Staten',
    currency: 'USD',
    ter: '0.07',
    ytd: '+24.8%',
    volatility: '15.0%',
    fundSize: '€42.3B',
    holdings: '503',
    distribution: 'Accumulating',
    replication: 'Physical',
    price: 98.45,
    change1d: 1.12,
    change1y: 24.8,
  },
  {
    isin: 'LU0378449770',
    name: 'Lyxor Core STOXX Europe 600 UCITS ETF',
    category: 'Aandelen',
    subcategory: 'Europa',
    currency: 'EUR',
    ter: '0.07',
    ytd: '+14.2%',
    volatility: '13.2%',
    fundSize: '€7.1B',
    holdings: '600',
    distribution: 'Accumulating',
    replication: 'Physical',
    price: 234.56,
    change1d: 0.78,
    change1y: 14.2,
  },
  {
    isin: 'IE00B3F81R35',
    name: 'iShares Core Euro Corp Bond UCITS ETF',
    category: 'Obligaties',
    subcategory: 'Bedrijfsobligaties',
    currency: 'EUR',
    ter: '0.20',
    ytd: '+4.5%',
    volatility: '4.2%',
    fundSize: '€12.8B',
    holdings: '3,245',
    distribution: 'Distributing',
    replication: 'Physical',
    price: 132.45,
    change1d: 0.08,
    change1y: 4.5,
  },
  {
    isin: 'IE00BYVJRP78',
    name: 'iShares Automation & Robotics UCITS ETF',
    category: 'Sectoren',
    subcategory: 'Technologie',
    currency: 'USD',
    ter: '0.40',
    ytd: '+32.1%',
    volatility: '22.5%',
    fundSize: '€3.2B',
    holdings: '145',
    distribution: 'Accumulating',
    replication: 'Physical',
    price: 15.78,
    change1d: 0.34,
    change1y: 32.1,
  },
  {
    isin: 'IE00BYZK4552',
    name: 'iShares Global Clean Energy UCITS ETF',
    category: 'Sectoren',
    subcategory: 'Clean Energy',
    currency: 'USD',
    ter: '0.65',
    ytd: '-8.2%',
    volatility: '28.5%',
    fundSize: '€4.5B',
    holdings: '102',
    distribution: 'Distributing',
    replication: 'Physical',
    price: 8.92,
    change1d: -0.15,
    change1y: -8.2,
  },
  {
    isin: 'IE00B6R52259',
    name: 'iShares MSCI ACWI UCITS ETF',
    category: 'Aandelen',
    subcategory: 'Wereldwijd',
    currency: 'USD',
    ter: '0.20',
    ytd: '+17.5%',
    volatility: '14.3%',
    fundSize: '€9.8B',
    holdings: '2,345',
    distribution: 'Accumulating',
    replication: 'Physical',
    price: 78.34,
    change1d: 0.54,
    change1y: 17.5,
  },
  {
    isin: 'IE00BZ02LR44',
    name: 'Xtrackers MSCI World ESG UCITS ETF',
    category: 'Aandelen',
    subcategory: 'ESG Wereldwijd',
    currency: 'USD',
    ter: '0.20',
    ytd: '+16.8%',
    volatility: '13.5%',
    fundSize: '€5.6B',
    holdings: '678',
    distribution: 'Accumulating',
    replication: 'Physical',
    price: 34.56,
    change1d: 0.28,
    change1y: 16.8,
  },
];

interface PortfolioContextType {
  portfolio: Portfolio;
  etfs: ETF[];
  transactions: Transaction[];
  cashBalance: number;
  isDemoMode: boolean;
  deposit: (amount: number) => void;
  withdraw: (amount: number) => boolean;
  buyETF: (etf: ETF, amount: number, method: 'amount' | 'shares') => boolean;
  sellETF: (isin: string, amount: number, method: 'amount' | 'shares') => boolean;
  getETFByISIN: (isin: string) => ETF | undefined;
  getHoldingByISIN: (isin: string) => PortfolioHolding | undefined;
  enableDemoMode: () => void;
  disableDemoMode: () => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

// Demo portfolio holdings (only loaded in demo mode)
const demoHoldings: PortfolioHolding[] = [
  {
    etf: sampleETFs[0], // iShares Core S&P 500
    shares: 8.78,
    value: 4500,
    weight: 39.1,
    costBasis: 4000,
    return: 500,
    returnPercentage: 12.5,
  },
  {
    etf: sampleETFs[1], // iShares Core MSCI World
    shares: 35.83,
    value: 3200,
    weight: 27.8,
    costBasis: 2950,
    return: 250,
    returnPercentage: 8.3,
  },
  {
    etf: sampleETFs[2], // iShares Core Euro Government Bond
    shares: 16.06,
    value: 2000,
    weight: 17.4,
    costBasis: 1960,
    return: 40,
    returnPercentage: 2.1,
  },
];

const demoTransactions: Transaction[] = [
  {
    id: 'tx-001',
    type: 'deposit',
    amount: 10000,
    date: '2024-01-15T10:00:00Z',
    status: 'completed',
  },
  {
    id: 'tx-002',
    type: 'buy',
    etf: sampleETFs[0],
    shares: 8.78,
    amount: 4000,
    price: 455.58,
    date: '2024-01-20T14:30:00Z',
    status: 'completed',
  },
  {
    id: 'tx-003',
    type: 'buy',
    etf: sampleETFs[1],
    shares: 35.83,
    amount: 2950,
    price: 82.34,
    date: '2024-02-05T09:15:00Z',
    status: 'completed',
  },
  {
    id: 'tx-004',
    type: 'buy',
    etf: sampleETFs[2],
    shares: 16.06,
    amount: 1960,
    price: 122.04,
    date: '2024-03-10T11:45:00Z',
    status: 'completed',
  },
];

export function PortfolioProvider({ children }: { children: ReactNode }) {
  // Start with empty portfolio - user needs to deposit money first
  const [holdings, setHoldings] = useState<PortfolioHolding[]>([]);
  const [cashBalance, setCashBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const calculatePortfolio = (): Portfolio => {
    const totalValue = holdings.reduce((sum, h) => sum + h.value, 0) + cashBalance;
    const totalInvested = holdings.reduce((sum, h) => sum + h.costBasis, 0);
    const totalReturn = holdings.reduce((sum, h) => sum + h.return, 0);

    return {
      totalValue,
      totalInvested,
      totalReturn,
      totalReturnPercentage: totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0,
      holdings: holdings.map(h => ({
        ...h,
        weight: (h.value / (totalValue - cashBalance)) * 100,
      })),
      lastUpdated: new Date().toISOString(),
    };
  };

  const deposit = (amount: number) => {
    setCashBalance(prev => prev + amount);
    setTransactions(prev => [
      {
        id: `tx-${Date.now()}`,
        type: 'deposit',
        amount,
        date: new Date().toISOString(),
        status: 'completed',
      },
      ...prev,
    ]);
  };

  const withdraw = (amount: number): boolean => {
    if (amount > cashBalance) return false;

    setCashBalance(prev => prev - amount);
    setTransactions(prev => [
      {
        id: `tx-${Date.now()}`,
        type: 'withdrawal',
        amount,
        date: new Date().toISOString(),
        status: 'completed',
      },
      ...prev,
    ]);
    return true;
  };

  const buyETF = (etf: ETF, amount: number, method: 'amount' | 'shares'): boolean => {
    const price = etf.price || 100;
    const totalCost = method === 'amount' ? amount : amount * price;
    const sharesToBuy = method === 'amount' ? amount / price : amount;

    if (totalCost > cashBalance) return false;

    setCashBalance(prev => prev - totalCost);

    setHoldings(prev => {
      const existingIndex = prev.findIndex(h => h.etf.isin === etf.isin);

      if (existingIndex >= 0) {
        const existing = prev[existingIndex];
        const newShares = existing.shares + sharesToBuy;
        const newCostBasis = existing.costBasis + totalCost;
        const newValue = newShares * price;

        const updated = [...prev];
        updated[existingIndex] = {
          ...existing,
          shares: newShares,
          value: newValue,
          costBasis: newCostBasis,
          return: newValue - newCostBasis,
          returnPercentage: ((newValue - newCostBasis) / newCostBasis) * 100,
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            etf,
            shares: sharesToBuy,
            value: totalCost,
            weight: 0, // Will be recalculated
            costBasis: totalCost,
            return: 0,
            returnPercentage: 0,
          },
        ];
      }
    });

    setTransactions(prev => [
      {
        id: `tx-${Date.now()}`,
        type: 'buy',
        etf,
        shares: sharesToBuy,
        amount: totalCost,
        price,
        date: new Date().toISOString(),
        status: 'completed',
      },
      ...prev,
    ]);

    return true;
  };

  const sellETF = (isin: string, amount: number, method: 'amount' | 'shares'): boolean => {
    const holdingIndex = holdings.findIndex(h => h.etf.isin === isin);
    if (holdingIndex < 0) return false;

    const holding = holdings[holdingIndex];
    const price = holding.etf.price || 100;
    const sharesToSell = method === 'amount' ? amount / price : amount;

    if (sharesToSell > holding.shares) return false;

    const saleValue = sharesToSell * price;
    const costBasisPerShare = holding.costBasis / holding.shares;
    const costBasisSold = sharesToSell * costBasisPerShare;

    setCashBalance(prev => prev + saleValue);

    setHoldings(prev => {
      const updated = [...prev];
      const newShares = holding.shares - sharesToSell;

      if (newShares <= 0.0001) {
        // Remove holding entirely
        return prev.filter(h => h.etf.isin !== isin);
      }

      const newCostBasis = holding.costBasis - costBasisSold;
      const newValue = newShares * price;

      updated[holdingIndex] = {
        ...holding,
        shares: newShares,
        value: newValue,
        costBasis: newCostBasis,
        return: newValue - newCostBasis,
        returnPercentage: ((newValue - newCostBasis) / newCostBasis) * 100,
      };
      return updated;
    });

    setTransactions(prev => [
      {
        id: `tx-${Date.now()}`,
        type: 'sell',
        etf: holding.etf,
        shares: sharesToSell,
        amount: saleValue,
        price,
        date: new Date().toISOString(),
        status: 'completed',
      },
      ...prev,
    ]);

    return true;
  };

  const getETFByISIN = (isin: string) => sampleETFs.find(e => e.isin === isin);

  const getHoldingByISIN = (isin: string) => holdings.find(h => h.etf.isin === isin);

  const enableDemoMode = () => {
    setHoldings(demoHoldings);
    setCashBalance(1800);
    setTransactions(demoTransactions);
    setIsDemoMode(true);
  };

  const disableDemoMode = () => {
    setHoldings([]);
    setCashBalance(0);
    setTransactions([]);
    setIsDemoMode(false);
  };

  return (
    <PortfolioContext.Provider
      value={{
        portfolio: calculatePortfolio(),
        etfs: sampleETFs,
        transactions,
        cashBalance,
        isDemoMode,
        deposit,
        withdraw,
        buyETF,
        sellETF,
        getETFByISIN,
        getHoldingByISIN,
        enableDemoMode,
        disableDemoMode,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}
