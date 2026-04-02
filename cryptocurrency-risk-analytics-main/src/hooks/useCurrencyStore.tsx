import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { SUPPORTED_CURRENCIES, type FiatCurrency } from "@/services/coingecko";

interface CurrencyContextValue {
  currency: FiatCurrency;
  setCurrency: (c: FiatCurrency) => void;
  setCurrencyByCode: (code: string) => void;
}

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: SUPPORTED_CURRENCIES[0],
  setCurrency: () => {},
  setCurrencyByCode: () => {},
});

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<FiatCurrency>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cryptorisk-currency");
      if (saved) {
        const found = SUPPORTED_CURRENCIES.find((c) => c.code === saved);
        if (found) return found;
      }
    }
    return SUPPORTED_CURRENCIES[0];
  });

  const handleSetCurrency = useCallback((c: FiatCurrency) => {
    setCurrency(c);
    localStorage.setItem("cryptorisk-currency", c.code);
  }, []);

  const setCurrencyByCode = useCallback((code: string) => {
    const found = SUPPORTED_CURRENCIES.find((c) => c.code === code);
    if (found) handleSetCurrency(found);
  }, [handleSetCurrency]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency: handleSetCurrency, setCurrencyByCode }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
