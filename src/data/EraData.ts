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
    backgroundKey: "bg-2",
    currency: "barter",
    currencyLabel: "Barter",
    currencySymbol: "TRADE",
  },
  {
    id: "roman-sardinia",
    name: "Sardegna romana",
    backgroundKey: "bg-3",
    currency: "barter",
    currencyLabel: "Barter",
    currencySymbol: "TRADE",
  },
  {
    id: "judicates-sardinia",
    name: "Sardegna dei giudicati",
    backgroundKey: "bg-4",
    currency: "barter",
    currencyLabel: "Barter",
    currencySymbol: "TRADE",
  },
  {
    id: "modern-sardinia",
    name: "Sardegna moderna",
    backgroundKey: "bg-1",
    currency: "eur",
    currencyLabel: "Euro",
    currencySymbol: "€",
  },
  {
    id: "future-sardinia",
    name: "Sardegna del futuro",
    backgroundKey: "bg-5",
    currency: "btc",
    currencyLabel: "Bitcoin",
    currencySymbol: "₿",
  },
];
