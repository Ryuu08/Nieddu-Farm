export interface EraData {
  id: string;
  name: string;
  backgroundKey: string;
  currency: "barter" | "eur" | "btc";
  currencyLabel: string;
  currencySymbol: string;
}

export const ERAS: EraData[] = [
  {
    id: "nuragic-sardinia",
    name: "Sardegna nuragica",
    backgroundKey: "era-nuragica",
    currency: "barter",
    currencyLabel: "Barter",
    currencySymbol: "TRADE",
  },
  {
    id: "roman-sardinia",
    name: "Sardegna romana",
    backgroundKey: "era-romana",
    currency: "barter",
    currencyLabel: "Barter",
    currencySymbol: "TRADE",
  },
  {
    id: "judicates-sardinia",
    name: "Sardegna dei giudicati",
    backgroundKey: "era-giudicati",
    currency: "barter",
    currencyLabel: "Barter",
    currencySymbol: "TRADE",
  },
  {
    id: "modern-sardinia",
    name: "Sardegna moderna",
    backgroundKey: "era-moderna",
    currency: "eur",
    currencyLabel: "Euro",
    currencySymbol: "€",
  },
  {
    id: "future-sardinia",
    name: "Sardegna del futuro",
    backgroundKey: "era-futuro",
    currency: "btc",
    currencyLabel: "Bitcoin",
    currencySymbol: "₿",
  },
];
