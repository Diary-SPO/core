import React, {
  createContext, useContext, useState, useEffect, ReactNode,
} from 'react';

interface CookieContextType {
  cookie: string | null;
  saveCookie: (newCookie: string) => void;
  clearCookie: () => void;
}

const CookieContext = createContext<CookieContextType | undefined>(undefined);

export const useCookies = (): CookieContextType => {
  const context = useContext(CookieContext);
  if (context === undefined) {
    throw new Error('useCookies must be used within a CookieProvider');
  }
  return context;
};

interface CookieProviderProps {
  children: ReactNode;
}

export const CookieProvider: React.FC<CookieProviderProps> = ({ children }) => {
  const [cookie, setCookie] = useState<string | null>(null);

  useEffect(() => {
    // Update cookie
    const storedCookie = localStorage.getItem('cookie');
    if (storedCookie) {
      setCookie(storedCookie);
    }
  }, []);

  const saveCookie = (newCookie: string) => {
    console.log(newCookie);
    // Save cookie
    localStorage.setItem('cookie', newCookie);
    setCookie(newCookie);
  };

  const clearCookie = () => {
    // Clear cookie
    localStorage.removeItem('cookie');
    setCookie(null);
  };

  const value: CookieContextType = { cookie, saveCookie, clearCookie };

  return (
    <CookieContext.Provider value={value}>
      {children}
    </CookieContext.Provider>
  );
};
