import { ETF_DATABASE } from './etfDatabase';

export interface ModelPortfolio {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  expectedReturn: string;
  risk: 'Laag' | 'Medium' | 'Hoog';
  minInvestment: number;
  managementFee: string;
  rebalancingFrequency: string;
  targetInvestor: string;
  holdings: {
    isin: string;
    allocation: number;
  }[];
  historicalReturns: {
    year: string;
    value: number;
  }[];
  features: string[];
  lastUpdated: string;
}

export const MODEL_PORTFOLIOS: ModelPortfolio[] = [
  {
    id: 'conservative',
    name: 'Defensief Portfolio',
    description: 'Laag risico, stabiel rendement',
    longDescription: 'Het Defensief Portfolio is ontworpen voor beleggers die waarde hechten aan kapitaalbehoud en stabiele groei. Met een focus op obligaties en defensieve aandelen biedt dit portfolio een lagere volatiliteit en meer voorspelbare rendementen. Ideaal voor beleggers die richting pensioen gaan of een korte beleggingshorizon hebben.',
    expectedReturn: '4-6%',
    risk: 'Laag',
    minInvestment: 1000,
    managementFee: '0.15%',
    rebalancingFrequency: 'Kwartaal',
    targetInvestor: 'Conservatieve beleggers, pensioenspaarders',
    holdings: [
      { isin: 'IE00BDBRDM35', allocation: 40 }, // Global Aggregate Bond
      { isin: 'IE00B4WXJJ64', allocation: 20 }, // Euro Government Bond
      { isin: 'IE00B4L5Y983', allocation: 25 }, // MSCI World
      { isin: 'IE00B4ND3602', allocation: 10 }, // Physical Gold
      { isin: 'DE0002635307', allocation: 5 },  // STOXX Europe 600
    ],
    historicalReturns: [
      { year: '2024', value: 8.2 },
      { year: '2023', value: 6.5 },
      { year: '2022', value: -8.3 },
      { year: '2021', value: 5.1 },
      { year: '2020', value: 7.8 },
    ],
    features: [
      'Lage volatiliteit',
      'Stabiele inkomsten uit obligaties',
      'Goud als hedge tegen inflatie',
      'Kwartaallijkse herbalancering',
    ],
    lastUpdated: '2024-12-01',
  },
  {
    id: 'balanced',
    name: 'Gebalanceerd Portfolio',
    description: 'Balans tussen groei en stabiliteit',
    longDescription: 'Het Gebalanceerd Portfolio biedt een evenwichtige mix van groei en stabiliteit. Met een 50/50 verdeling tussen aandelen en obligaties streeft dit portfolio naar een optimale risico-rendementsverhouding. Geschikt voor beleggers met een middellange tot lange beleggingshorizon die bereid zijn enige volatiliteit te accepteren voor een hoger verwacht rendement.',
    expectedReturn: '6-8%',
    risk: 'Medium',
    minInvestment: 2500,
    managementFee: '0.18%',
    rebalancingFrequency: 'Kwartaal',
    targetInvestor: 'Beleggers met middellange horizon (5-10 jaar)',
    holdings: [
      { isin: 'IE00B4L5Y983', allocation: 30 }, // MSCI World
      { isin: 'IE00BK5BQT80', allocation: 15 }, // Vanguard FTSE All-World
      { isin: 'IE00BKM4GZ66', allocation: 10 }, // Emerging Markets
      { isin: 'IE00BDBRDM35', allocation: 25 }, // Global Aggregate Bond
      { isin: 'IE00B4WXJJ64', allocation: 10 }, // Euro Government Bond
      { isin: 'IE00B4ND3602', allocation: 5 },  // Physical Gold
      { isin: 'IE00B1FZS350', allocation: 5 },  // Property Yield
    ],
    historicalReturns: [
      { year: '2024', value: 14.5 },
      { year: '2023', value: 11.2 },
      { year: '2022', value: -12.1 },
      { year: '2021', value: 15.3 },
      { year: '2020', value: 9.8 },
    ],
    features: [
      'Evenwichtige risico-rendement verhouding',
      'Wereldwijde spreiding',
      'Obligaties voor stabiliteit',
      'Alternatieve beleggingen voor diversificatie',
    ],
    lastUpdated: '2024-12-01',
  },
  {
    id: 'growth',
    name: 'Groei Portfolio',
    description: 'Focus op kapitaalgroei',
    longDescription: 'Het Groei Portfolio is gericht op maximale kapitaalgroei op de lange termijn. Met een hoge blootstelling aan aandelen, inclusief opkomende markten en technologie, biedt dit portfolio het hoogste groeipotentieel. Geschikt voor beleggers met een lange beleggingshorizon (10+ jaar) die bereid zijn kortetermijnvolatiliteit te accepteren.',
    expectedReturn: '8-12%',
    risk: 'Hoog',
    minInvestment: 5000,
    managementFee: '0.20%',
    rebalancingFrequency: 'Halfjaar',
    targetInvestor: 'Jonge beleggers met lange horizon (10+ jaar)',
    holdings: [
      { isin: 'IE00B5BMR087', allocation: 30 }, // S&P 500
      { isin: 'IE00B4L5Y983', allocation: 20 }, // MSCI World
      { isin: 'IE00B3WJKG14', allocation: 15 }, // S&P 500 IT Sector
      { isin: 'IE00BKM4GZ66', allocation: 15 }, // Emerging Markets
      { isin: 'DE0002635307', allocation: 10 }, // STOXX Europe 600
      { isin: 'IE00B4ND3602', allocation: 5 },  // Physical Gold
      { isin: 'IE00B1FZS350', allocation: 5 },  // Property Yield
    ],
    historicalReturns: [
      { year: '2024', value: 24.8 },
      { year: '2023', value: 19.3 },
      { year: '2022', value: -15.6 },
      { year: '2021', value: 28.2 },
      { year: '2020', value: 14.5 },
    ],
    features: [
      'Hoog groeipotentieel',
      'Blootstelling aan technologie sector',
      'Opkomende markten voor extra rendement',
      'Minimale obligatie-allocatie',
    ],
    lastUpdated: '2024-12-01',
  },
  {
    id: 'dividend',
    name: 'Dividend Portfolio',
    description: 'Regelmatig inkomen uit dividenden',
    longDescription: 'Het Dividend Portfolio is ontworpen voor beleggers die regelmatige inkomsten uit hun beleggingen willen ontvangen. Met een focus op distributing ETFs en dividendaandelen biedt dit portfolio een stabiele inkomstenstroom. Ideaal voor beleggers die hun inkomen willen aanvullen of in de pensioenperiode zitten.',
    expectedReturn: '5-7%',
    risk: 'Medium',
    minInvestment: 10000,
    managementFee: '0.22%',
    rebalancingFrequency: 'Kwartaal',
    targetInvestor: 'Inkomensbeleggers, gepensioneerden',
    holdings: [
      { isin: 'IE00B3XXRP09', allocation: 25 }, // Vanguard S&P 500 Dist
      { isin: 'IE00B3RBWM25', allocation: 20 }, // Vanguard FTSE All-World Dist
      { isin: 'DE0002635307', allocation: 15 }, // STOXX Europe 600
      { isin: 'IE00B4WXJJ64', allocation: 15 }, // Euro Government Bond Dist
      { isin: 'IE00B1FZS350', allocation: 15 }, // Property Yield Dist
      { isin: 'IE00B0M62Q58', allocation: 10 }, // MSCI World Dist
    ],
    historicalReturns: [
      { year: '2024', value: 12.4 },
      { year: '2023', value: 9.8 },
      { year: '2022', value: -9.2 },
      { year: '2021', value: 18.5 },
      { year: '2020', value: 6.2 },
    ],
    features: [
      'Regelmatige dividenduitkeringen',
      'Mix van aandelen en obligaties',
      'Vastgoed voor extra inkomen',
      'Focus op kwaliteitsbedrijven',
    ],
    lastUpdated: '2024-12-01',
  },
  {
    id: 'sustainable',
    name: 'Duurzaam Portfolio',
    description: 'ESG-gericht beleggen',
    longDescription: 'Het Duurzaam Portfolio combineert financieel rendement met positieve impact. Door te beleggen in bedrijven die hoog scoren op ESG-criteria (Environment, Social, Governance) draagt dit portfolio bij aan een betere wereld. Geschikt voor beleggers die hun waarden willen vertalen naar hun beleggingsstrategie.',
    expectedReturn: '6-9%',
    risk: 'Medium',
    minInvestment: 2500,
    managementFee: '0.25%',
    rebalancingFrequency: 'Kwartaal',
    targetInvestor: 'Waardengedreven beleggers',
    holdings: [
      { isin: 'IE00BHZPJ569', allocation: 40 }, // MSCI World SRI
      { isin: 'IE00BK5BQT80', allocation: 20 }, // Vanguard FTSE All-World
      { isin: 'IE00BKM4GZ66', allocation: 15 }, // Emerging Markets
      { isin: 'IE00BDBRDM35', allocation: 15 }, // Global Aggregate Bond
      { isin: 'IE00B4ND3602', allocation: 10 }, // Physical Gold
    ],
    historicalReturns: [
      { year: '2024', value: 16.2 },
      { year: '2023', value: 12.8 },
      { year: '2022', value: -13.4 },
      { year: '2021', value: 22.1 },
      { year: '2020', value: 11.3 },
    ],
    features: [
      'Strenge ESG-selectiecriteria',
      'Uitsluiting controversiële sectoren',
      'Impactmeting en rapportage',
      'Actief engagement met bedrijven',
    ],
    lastUpdated: '2024-12-01',
  },
  {
    id: 'tech-focus',
    name: 'Tech & Innovatie Portfolio',
    description: 'Focus op technologie en innovatie',
    longDescription: 'Het Tech & Innovatie Portfolio biedt gerichte blootstelling aan de snelst groeiende technologiesectoren. Van kunstmatige intelligentie tot cloud computing, dit portfolio investeert in de bedrijven die de toekomst vormgeven. Hoog risico, maar ook hoog potentieel rendement voor beleggers met sterke overtuiging in technologische vooruitgang.',
    expectedReturn: '10-15%',
    risk: 'Hoog',
    minInvestment: 5000,
    managementFee: '0.23%',
    rebalancingFrequency: 'Halfjaar',
    targetInvestor: 'Risicotolerante beleggers met tech-overtuiging',
    holdings: [
      { isin: 'IE00B3WJKG14', allocation: 35 }, // S&P 500 IT Sector
      { isin: 'IE00B5BMR087', allocation: 25 }, // S&P 500
      { isin: 'IE00B4L5Y983', allocation: 20 }, // MSCI World
      { isin: 'IE00BKM4GZ66', allocation: 15 }, // Emerging Markets (tech exposure)
      { isin: 'IE00B4ND3602', allocation: 5 },  // Physical Gold (hedge)
    ],
    historicalReturns: [
      { year: '2024', value: 35.2 },
      { year: '2023', value: 38.5 },
      { year: '2022', value: -22.8 },
      { year: '2021', value: 32.4 },
      { year: '2020', value: 42.1 },
    ],
    features: [
      'Hoge blootstelling aan tech-sector',
      'Inclusief AI en cloud leaders',
      'Volatiel maar hoog groeipotentieel',
      'Beperkte hedge met goud',
    ],
    lastUpdated: '2024-12-01',
  },
];

// Helper to get full ETF data for portfolio holdings
export function getPortfolioETFs(portfolio: ModelPortfolio) {
  return portfolio.holdings.map(holding => {
    const etf = ETF_DATABASE.find(e => e.isin === holding.isin);
    return {
      ...holding,
      etf,
    };
  }).filter(h => h.etf !== undefined);
}

// Calculate weighted metrics for a portfolio
export function calculatePortfolioMetrics(portfolio: ModelPortfolio) {
  const holdings = getPortfolioETFs(portfolio);

  const weightedTER = holdings.reduce((sum, h) => {
    if (!h.etf) return sum;
    const ter = parseFloat(h.etf.ter.replace('%', ''));
    return sum + (ter * h.allocation / 100);
  }, 0);

  const weightedYTD = holdings.reduce((sum, h) => {
    if (!h.etf) return sum;
    const ytd = parseFloat(h.etf.ytd.replace('%', ''));
    return sum + (ytd * h.allocation / 100);
  }, 0);

  return {
    weightedTER,
    weightedYTD,
    totalHoldings: holdings.reduce((sum, h) => {
      if (!h.etf) return sum;
      return sum + parseInt(h.etf.holdings);
    }, 0),
  };
}
